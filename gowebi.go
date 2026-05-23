package gowebi

import (
	"fmt"
	"html/template"
	"io/fs"
	"os"
	"path/filepath"
)

var cfg *Config

type Config struct {
	BundleDir string
	// Needs to be set in production.
	//
	// example: //go:embed dist/*
	BundleFS fs.FS
	// Enables vm pooling for lower allocations and better performance.
	// Default mode creates a new vm per request.
	//
	// WARN: global JS state may persist between requests.
	UnsafePoolMode bool
	UnsafePoolSize int
	// Suppresses server-side console logs from JS.
	SuppressConsoleLogs bool
	IsDev               bool
}

type GoWebi struct {
	Renderer Renderer

	cfg       *Config
	bundleMap map[string]*Bundle
}

func (gw *GoWebi) BundleDir() string {
	return gw.cfg.BundleDir
}

func New(c *Config) (*GoWebi, error) {
	// set global cfg
	cfg = c
	if cfg.IsDev {
		cfg.BundleFS = os.DirFS(cfg.BundleDir)
	} else {
		if cfg.BundleFS == nil {
			return nil, fmt.Errorf("BundleFS is required in production")
		}

		var err error
		cfg.BundleFS, err = fs.Sub(cfg.BundleFS, filepath.Clean(c.BundleDir))
		if err != nil {
			return nil, err
		}
	}

	tmpl, err := template.ParseFS(cfg.BundleFS, "index.html")
	if err != nil {
		return nil, err
	}

	f, err := cfg.BundleFS.Open("metafile.json")
	if err != nil {
		return nil, err
	}
	defer f.Close()

	bundles, err := bundleFromMetafile(f)
	if err != nil {
		return nil, err
	}

	var renderer Renderer
	if cfg.UnsafePoolMode {
		if cfg.UnsafePoolSize == 0 {
			cfg.UnsafePoolSize = 10
		}

		pool, err := newPool(cfg.UnsafePoolSize, bundles)
		if err != nil {
			return nil, err
		}

		renderer = NewPooledRenderer(pool, bundles, tmpl, cfg.IsDev)
	} else {
		renderer = NewRenderer(bundles, tmpl, cfg.IsDev)
	}

	return &GoWebi{
		cfg:       cfg,
		Renderer:  renderer,
		bundleMap: bundles,
	}, nil
}
