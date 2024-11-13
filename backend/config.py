import os

from dotenv import load_dotenv
from fastapi import FastAPI

from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

load_dotenv()

# OAuth scope
SCOPE = (
    "offline_access openid profile email accounting.transactions "
    "accounting.journals.read accounting.transactions payroll.payruns accounting.reports.read "
    "files accounting.settings.read accounting.settings accounting.attachments payroll.payslip "
    "payroll.settings files.read openid assets.read profile payroll.employees projects.read "
    "email accounting.contacts.read accounting.attachments.read projects assets accounting.contacts "
    "payroll.timesheets accounting.budgets.read"
)

# FastAPI app configuration
app = FastAPI(title="Xero FastAPI Integration")



app.add_middleware(
    SessionMiddleware,
    secret_key="684754346",
    session_cookie="session",
)

# Templates configuration
templates = Jinja2Templates(directory="backend/templates")

if os.getenv("ENV") != "production":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
