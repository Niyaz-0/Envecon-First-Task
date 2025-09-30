# Multi-stage build for FastAPI + React application

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python backend with built frontend
FROM python:3.11-slim AS stage-1
WORKDIR /app

RUN apt-get update && \
    apt-get install -y gcc default-libmysqlclient-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend into /app/backend (so main.py is at /app/backend/main.py)
COPY backend/ /app/backend/

# Copy built frontend into /app/backend/static (from your frontend-build stage)
COPY --from=frontend-build /app/frontend/dist /app/backend/static

# Ensure working dir is where main.py is located
WORKDIR /app/backend

EXPOSE 8000

# Run uvicorn importing main from current working dir
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]