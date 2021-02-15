:: activate virtual env and start server on port 9004
cmd /k ".\venv\Scripts\activate & uvicorn app.main:app --reload --port 9004"