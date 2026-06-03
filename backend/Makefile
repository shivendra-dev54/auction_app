.PHONY: dev build

dev:
	@echo "starting live-reload development server..."
	air

build:
	@echo "Building production binary..."
	@mkdir -p .dest/
	go build -o .dest/server cmd/server/main.go
