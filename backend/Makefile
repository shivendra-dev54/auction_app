.PHONY: dev build kill

dev:
	@echo "starting live-reload development server..."
	air

build:
	@echo "Building production binary..."
	@mkdir -p .dest/
	go build -o .dest/server cmd/server/main.go

kill:
	@echo "Killing running server processes..."
	@pkill -f "./.dest/server" || echo "No server process found."