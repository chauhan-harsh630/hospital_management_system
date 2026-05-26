# Manual API Testing Guide

## 🏥 Hospital Management System - API Endpoints

### Base URL
```
http://localhost:5400/api/users
```

## 📝 Endpoints

### 1. Register User
**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

**Valid Roles:**
- `admin` - Administrator
- `doctor` - Medical Doctor
- `staff` - Hospital Staff
- `patient` - Patient

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient",
    "createdAt": "2026-05-26T10:30:00.000Z",
    "updatedAt": "2026-05-26T10:30:00.000Z"
  }
}
```

**Error Responses:**
- **400** - Missing required fields or duplicate email
- **500** - Server error

---

### 2. Login User
**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "role": "patient"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Error Responses:**
- **400** - Invalid credentials or wrong role
- **500** - Server error

---

## 🧪 Testing Scenarios

### Scenario 1: Successful Registration
1. Register a new user with all required fields
2. Verify user is created with hashed password
3. Try registering with same email - should fail

### Scenario 2: Successful Login
1. Register a user
2. Login with correct credentials
3. Receive JWT token
4. Use token for protected routes

### Scenario 3: Error Cases
- Register without all fields → 400
- Register with invalid role → 500
- Login with wrong password → 400
- Login with non-existent email → 400
- Login with wrong role → 400

---

## 📌 Using JWT Token in Protected Routes

Once you have a token, include it in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNjg0NTc2NjAwLCJleHAiOjE2ODQ1ODAwMDB9.abc123xyz
```

---

## 🔄 Example cURL Commands

### Register
```bash
curl -X POST http://localhost:5400/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### Login
```bash
curl -X POST http://localhost:5400/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

---

## 💾 Postman Collection

### Steps to Import:
1. Open Postman
2. Click "Import" → "Raw Text"
3. Paste the collection JSON below
4. Click "Import"

```json
{
  "info": {
    "name": "Hospital Management System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"patient\"\n}"
        },
        "url": {
          "raw": "http://localhost:5400/api/users/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5400",
          "path": ["api", "users", "register"]
        }
      }
    },
    {
      "name": "Login User",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"patient\"\n}"
        },
        "url": {
          "raw": "http://localhost:5400/api/users/register",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5400",
          "path": ["api", "users", "login"]
        }
      }
    }
  ]
}
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on `localhost:27017`
- Check `.env` file for correct MongoDB URI

### JWT Token Expired
- Tokens expire in 1 hour
- Re-login to get a new token

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 5400

---

**API Documentation Version:** 1.0  
**Last Updated:** 2026-05-26
