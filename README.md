# Security Scanning System - Docker Setup

## Overview
This repository contains a security scanning system with a NestJS backend, React frontend, and MongoDB database. The entire application can be run using Docker containers.

## Prerequisites
- Docker and Docker Compose installed on your system
- Git (to clone the repository)

## Getting Started

### Running the Application with Docker

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository-url>
   cd easyGenerator
   ```

2. Build and start all services using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

   This command will:
   - Build the Docker images for the backend and frontend
   - Pull the MongoDB image
   - Start all three containers
   - Set up the network between them

3. Access the applications:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - MongoDB: mongodb://localhost:27017

### Stopping the Application

```bash
docker-compose down
```

To remove all data volumes as well:
```bash
docker-compose down -v
```

## Service Details

### Backend (NestJS)
- Port: 8080
- Environment variables:
  - NODE_ENV: production environment
  - MONGODB_URI: MongoDB connection string

### Frontend (React)
- Port: 5173
- Environment variables:
  - VITE_API_URL: URL to connect to the backend API

### MongoDB
- Port: 27017
- Data is persisted in a Docker volume

## Development

For development purposes, you can still run each service individually:

### Backend
```bash
cd authTask
npm install
npm run start:dev
```

### Frontend
```bash
cd client/auth-fe
npm install
npm run dev
```

### Database
For local development, you can run MongoDB using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```