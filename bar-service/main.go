package main

import (
	"log"
	"net/http"
	"os"

	dapr "github.com/dapr/go-sdk/client"
)

const (
	// defaultPort is the default port to listen on
	defaultPort = "50002"
	// portEnvKey is the environment variable key for the port
	portEnvKey = "FOO_SERVICE_PORT"
	// fooServiceAppId is the Dapr app id for the foo-service
	fooServiceAppId = "foo-service"
	// fooServiceMethod is the method to invoke on the foo-service
	fooServiceMethod = "fetch"
	// fooServiceInvokeVerb is the HTTP verb to use when invoking the foo-service
	fooServiceInvokeVerb = "post"
)

func main() {
	client, err := dapr.NewClient()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		resp, err := client.InvokeMethod(r.Context(), fooServiceAppId, fooServiceMethod, fooServiceInvokeVerb)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}

		w.WriteHeader(http.StatusOK)
		w.Write(resp)
	})

	port := defaultPort
	if envPort, ok := os.LookupEnv(portEnvKey); ok {
		port = envPort
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
