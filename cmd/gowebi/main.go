package main

import (
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"

	"github.com/evolvedevlab/gowebi/examples"
)

func main() {
	flg := flag.NewFlagSet(os.Args[0], flag.ContinueOnError)
	flg.SetOutput(io.Discard)
	var (
		projectName = flg.String("name", "", "")
		path        = flg.String("path", "", "")

		help = flg.Bool("help", false, "show help")
		h    = flg.Bool("h", false, "show help")
	)
	if err := flg.Parse(os.Args[1:]); err != nil {
		printHelp()
		os.Exit(1)
	}

	if len(os.Args) <= 1 {
		printHelp()
		os.Exit(0)
	}

	if *help || *h {
		printHelp()
		os.Exit(0)
	}

	// validations
	if len(*projectName) == 0 {
		fmt.Println("project name is required")
	}
	if len(*path) == 0 {
		log.Fatal("path is required")
	}

	projectFS, err := examples.GetExampleProject(*projectName)
	if err != nil {
		log.Fatalf("failed to get project: %+v", err)
	}

	if _, err := fs.Stat(projectFS, "main.go"); err != nil {
		log.Fatalf("project does not exist: %s", *projectName)
	}

	if err := os.CopyFS(*path, projectFS); err != nil {
		log.Fatalf("write error: %+v", err)
	}
}

func printHelp() {
	fmt.Print(`
Usage:
  gowebi --name <project-name> --path <destination>

Examples:
  gowebi --name solidjs --path ./myproject

Flags:
  --name    Project name
  --path    Destination directory
` + "\n")
}
