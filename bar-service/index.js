import { DaprClient, HttpMethod } from "@dapr/dapr";

const fooServiceAppId = "foo-service";
const fooServiceMethod = "fetch";

async function main() {
    const client = new DaprClient();
    const res = await client.invoker.invoke(fooServiceAppId, fooServiceMethod, HttpMethod.POST, undefined, {
        headers: {
            "Authorization": "Bearer 1234"
        }
    });
    console.log(res);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});