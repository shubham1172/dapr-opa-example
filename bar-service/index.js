import { DaprClient, HttpMethod } from "@dapr/dapr";
import express from 'express';
import { ConfidentialClientApplication } from '@azure/msal-node';
import config from '../aad.json' assert { type: "json" };


const app = express()
const port = 50002

const fooServiceAppId = "foo-service";
const fooServiceFetchMethod = "fetch";

/**
 * Get a token from AAD for client credentials flow.
 * @param {*} cca The confidential client application object.
 */
function getClientCredentialsToken(cca) {
    const clientCredentialRequest = {
        scopes: ["https://graph.microsoft.com/.default"], // TODO: Add resource scopes here and verify on the resource server
        azureRegion: null, // (optional) specify the region you will deploy your application to here (e.g. "westus2")
        skipCache: true, // (optional) this skips the cache and forces MSAL to get a new token from Azure AD
    };

    return cca.acquireTokenByClientCredential(clientCredentialRequest);
}

async function setupRoutes(daprClient, confidentialClientApplication) {
    app.get('/fetch', async (_req, res) => {
        try {
            const daprResponse = await daprClient.invoker.invoke(fooServiceAppId, fooServiceFetchMethod, HttpMethod.POST);
            res.send(daprResponse);
        } catch (e) {
            console.log(e);
            res.status(403).send(e);
        }
    });

    app.get('/fetch-securely', async (_req, res) => {
        getClientCredentialsToken(confidentialClientApplication).then(async (resp) => {
            const accessToken = resp.accessToken;
            try {
                console.log("Using access token: " + accessToken);
                const daprResponse = await daprClient.invoker.invoke(fooServiceAppId, fooServiceFetchMethod, HttpMethod.POST, undefined, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                res.send(daprResponse);
            } catch (e) {
                console.log(e);
                res.status(403).send(e);
            }
        }).catch((e) => {
            res.status(403).send(e);
            return;
        });
    });
}

async function main() {
    const daprClient = new DaprClient();

    const confidentialClientApplication = new ConfidentialClientApplication({ auth: config.authOptions });

    await setupRoutes(daprClient, confidentialClientApplication);

    app.listen(port, () => {
        console.log(`bar-service is listening on port ${port}!`)
    })
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});