package gowebi

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"

	"github.com/dop251/goja"
)

type poolItem struct {
	vm    *goja.Runtime
	pages map[string]*Runtime
}

type pool struct {
	available chan *poolItem
}

func newPool(size int, bundles map[string]*Bundle) (*pool, error) {
	pool := &pool{
		available: make(chan *poolItem, size),
	}

	for i := 0; i < size; i++ {
		vm := newVM()
		pages := make(map[string]*Runtime, len(bundles))

		for outPath, b := range bundles {
			runtime, err := runWithVM(vm, b.Program)
			if err != nil {
				return nil, err
			}

			pages[outPath] = runtime
		}

		pool.available <- &poolItem{
			vm:    vm,
			pages: pages,
		}
	}

	return pool, nil
}

func (p *pool) get() *poolItem {
	item := <-p.available
	return item
}

func (p *pool) put(item *poolItem) {
	p.available <- item
}

type PoolRender struct {
	pool      *pool
	bundleMap map[string]*Bundle
	tmpl      *template.Template
	debug     bool
}

func NewPooledRenderer(pool *pool, bMap map[string]*Bundle, tmpl *template.Template, debug bool) *PoolRender {
	return &PoolRender{
		pool:      pool,
		bundleMap: bMap,
		tmpl:      tmpl,
		debug:     debug,
	}
}

func (r *PoolRender) Render(w http.ResponseWriter, status int, opts RenderOptions) error {
	pl := r.pool.get()
	defer r.pool.put(pl)

	b, ok := r.bundleMap[opts.Name]
	if !ok {
		return fmt.Errorf("page bundle not found")
	}

	runtime := pl.pages[opts.Name]

	appHtml, err := getStaticHTML(runtime, opts.Props)
	if err != nil {
		if r.debug {
			return writeDebugError(w, err)
		}
		return err
	}

	metadata, err := getMetadata(runtime, opts.Props)
	if err != nil {
		if r.debug {
			return writeDebugError(w, err)
		}
		return err
	}

	raw, err := json.Marshal(opts.Props)
	if err != nil {
		return err
	}

	head := fmt.Sprintf(`
<script>
    globalThis._$HY = {};
    window.__DATA__ = %s
</script>
`, string(raw))

	w.Header().Add("Content-Type", "text/html; charset=utf8")
	w.WriteHeader(status)
	return r.tmpl.Execute(w, map[string]any{
		"Meta":               metadata,
		"Head":               template.HTML(head),
		"App":                template.HTML(appHtml),
		"HydrationScriptSrc": b.ClientPath,
		"NoHydrate":          opts.NoHydrate,
		"Props":              opts.Props,
	})
}
