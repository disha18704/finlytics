# Project Setup and Running Instructions

## Prerequisites

- Python 3.9.20
- pip (Python package installer)

## Setup Instructions

1. **Create a Virtual Environment**:
   Open your terminal and navigate to the project directory. Then, create a virtual environment using the following command:

   ```bash
   python -m venv venv
   ```

2. **Activate the Virtual Environment**:
   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - On macOS and Linux:

     ```bash
     source venv/bin/activate
     ```

3. **Copy the Environment Template**:
   Copy the `.env.template` file to create your `.env` file:

   ```bash
   cp .env.template .env
   ```

4. **Install Required Packages**:
   Install the necessary packages listed in `requirements.txt`:

   ```bash
   pip install -r requirements.txt
   ```

## Running the Project

1. **Start the FastAPI Application**:
   Use `uvicorn` to run the FastAPI application:

   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Check GPU Availability**:
   To check if your GPU is available, run:

   ```bash
   python app/services/gpu_check.py
   ```

3. **Run the API Tests**:
   To test the API, execute:

   ```bash
   python3 app/tests/test_api.py
   ```