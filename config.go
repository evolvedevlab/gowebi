package gowebi

import (
	"io/fs"
	"os"
)

type OptFunc func(*Config)

func WithUnsafePoolMode(enable bool) OptFunc {
	return func(c *Config) {
		c.UnsafePoolMode = true
	}
}

func WithUnsafePoolSize(size int) OptFunc {
	return func(c *Config) {
		c.UnsafePoolSize = size
	}
}

func WithBundleFS(fsys fs.FS) OptFunc {
	return func(c *Config) {
		c.BundleFS = fsys
	}
}

func WithBundleDir(dir string) OptFunc {
	return func(c *Config) {
		c.BundleDir = dir
	}
}

func WithSuppressConsoleLogs(disable bool) OptFunc {
	return func(c *Config) {
		c.SuppressConsoleLogs = disable
	}
}

func WithAutoBrowserReload(enable bool) OptFunc {
	return func(c *Config) {
		c.AutoBrowserReload = enable
	}
}

func WithIsDev(isDev bool) OptFunc {
	return func(c *Config) {
		c.IsDev = isDev
	}
}

func defaultConfig() *Config {
	isDev := os.Getenv("ENVIRONMENT") != "production"
	return &Config{
		BundleDir:         "dist",
		AutoBrowserReload: true,
		IsDev:             isDev,
	}
}
