package gowebi

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/dop251/goja"
)

func TestVMInterrupt(t *testing.T) {
	vm := newVM(false)

	ctx, cancel := context.WithTimeout(t.Context(), time.Millisecond)

	clear := attachVMInterrupt(ctx, vm)
	defer func() {
		cancel()
		clear()
		vm.ClearInterrupt()
	}()

	// blocking loop
	_, err := vm.RunString("for (;;) {};")

	var interruptErr *goja.InterruptedError
	if errors.As(err, &interruptErr) {
		if e, ok := interruptErr.Value().(error); ok {
			if !errors.Is(err, ctx.Err()) {
				t.Errorf("want: %v, received: %v", ctx.Err(), e)
			}
		}
	}
}
