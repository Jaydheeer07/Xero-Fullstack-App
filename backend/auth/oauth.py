import logging
import os
from datetime import datetime

from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, Request
from xero_python.api_client import ApiClient
from xero_python.api_client.configuration import Configuration
from xero_python.api_client.oauth2 import OAuth2Token

from backend.config import SCOPE, app

logger = logging.getLogger(__name__)

oauth = OAuth()
oauth.register(
    name="xero",
    client_id=os.getenv("Client_ID"),
    client_secret=os.getenv("Client_Secret_Key"),
    server_metadata_url="https://identity.xero.com/.well-known/openid-configuration",
    client_kwargs={"scope": SCOPE},
)

api_client = ApiClient(
    Configuration(
        debug=True,
        oauth2_token=OAuth2Token(
            client_id=os.getenv("Client_ID"),
            client_secret=os.getenv("Client_Secret_Key"),
        ),
    ),
    pool_threads=1,
)

def create_token_dict(token):
    """Create a complete token dictionary including scope."""
    token_dict = {
        "access_token": token.get("access_token"),
        "token_type": token.get("token_type", "Bearer"),
        "refresh_token": token.get("refresh_token"),
        "expires_in": token.get("expires_in"),
        "expires_at": token.get("expires_at"),
        "scope": token.get("scope", SCOPE),  # Use the scope from the token if available
    }
    logger.info(f"Created token dict: {token_dict}")  # Add this line
    return token_dict

@api_client.oauth2_token_getter
def obtain_xero_oauth2_token():
    """Get the token from the session."""
    if hasattr(app.state, "token"):
        token_dict = app.state.token
        if "expires_at" in token_dict:
            expiration_time = datetime.fromtimestamp(token_dict["expires_at"])
            logger.info(f"Token expires at: {expiration_time}")
        # Ensure scope is included in the token
        if "scope" not in token_dict:
            token_dict["scope"] = SCOPE
        logger.info(f"Obtained token: {token_dict}")  # Add this line
        return token_dict
    return None

@api_client.oauth2_token_saver
def store_xero_oauth2_token(token):
    """Store the token in the session."""
    token_dict = token if isinstance(token, dict) else token
    token_dict["scope"] = SCOPE  # Ensure scope is always included
    logger.info(f"Storing token: {token_dict}")  # Add this line
    app.state.token = token_dict

def is_token_expired(token: dict) -> bool:
    """Check if the token is expired or about to expire in the next 60 seconds."""
    if not token or "expires_at" not in token:
        return True
    return datetime.now().timestamp() >= (token["expires_at"] - 60)

async def refresh_token_if_expired():
    """Refresh the token if it's expired."""
    token = obtain_xero_oauth2_token()

    if token and is_token_expired(token):
        try:
            new_token = api_client.refresh_oauth2_token(token)
            new_token_dict = create_token_dict(new_token)
            logger.info(f"Refreshed token: {new_token_dict}")  # Add this line
            store_xero_oauth2_token(new_token_dict)
            return new_token_dict
        except Exception as e:
            logger.error(f"Error refreshing token: {str(e)}", exc_info=True)
            store_xero_oauth2_token(None)
            return None
    return token

async def require_valid_token(request: Request):
    """Dependency to ensure a valid token exists."""
    token = await refresh_token_if_expired()
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"Location": "/login"},
        )
    return token
