# Use Python 3.9 base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
# Added --no-cache-dir to keep the image size small
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Cloud Run injects the PORT environment variable (default 8080)
# We must listen on this port, not a hardcoded one.
ENV PORT=8080

# Command to run the application
# We use "sh -c" (shell form) so that ${PORT} is actually expanded to the value 8080 (or whatever Cloud Run sets)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]