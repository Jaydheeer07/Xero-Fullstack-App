import logging.config
from datetime import datetime

from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import app
from backend.logging_settings import default_settings
from backend.models.tenant_models import DetailedErrorResponse, TenantError
from backend.routes import (
    accounts,
    auth,
    bank_transactions,
    contacts,
    invoices,
    tenants,
)

logging.config.dictConfig(default_settings)

# Allow CORS for all origins (adjust as needed for your use case)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(invoices.router)
app.include_router(tenants.router)
app.include_router(accounts.router)
app.include_router(contacts.router)
app.include_router(bank_transactions.router)


# Exception handler for TenantError
@app.exception_handler(TenantError)
async def tenant_error_handler(request: Request, exc: TenantError):
    return JSONResponse(
        status_code=400,
        content=DetailedErrorResponse(
            detail=str(exc.message),
            error_code=exc.error_code,
            timestamp=datetime.utcnow().isoformat(),
        ).dict(),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=8000)
