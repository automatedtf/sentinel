# Makefile for commands to run when building and running Sentinel.

# Run: make image
image:
	docker build --no-cache=true -t sentinel .

# Run: make instance ENV_FILE=<ENV_FILE>
container:
	docker run --env-file $(ENV_FILE) sentinel 