# dapr-opa-example
Example of using Open Policy Agent with Dapr

https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow with "Through an access control list (ACL) at the resource".

Create an file `aad.json` with the following contents:
```json
{
    "authOptions": {
        "clientId": "<ENTER_CLIENT_ID>",
        "authority": "https://login.microsoftonline.com/<ENTER_TENANT_ID>",
        "clientSecret": "<ENTER_CLIENT_SECRET>"
    }
}
```