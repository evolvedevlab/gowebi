package gowebi

import (
	"net/http"
)

// Serves the contents of BundleDir.
//
// example: http.Handle("/client/", ServeBundle())
func ServeBundle() http.Handler {
	return http.FileServerFS(cfg.BundleFS)
}
