package gowebi

import (
	"context"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
)

type PoolRender struct {
	pool                *pool
	bundleMap           map[string]*Bundle
	tmpl                *template.Template
	isDev               bool
	suppressConsoleLogs bool
}

func NewPooledRenderer(pool *pool, bMap map[string]*Bundle, tmpl *template.Template, suppressConsoleLogs, isDev bool) *PoolRender {
	return &PoolRender{
		pool:                pool,
		bundleMap:           bMap,
		tmpl:                tmpl,
		suppressConsoleLogs: suppressConsoleLogs,
		isDev:               isDev,
	}
}

func (r *PoolRender) Render(ctx context.Context, w http.ResponseWriter, status int, opts RenderOptions) error {
	if err := ctx.Err(); err != nil {
		return err
	}

	rd, err := r.getRenderData(ctx, opts)
	if err != nil {
		if r.isDev {
			return writeDebugError(w, err)
		}
		return err
	}

	raw, err := json.Marshal(opts.Props)
	if err != nil {
		return err
	}

	script := getHydrationScript(raw, r.isDev)

	w.Header().Add("Content-Type", "text/html; charset=utf8")
	w.WriteHeader(status)
	return r.tmpl.Execute(w, map[string]any{
		"Meta":               rd.Metadata,
		"Script":             template.HTML(script),
		"App":                template.HTML(rd.AppHTML),
		"HydrationScriptSrc": rd.ClientPath,
		"NoHydrate":          opts.NoHydrate,
		"IsDev":              r.isDev,
		"Props":              opts.Props,
	})
}

type renderData struct {
	AppHTML    string
	Metadata   map[string]string
	ClientPath string
}

func (r *PoolRender) getRenderData(ctx context.Context, opts RenderOptions) (*renderData, error) {
	pi, err := r.pool.get(ctx)
	if err != nil {
		return nil, fmt.Errorf("request cancelled: %w", err)
	}

	clear := attachVMInterrupt(ctx, pi.vm)
	defer func() {
		clear()
		pi.vm.ClearInterrupt()
		r.pool.put(pi)
	}()

	b, ok := r.bundleMap[opts.Name]
	if !ok {
		return nil, fmt.Errorf("page bundle not found")
	}

	runtime := pi.pages[opts.Name]

	appHTML, err := getStaticHTML(runtime, opts.Props)
	if err != nil {
		return nil, err
	}

	metadata := opts.Meta
	if metadata == nil {
		metadata, err = getMetadata(runtime, opts.Props)
		if err != nil {
			return nil, err
		}
	}

	return &renderData{
		AppHTML:    appHTML,
		Metadata:   metadata,
		ClientPath: b.ClientPath,
	}, nil
}
