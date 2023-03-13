# dapr-opa-example
Example of using Open Policy Agent with Dapr. This sample uses the Azure Active Directory (AAD) as the identity provider, to fetch an access token from, and then uses OPA to validate the token.

## Running the sample

On the Azure portal, go to AAD and create a new app registration, followed by a client secret. Create an file `aad.json` with the following contents:
```json
{
    "authOptions": {
        "clientId": "<ENTER_CLIENT_ID>",
        "authority": "https://login.microsoftonline.com/<ENTER_TENANT_ID>",
        "clientSecret": "<ENTER_CLIENT_SECRET>"
    }
}
```

Run the following commands:
```bash
make start-foo
# In a new terminal
make start-bar
```

Expected output:
```bash
Invoking foo-service method 'fetch'...
Received response from foo-service:  403 Forbidden
Invoking foo-service method 'fetch' with a token...
Received response from foo-service:  200 Hello from foo-service! (You should only see this if you are an admin.)
```

## Resources

Fetching token: https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow with "Through an access control list (ACL) at the resource".
Validating token: https://learn.microsoft.com/en-us/azure/active-directory/develop/access-tokens#validate-tokens