package gowebi

import (
	"context"
	"errors"
	"testing"
	"testing/synctest"
	"time"

	"github.com/dop251/goja"
)

// pool vm pre-warm exec
func TestPool_Timeout(t *testing.T) {
	program, err := goja.Compile("", "for (;;) {};", false)
	if err != nil {
		t.Fatal(err)
	}

	bundles := map[string]*Bundle{
		"test": {Program: program},
	}

	_, err = newPool(1, bundles, time.Millisecond, false)

	if !errors.Is(err, context.DeadlineExceeded) {
		t.Errorf("want: %v, received: %v", context.DeadlineExceeded, err)
	}
}

func TestPool_get_timeout(t *testing.T) {
	synctest.Test(t, func(t *testing.T) {
		pool, err := newPool(0, nil, time.Second, false)
		if err != nil {
			t.Fatal(err)
		}

		ctx, cancel := context.WithTimeout(t.Context(), time.Second)
		defer cancel()

		var pErr error
		go func() {
			_, pErr = pool.get(ctx)
		}()

		time.Sleep(time.Second)
		synctest.Wait()

		if !errors.Is(pErr, ctx.Err()) {
			t.Errorf("want: %v, received: %v", ctx.Err(), err)
		}
	})
}
