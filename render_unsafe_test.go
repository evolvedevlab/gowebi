package gowebi

import (
	"context"
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

func TestPooledRender_Concurrent(t *testing.T) {
	comp, err := os.ReadFile("testdata/simpleComp.js")
	if err != nil {
		t.Fatal(err)
	}

	program, err := goja.Compile("", string(comp), false)
	if err != nil {
		t.Fatal(err)
	}

	bundles := map[string]*Bundle{
		"test": {Program: program},
	}

	pool, err := newPool(4, bundles, time.Second, false)
	if err != nil {
		t.Fatal(err)
	}

	r := NewPooledRenderer(
		pool,
		bundles,
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

func TestPooledRenderTimeout(t *testing.T) {
	const code = "globalThis.render = () => { for (;;) {}; };"
	program, err := goja.Compile("", code, false)
	if err != nil {
		t.Fatal(err)
	}

	bundles := map[string]*Bundle{
		"test": {Program: program},
	}

	vm := newVM(false)
	runtime, err := runWithVM(vm, program)
	if err != nil {
		t.Fatal(err)
	}

	pool := &pool{
		ch: make(chan *poolItem, 1),
	}
	pool.ch <- &poolItem{
		vm: vm,
		pages: map[string]*Runtime{
			"test": runtime,
		},
	}

	r := NewPooledRenderer(
		pool,
		bundles,
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

func BenchmarkUnsafeRender(b *testing.B) {
	scomp, err := os.ReadFile("testdata/simpleComp.js")
	if err != nil {
		b.Fatal(err)
	}

	hcomp, err := os.ReadFile("testdata/heavyComp.js")
	if err != nil {
		b.Fatal(err)
	}

	sprog, err := goja.Compile("", string(scomp), true)
	if err != nil {
		b.Fatal(err)
	}

	hprog, err := goja.Compile("", string(hcomp), true)
	if err != nil {
		b.Fatal(err)
	}

	bundles := map[string]*Bundle{
		"simple": {Program: sprog},
		"heavy":  {Program: hprog},
	}

	pool, err := newPool(1, bundles, time.Second, false)
	if err != nil {
		b.Fatal(err)
	}

	r := NewPooledRenderer(
		pool,
		bundles,
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
