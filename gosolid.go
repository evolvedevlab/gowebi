package gosolid

import (
	"encoding/json"
	"html/template"
	"os"
	"path/filepath"

	"github.com/dop251/goja"
)

type Config struct {
	BundleDir string
	IsDev     bool
}

type GoSolid struct {
	cfg      Config
	Renderer Renderer

	bundleMap map[string]*Bundle
}

type Bundle struct {
	Program    *goja.Program
	ServerPath string `json:"ssr"`
	ClientPath string `json:"client"`
}

func New(cfg Config) (*GoSolid, error) {
	tmpl, err := template.ParseFiles(filepath.Join(cfg.BundleDir, "index.html"))
	if err != nil {
		return nil, err
	}

	var b map[string]*Bundle
	manifestPath := filepath.Join(cfg.BundleDir, "manifest.json")
	f, err := os.Open(manifestPath)
	if err != nil {
		return nil, err
	}

	if err := json.NewDecoder(f).Decode(&b); err != nil {
		return nil, err
	}

	for name, bundle := range b {
		code, err := os.ReadFile(filepath.Join(cfg.BundleDir, bundle.ServerPath))
		if err != nil {
			return nil, err
		}

		bundle.Program, err = goja.Compile(name, string(code), false)
		if err != nil {
			return nil, err
		}
	}

	return &GoSolid{
		cfg:       cfg,
		Renderer:  NewRenderer(b, tmpl, cfg.IsDev), // TODO
		bundleMap: b,
	}, nil
}
