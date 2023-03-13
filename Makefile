.PHONY: start-foo
start-foo:
	dapr run --app-id foo-service --app-port 50001 --app-protocol http --dapr-http-port 3501 --log-level debug --resources-path ./foo-service/.dapr/resources --config ./foo-service/.dapr/config.yaml -- go run ./foo-service/main.go

.PHONY: start-bar
start-bar:
	python3.10 ./bar-service/main.py