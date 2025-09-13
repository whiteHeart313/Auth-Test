# Security Scanning System API Documentation

## Overview

This document provides comprehensive documentation for the Security Scanning System API. The system consists of authentication endpoints and will include security scanning functionality.

## Base URL

- **Development**: `http://localhost:8080`
- **Docker**: `http://backend:8080`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Most endpoints require a valid access token.

### Headers

For protected endpoints, include the following header:

```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow a standard format:

```json
{
  "data": { ... },  // Response data (if successful)
  "message": "..." // Optional message
}
```

Error responses include:

```json
{
  "message": "Error message",
  "statusCode": 400
}
```

## Authentication Endpoints

### Register a new user

- **URL**: `/v1/auth/signup`
- **Method**: `POST`
- **Auth required**: No

**Request Body:**

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one letter
- At least one number
- At least one special character

**Response (201 Created):**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "User Name",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - User with this email already exists
- `400 Bad Request` - Validation errors (invalid email, password requirements not met)

### Login

- **URL**: `/v1/auth/login`
- **Method**: `POST`
- **Auth required**: No

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "User Name",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email or password
- `401 Unauthorized` - Authentication failed

### Get User Information

- **URL**: `/v1/auth/get-user`
- **Method**: `GET`
- **Auth required**: Yes

**Response (200 OK):**

```json
{
  "data": {
    "user": {
      "name": "User Name",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired token

### Refresh Token

- **URL**: `/v1/auth/refresh-token`
- **Method**: `POST`
- **Auth required**: Yes

**Response (200 OK):**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
