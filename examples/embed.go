package examples

import (
	"embed"
	"io/fs"
)

//go:embed *
var exFS embed.FS

func GetExampleProject(name string) (fs.FS, error) {
	return fs.Sub(exFS, name)
}
