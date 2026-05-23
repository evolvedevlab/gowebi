package gowebi

import (
	"encoding/json"
	"io"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"runtime/debug"
	"strings"

	"github.com/dop251/goja"
)

type Bundle struct {
	Program    *goja.Program
	ServerPath string
	ClientPath string
}

type Metafile struct {
	Server Build `json:"server"`
	Client Build `json:"client"`
}

type Build struct {
	Outputs map[string]*Output `json:"outputs"`
}

type Output struct {
	EntryPoint string `json:"entryPoint"`
}

func bundleFromMetafile(r io.Reader) (map[string]*Bundle, error) {
	// loads esbuild metafile
	var mf Metafile
	if err := json.NewDecoder(r).Decode(&mf); err != nil {
		return nil, err
	}

	bundles := make(map[string]*Bundle)
	// hydration script
	// entrypoint to outPath
	clientOut := make(map[string]string, len(mf.Client.Outputs))
	for outPath, o := range mf.Client.Outputs {
		// exclude chunks
		if !strings.Contains(outPath, "/chunks/") && len(o.EntryPoint) > 0 {
			clientOut[o.EntryPoint] = outPath
		}
	}

	cacheDir, err := os.UserCacheDir()
	if err != nil {
		return nil, err
	}
	// writing all sourcemaps in temp dir from fs.FS
	// this is needed as goja cannot use fs.FS to load sourcemaps
	outDir := filepath.Join(cacheDir, "gowebi", "sourcemaps", getBuildHash())
	if err := extractAndWriteSourcemaps(cfg.BundleFS, outDir); err != nil {
		return nil, err
	}

	for outPath, o := range mf.Server.Outputs {
		if filepath.Ext(outPath) != ".js" {
			continue
		}

		outPathRel, err := filepath.Rel(cfg.BundleDir, outPath)
		if err != nil {
			return nil, err
		}

		// read server bundle js code
		code, err := fs.ReadFile(cfg.BundleFS, filepath.ToSlash(outPathRel))
		if err != nil {
			return nil, err
		}

		program, err := goja.Compile(filepath.Join(outDir, "server")+string(os.PathSeparator), string(code), true)
		if err != nil {
			return nil, err
		}

		clientPath, ok := clientOut[o.EntryPoint]
		if !ok {
			log.Printf("%s: hydration script not found", o.EntryPoint)
		}

		clientPath, err = filepath.Rel(cfg.BundleDir, clientPath)
		if err != nil {
			return nil, err
		}

		bundles[o.EntryPoint] = &Bundle{
			ServerPath: outPath,
			ClientPath: "/" + filepath.ToSlash(clientPath),
			Program:    program,
		}
	}

	return bundles, nil
}

func extractAndWriteSourcemaps(fsys fs.FS, outDir string) error {
	return fs.WalkDir(fsys, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		// skip dirs
		if d.IsDir() {
			return nil
		}
		// skip files except .map
		if filepath.Ext(path) != ".map" {
			return nil
		}

		data, err := fs.ReadFile(fsys, path)
		if err != nil {
			return err
		}

		target := filepath.Join(outDir, path)

		// create parent dirs
		err = os.MkdirAll(filepath.Dir(target), 0755)
		if err != nil {
			return err
		}

		return os.WriteFile(target, data, 0644)
	})
}

func getBuildHash() string {
	info, ok := debug.ReadBuildInfo()
	if !ok {
		return "dev"
	}

	for _, s := range info.Settings {
		if s.Key == "vcs.revision" {
			if len(s.Value) > 12 {
				return s.Value[:12]
			}
			return s.Value
		}
	}

	return "dev"
}
