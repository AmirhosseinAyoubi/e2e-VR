import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "locale": "en-GB", # Tells the browser to prefer English
        "extra_http_headers": {
            "Accept-Language": "en-GB,en;q=0.9" # Forces the server to send English
        }
    }