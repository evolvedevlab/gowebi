package gowebi

import (
	"html/template"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/dop251/goja"
)

const testTmpl = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    {{.Head}}
  </head>
  <body>
    <div id="app">{{.App}}</div>
  </body>
</html>`

func BenchmarkUnsafeRender(b *testing.B) {
	comp, err := os.ReadFile("testdata/simplecomp.js")
	if err != nil {
		b.Fatal(err)
	}

	program, err := goja.Compile("", string(comp), false)
	if err != nil {
		b.Fatal(err)
	}

	bm := map[string]*Bundle{
		"test": {Program: program},
	}

	pool, err := newPool(1, bm)
	if err != nil {
		b.Fatal(err)
	}

	r := NewPooledRenderer(
		pool,
		bm,
		template.Must(template.New("").Parse(testTmpl)),
		true,
	)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		rr := httptest.NewRecorder()

		err := r.Render(
			rr,
			http.StatusOK,
			RenderOptions{
				Name:      "test",
				NoHydrate: true,
			},
		)
		if err != nil {
			b.Fatal(err)
		}
	}
}

func BenchmarkRender(b *testing.B) {
	comp, err := os.ReadFile("testdata/simplecomp.js")
	if err != nil {
		b.Fatal(err)
	}

	program, err := goja.Compile("", string(comp), false)
	if err != nil {
		b.Fatal(err)
	}

	r := NewRenderer(
		map[string]*Bundle{
			"test": {Program: program},
		},
		template.Must(template.New("").Parse(testTmpl)),
		true,
	)

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		rr := httptest.NewRecorder()

		err := r.Render(
			rr,
			http.StatusOK,
			RenderOptions{
				Name:      "test",
				NoHydrate: true,
			},
		)
		if err != nil {
			b.Fatal(err)
		}
	}
}
