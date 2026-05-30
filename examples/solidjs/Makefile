watch:
	@wgo \
    -exit \
    -file=.go \
    ENVIRONMENT=development node esbuild.config.js \
    :: ENVIRONMENT=development go run . \
    :: wgo -dir=./web node esbuild.config.js

build:
	@ENVIRONMENT=production node esbuild.config.js \
	&& ENVIRONMENT=production go build -o ./bin/main .
