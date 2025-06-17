# Mi Proyecto Backend (FastAPI)

This is the backend for "Mi Proyecto", built with FastAPI.

## Running the project

1.  **Create and activate a virtual environment:**
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the `.env.example` (or create it manually). Fill in the necessary values.

4.  **Run the development server:**
    ```bash
    uvicorn main:app --reload
    ```

The API will be available at `http://localhost:8000`. 