package main

import (
	"context"
	"log"
	"os"

	"github.com/dapr/go-sdk/service/common"
	daprd "github.com/dapr/go-sdk/service/http"
)

const (
	// defaultPort is the default port to listen on
	defaultPort = "50001"
	// portEnvKey is the environment variable key for the port
	portEnvKey = "FOO_SERVICE_PORT"
)

func fetchHandler(ctx context.Context, in *common.InvocationEvent) (out *common.Content, err error) {
	out = &common.Content{
		Data:        []byte("Hello from foo-service! (You should only see this if you are an admin.)"),
		ContentType: "text/plain",
	}

	return out, nil
}

func main() {
	port := defaultPort
	if envPort, ok := os.LookupEnv(portEnvKey); ok {
		port = envPort
	}

	s := daprd.NewService(":" + port)

	err := s.AddServiceInvocationHandler("/fetch", fetchHandler)
	if err != nil {
		log.Fatal(err)
	}

	log.Fatal(s.Start())
}
