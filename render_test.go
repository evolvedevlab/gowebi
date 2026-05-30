package gowebi

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"net/http"
	"net/http/httptest"
	"os"
	"sync"
	"testing"
	"time"

	"github.com/dop251/goja"
)

const testBlockForeverRenderFn = "globalThis.render = () => { for (;;) {}; };"
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

func TestRender_Concurrent(t *testing.T) {
	comp, err := os.ReadFile("testdata/simpleComp.js")
	if err != nil {
		t.Fatal(err)
	}

	program, err := goja.Compile("", string(comp), false)
	if err != nil {
		t.Fatal(err)
	}

	r := NewRenderer(
		map[string]*Bundle{
			"test": {Program: program},
		},
		template.Must(template.New("").Parse(testTmpl)),
		false, false,
	)

	var (
		workers = 100
		wg      sync.WaitGroup
		errCh   = make(chan error, workers)
	)

	for range workers {
		wg.Add(1)
		go func() {
			defer wg.Done()

			rr := httptest.NewRecorder()
			err := r.Render(
				context.Background(),
				rr,
				http.StatusOK,
				RenderOptions{
					Name: "test",
				},
			)
			if err != nil {
				errCh <- err
			}
		}()
	}

	wg.Wait()
	close(errCh)

	for err := range errCh {
		t.Errorf("render failed: %v", err)
	}
}

func TestRenderTimeout(t *testing.T) {
	program, err := goja.Compile("", testBlockForeverRenderFn, false)
	if err != nil {
		t.Fatal(err)
	}

	r := NewRenderer(
		map[string]*Bundle{
			"test": {Program: program},
		},
		template.Must(template.New("").Parse(testTmpl)),
		false, false,
	)

	// little more time is needed as Render is fast locally
	ctx, cancel := context.WithTimeout(t.Context(), time.Second)
	defer cancel()

	rr := httptest.NewRecorder()
	err = r.Render(ctx, rr, 200, RenderOptions{
		Name: "test",
	})

	if !errors.Is(err, ctx.Err()) {
		t.Errorf("want: %v, received: %v", ctx.Err(), err)
	}
}

func BenchmarkRender(b *testing.B) {
	scomp, err := os.ReadFile("testdata/simpleComp.js")
	if err != nil {
		b.Fatal(err)
	}

	hcomp, err := os.ReadFile("testdata/heavyComp.js")
	if err != nil {
		b.Fatal(err)
	}

	sprog, err := goja.Compile("", string(scomp), false)
	if err != nil {
		b.Fatal(err)
	}

	hprog, err := goja.Compile("", string(hcomp), false)
	if err != nil {
		b.Fatal(err)
	}

	r := NewRenderer(
		map[string]*Bundle{
			"simple": {Program: sprog},
			"heavy":  {Program: hprog},
		},
		template.Must(template.New("").Parse(testTmpl)),
		false, false,
	)

	b.Run("simple", func(b *testing.B) {
		b.ResetTimer()
		for i := 0; i < b.N; i++ {
			rr := httptest.NewRecorder()

			err := r.Render(
				b.Context(),
				rr,
				http.StatusOK,
				RenderOptions{
					Name: "simple",
				},
			)
			if err != nil {
				b.Fatal(err)
			}
		}
	})

	scales := []int{
		1,
		10,
		50,
		100,
		500,
	}

	b.Run("heavy", func(b *testing.B) {
		for _, scale := range scales {
			b.Run(fmt.Sprintf("scale=%d", scale), func(b *testing.B) {
				props, err := loadHeavyProps(scale)
				if err != nil {
					b.Fatal(err)
				}

				b.ResetTimer()
				for i := 0; i < b.N; i++ {
					rr := httptest.NewRecorder()

					err := r.Render(
						b.Context(),
						rr,
						http.StatusOK,
						RenderOptions{
							Name:  "heavy",
							Props: props,
						},
					)
					if err != nil {
						b.Fatal(err)
					}
				}
			})
		}
	})
}

type testData struct {
	Title    string `json:"title"`
	Sections []struct {
		Title string `json:"title"`
		Items []struct {
			ID          string   `json:"id"`
			Title       string   `json:"title"`
			Description string   `json:"description"`
			Tags        []string `json:"tags"`
			Comments    []struct {
				Author string `json:"author"`
				Body   string `json:"body"`
			} `json:"comments"`
		} `json:"items"`
	} `json:"sections"`
}

func loadHeavyProps(scale int) (*testData, error) {
	var props testData

	raw, err := os.ReadFile("testdata/testData.json")
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(raw, &props); err != nil {
		return nil, err
	}

	if scale > 1 {
		og := props.Sections
		for i := 1; i < scale; i++ {
			props.Sections = append(props.Sections, og...)
		}
	}

	return &props, nil
}
