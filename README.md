# Bookstagram

Bookstagram is a web application that allows users to track their reading progress, connect with friends, and share book reviews. The project is built using Django for the backend and React for the frontend, with Docker for containerization.

## Features

- **User Profiles**: Create and manage user profiles with friend lists.
- **Book Tracking**: Track books in "To Read", "Reading", and "Read" lists.
- **Reviews**: Submit and view reviews for books.
- **Friend Activity**: View recent reviews from friends.
- **Frontend-Backend Integration**: React frontend served via Vite, with Django handling the backend.

## Technologies Used

- **Backend**: Django 4.2
- **Frontend**: React with Vite
- **Database**: SQLite (default, can be replaced with other databases)
- **Containerization**: Docker and Docker Compose
- **Environment Management**: Python `dotenv`

## Prerequisites

- Docker and Docker Compose installed
- Node.js and npm installed (for local frontend development)
- Python 3.9+ installed (for local backend development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bookstagram.git
   cd bookstagram
   
2. Create a .env file in the _server directory and configure the following variables:  
   DEBUG=True
   ASSET_URL=http://localhost:5173
   
3. Build and run the Docker containers:
   ```bash
    docker-compose up -d --build
    ```
4. Access the application:
   http://localhost:8000