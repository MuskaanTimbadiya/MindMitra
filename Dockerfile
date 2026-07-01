FROM python:3.11-slim

# Set a non‑root user for security
RUN useradd -m appuser
WORKDIR /app

# Copy only requirements first for caching
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend source code
COPY backend ./backend

# Create a data directory for the encrypted SQLite DB
RUN mkdir -p /app/data && chown appuser:appuser /app/data

USER appuser

EXPOSE 8000 8001

# Default command (can be overridden in docker‑compose)
CMD ["python", "-m", "uvicorn", "backend.mcp_server.main:app", "--host", "0.0.0.0", "--port", "8000"]
