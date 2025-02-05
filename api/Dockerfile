FROM python:3.12-slim

WORKDIR /app

# Add debugging tools
RUN pip install debugpy

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Change the command to enable debugging
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "--wait-for-client", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"] 