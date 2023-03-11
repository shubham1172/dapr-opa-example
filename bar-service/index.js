import { DaprClient, HttpMethod } from "@dapr/dapr";
import express from 'express';


const app = express()
const port = 50002

const fooServiceAppId = "foo-service";
const fooServiceRootMethod = "root";
const fooServiceSecretMethod = "secret";

async function main() {
    const client = new DaprClient();

    app.get('/root', async (_req, res) => {
        try {
            const daprResponse = await client.invoker.invoke(fooServiceAppId, fooServiceRootMethod, HttpMethod.POST, undefined);
            res.send(daprResponse);
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    });

    app.get('/secret', async (_req, res) => {
        try {
            const daprResponse = await client.invoker.invoke(fooServiceAppId, fooServiceSecretMethod, HttpMethod.POST, undefined);
            res.send(daprResponse);
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
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