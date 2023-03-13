import json
from msal import ConfidentialClientApplication
import requests

FOO_SERVICE_DAPR_PORT = 3501
FOO_SERVICE_APP_ID = "foo-service"
FOO_SERVICE_METHOD_NAME = "fetch"

INVOKE_URL = f"http://localhost:{FOO_SERVICE_DAPR_PORT}/v1.0/invoke/{FOO_SERVICE_APP_ID}/method/{FOO_SERVICE_METHOD_NAME}"


def setup_confidential_client_application():
    """Setup a confidential client application using the AAD configuration file (aad.json)"""
    with open("./aad.json") as f:
        aad_config: dict = json.load(f)

    auth_options = aad_config.get("authOptions", {})
    client_id = auth_options.get("clientId", None)
    client_secret = auth_options.get("clientSecret", None)
    authority = auth_options.get("authority", None)

    return ConfidentialClientApplication(
        client_id=client_id, client_credential=client_secret, authority=authority)


def fetch_client_credentials_token(cca: ConfidentialClientApplication):
    """Fetch a token for the confidential client application"""
    res = cca.acquire_token_for_client(
        scopes=["https://graph.microsoft.com/.default"])
    return res.get('access_token', "")


if __name__ == "__main__":
    # Create a confidential client application
    cca = setup_confidential_client_application()

    print("Invoking foo-service method 'fetch'...")
    response = requests.post(INVOKE_URL)
    print("Received response from foo-service: ",
          response.status_code, response.headers, response.text)

    # Fetch a token for the confidential client application
    token = fetch_client_credentials_token(cca)

    print("Invoking foo-service method 'fetch' with a token...")
    response = requests.post(INVOKE_URL, headers={
                             "Authorization": f"Bearer {token}"})
    print("Received response from foo-service: ",
          response.status_code, response.headers, response.text)
