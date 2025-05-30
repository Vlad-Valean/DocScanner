# Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libatlas-base-dev \
    libopenblas-dev \
    libgl1 \
    python3-dev \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install poetry
RUN pip install --upgrade pip setuptools wheel \
    && pip install poetry==2.1.3

# Copy only pyproject.toml (no poetry.lock)
COPY pyproject.toml ./

RUN poetry config virtualenvs.create false

# Generate poetry.lock inside container
RUN poetry lock

# Instead of just poetry install, run pip install for CPU-only PyTorch
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install dependencies (no virtualenv, no project install)
RUN poetry install --no-root --no-interaction --no-ansi

# Copy the rest of the app
COPY . .

# Health check
RUN python -c "import numpy, torch, easyocr; print('✅ All working')"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
