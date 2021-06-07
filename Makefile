# Makefile for commands to run when building and running Sentinel.

# Run: make sentinel-container
sentinel-container:
	docker build --no-cache=true -t sentinel .

# Run: make sentinel-instance ENV_FILE=<ENV_FILE>
sentinel-instance:
	docker run --env-file $(ENV_FILE) sentinel 