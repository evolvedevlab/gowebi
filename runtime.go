package gowebi

import (
	"context"
	"fmt"
	"log"

	"github.com/dop251/goja"
)

var undefinedGojaFn = func(goja.FunctionCall) goja.Value {
	return goja.Undefined()
}
var clg = func(args ...any) {
	log.Println(append([]any{"[JS]:"}, args...)...)
}

type Runtime struct {
	VM     *goja.Runtime
	Render goja.Callable
	Meta   goja.Callable
}

// runWithVM runs the loaded program in the provided vm.
// meta function is optional and can be nil.
//
// WARN: re-using existing vms can leak data across requests.
func runWithVM(vm *goja.Runtime, program *goja.Program) (*Runtime, error) {
	_, err := vm.RunProgram(program)
	if err != nil {
		return nil, fmt.Errorf("failed to run program: %w", err)
	}

	render, ok := goja.AssertFunction(vm.Get("render"))
	if !ok {
		return nil, fmt.Errorf("failed to get the render function from vm")
	}

	meta, _ := goja.AssertFunction(vm.Get("meta"))

	return &Runtime{
		VM:     vm,
		Render: render,
		Meta:   meta,
	}, nil
}

func newVM(suppressConsoleLogs bool) *goja.Runtime {
	vm := goja.New()
	vm.SetFieldNameMapper(goja.TagFieldNameMapper("json", true))

	_, _ = vm.RunString(`
	Object.freeze(Object);
	Object.freeze(Object.prototype);
	Object.freeze(Array.prototype);
	Object.freeze(Function.prototype);
	`)

	vm.Set("setTimeout", undefinedGojaFn)
	vm.Set("clearTimeout", undefinedGojaFn)
	vm.Set("eval", undefinedGojaFn)
	vm.Set("Function", undefinedGojaFn)
	vm.Set("process", undefinedGojaFn)
	if suppressConsoleLogs {
		l := func(...any) {}
		vm.Set("console", map[string]func(...any){
			"log":   l,
			"error": l,
			"warn":  l,
		})
	} else {
		vm.Set("console", map[string]func(...any){
			"log":   clg,
			"error": clg,
			"warn":  clg,
		})
	}

	return vm
}

func attachVMInterrupt(ctx context.Context, vm *goja.Runtime) func() {
	var (
		done   = make(chan struct{})
		exited = make(chan struct{})
	)

	go func() {
		defer close(exited)

		select {
		case <-ctx.Done():
			vm.Interrupt(ctx.Err())
		case <-done:
		}
	}()

	return func() {
		close(done)
		<-exited
	}
}
