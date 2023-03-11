.PHONY: start-foo
start-foo:
	dapr run --app-id foo-service --app-port 50001 --app-protocol http --log-level debug --resources-path ./foo-service/.dapr/resources --config ./foo-service/.dapr/config.yaml -- go run ./foo-service/main.go

.PHONY: start-bar
start-bar:
	dapr run --app-id bar-service --app-port 50002 --app-protocol http --log-level debug --resources-path ./bar-service/.dapr/resources --config ./bar-service/.dapr/config.yaml -- node ./bar-service/index.js