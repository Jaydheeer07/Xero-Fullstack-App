# Backend API Documentation

This document provides instructions on how to set up, run, and use the backend API.

## Introduction

This backend API is built using FastAPI and provides endpoints to interact with Xero accounting data. It includes endpoints for retrieving accounts, contacts, and invoices.

## Setup

### Prerequisites

- Python 3.6 or higher
- FastAPI
- Xero Python SDK

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/Dexterous-Group/Bank_Reconciliation.git
    cd backend
    ```

2. Create a virtual environment:

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the required packages:

    ```sh
    pip install -r requirements.txt
    ```

4. Set up environment variables. Create a `.env` file in the root directory and add the necessary environment variables:

    ```ini
    # Xero OAuth2 credentials
    Client_ID="Your client ID" 
    Client_Secret_Key="your client secret key"

    # Environment
    ENV=development

    # Application settings
    DEBUG=True

    ```

### Running the Server

1. Ensure you have activated your virtual environment:

    ```sh
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2. Start the FastAPI server:

    ```sh
    python run.py
    ```

3. The server will start and be accessible at `http://127.0.0.1:8000`. You can also view the Swagger documentation at `http://127.0.0.1:8000/docs`.

## Sample API Endpoints
### 1. Retrieve Accounts
- **Endpoint**: `/accounts`
- **Method**: `GET`
- **Description**: Retrieve a list of accounts.
- **Response**: JSON array of accounts.

### 2. Retrieve Contacts
- **Endpoint**: `/contacts`
- **Method**: `GET`
- **Description**: Retrieve a list of contacts.
- **Response**: JSON array of contacts.

### 3. Retrieve Invoices
- **Endpoint**: `/invoices`
- **Method**: `GET`
- **Description**: Retrieve a list of invoices.
- **Response**: JSON array of invoices.

## Error Handling
The API returns appropriate error responses for various scenarios, including authentication errors, invalid requests, and more.

## Authentication
The API uses OAuth2 for authentication. Ensure you have the necessary credentials to access the Xero API.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
