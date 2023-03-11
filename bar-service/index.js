import { DaprClient, HttpMethod } from "@dapr/dapr";
import express from 'express';


const app = express()
const port = 50002

const fooServiceAppId = "foo-service";
const fooServiceFetchMethod = "fetch";

async function main() {
    const client = new DaprClient();

    app.get('/fetch', async (_req, res) => {
        try {
            const daprResponse = await client.invoker.invoke(fooServiceAppId, fooServiceFetchMethod, HttpMethod.POST, undefined);
            res.send(daprResponse);
        } catch (e) {
            console.log(e);
            res.status(403).send(e);
        }
    });

    app.get('/fetch-securely', async (_req, res) => {
        // TODO: Fetch token from AAD and pass as invocation header.
        try {
            const daprResponse = await client.invoker.invoke(fooServiceAppId, fooServiceFetchMethod, HttpMethod.POST, undefined);
            res.send(daprResponse);
        } catch (e) {
            console.log(e);
            res.status(403).send(e);
        }
    });

    app.listen(port, () => {
        console.log(`bar-service is listening on port ${port}!`)
    })
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});