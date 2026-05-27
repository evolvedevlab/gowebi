package main

import (
	"embed"
	"fmt"
	"gowebi"
	"log"
	"net/http"
	"time"
)

type Data struct {
	Msg string `json:"msg"`
}

//go:embed dist/*
var dist embed.FS

// run: make watch
func main() {
	app, err := gowebi.New(gowebi.WithBundleFS(dist), gowebi.WithUnsafePoolMode(true))
	if err != nil {
		log.Fatal(err)
	}

	// expose only the client bundle dir
	http.Handle("/client/", gowebi.ServeBundle())
	http.HandleFunc("/dash", func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		err := app.Renderer.Render(r.Context(), w, http.StatusOK, gowebi.RenderOptions{
			Name: "web/pages/Dash.jsx",
		})
		log.Println("render error:", err, time.Since(start))
	})
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		start := time.Now()
		err := app.Renderer.Render(r.Context(), w, http.StatusOK, gowebi.RenderOptions{
			Name:  "web/pages/Home.jsx",
			Props: Data{Msg: "Hello"},
		})
		log.Println("render error:", err, time.Since(start))
	})

	fmt.Println("listening...")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
