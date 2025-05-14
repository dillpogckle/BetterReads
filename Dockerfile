FROM node:18-alpine as client
# Set the working directory
WORKDIR /app
COPY client/ ./
RUN npm ci
RUN npm run build


FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Copy Poetry files and install dependencies
COPY . .
RUN poetry config virtualenvs.in-project true && poetry install --no-root

# Copy the client build from the previous stage
COPY --from=client /app/static ./_server/core/static/core

# Expose the application port
EXPOSE 8000

# Use Poetry to run the application
CMD ["poetry", "run", "python", "_server/manage.py", "runserver", "0.0.0.0:8000"]