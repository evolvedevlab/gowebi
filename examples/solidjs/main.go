package main

import (
	"fmt"
	"gosolid"
	"log"
	"net/http"
	"os"
)

type Data struct {
	Msg string `json:"msg"`
}

// run: export ENVIRONMENT=development && node esbuild.config.js && go run .
func main() {
	app, err := gosolid.New(gosolid.Config{
		BundleDir: "./dist",
		IsDev:     os.Getenv("ENVIRONMENT") == "development",
	})
	if err != nil {
		log.Fatal(err)
	}

	// expose only the client bundle dir
	http.Handle("/client/", http.StripPrefix("/client/", http.FileServer(http.Dir("dist/client"))))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		err := app.Renderer.Render(w, http.StatusOK, gosolid.RenderOptions{
			Name:  "Home.jsx",
			Props: Data{Msg: "gello"},
		})
		log.Println("render error:", err)
	})

	fmt.Println("listening...")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
