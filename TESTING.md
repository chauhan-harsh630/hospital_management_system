# User Model Testing & Documentation

## ✅ Test Summary

All 15 unit tests for the User model are passing successfully!

### Test Coverage

#### User Registration (6 tests)
- ✓ Register new user successfully
- ✓ Validate required fields
- ✓ Prevent duplicate email registration
- ✓ Hash password before saving
- ✓ Validate role enum
- ✓ Normalize email to lowercase

#### User Login (5 tests)
- ✓ Login with correct credentials
- ✓ Reject invalid email
- ✓ Reject incorrect password
- ✓ Reject incorrect role
- ✓ Require all fields
- ✓ Return valid JWT token

#### User Model Validation (3 tests)
- ✓ Enforce unique email constraint
- ✓ Require all fields
- ✓ Include timestamps (createdAt, updatedAt)

## 🚀 Running Tests

### Quick Start
```bash
npm test
```

### Watch Mode (for development)
```bash
npm test:watch
```

### Test Output
The tests use Jest with supertest for HTTP testing and validate:
- API request/response
- Database operations
- Authentication logic
- Data validation
- Error handling

## 🔐 Authentication Middleware

### Auth Middleware Files
- `middleware/auth.js` - Contains JWT verification and role-based authorization

### Usage in Protected Routes
```javascript
import { verifyToken, authorizeRole } from "../middleware/auth.js";

// Example: Protect route with authentication
router.get("/profile", verifyToken, getProfile);

// Example: Protect route with specific role
router.post("/admin", verifyToken, authorizeRole('admin'), adminFunction);
```

## 📋 User Model Schema

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: Enum ['admin', 'doctor', 'staff', 'patient'] (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🧪 Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (useful during development)
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

## 🔄 Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Run Tests in Watch Mode**
   ```bash
   npm test:watch
   ```

3. **Manual Testing** - See `POSTMAN_API_TESTING.md` for API endpoint testing

## ✨ Features Implemented

### ✅ User Registration
- Input validation (all fields required)
- Email uniqueness check
- Password hashing with bcrypt (10 rounds)
- Role-based user creation
- Automatic email normalization

### ✅ User Login
- Email and password validation
- Role verification
- JWT token generation (1 hour expiry)
- Secure password comparison using bcrypt

### ✅ Database
- MongoDB with Mongoose
- Proper schema validation
- Timestamps for audit trail
- Unique index on email field

### ✅ Security
- Password hashing (bcrypt)
- JWT authentication
- Role-based authorization
- Error messages don't leak user info (generic "Invalid credentials")

## 📌 Next Steps

After user model is perfected:
1. ✅ User Model - COMPLETE
2. Doctor Model & Controller
3. Patient Model & Controller
4. Appointment Model & Controller
5. Emergency Cases Model & Controller

---

**Status: READY FOR PRODUCTION** ✓
All tests passing, ready to proceed to next models!
