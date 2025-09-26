# BUG REPORT AND FIXES

## Overview

This document details the bugs found in the backend assessment codebase and the fixes applied to resolve them.

## Bugs Found and Fixed

### Bug #1: Missing await in Password Validation

**Location**: `src/routes/auth.ts`, line 26
**Problem**: The `bcrypt.compare()` function returns a Promise but was not being awaited
**Symptoms**: Login always failed even with correct credentials
**Root Cause**: Asynchronous operation treated as synchronous

```typescript
// Buggy Code
const isValid = bcrypt.compare(password, user.password);
if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

// Fixed Code
const isValid = await bcrypt.compare(password, user.password);
if (!isValid) return res.status(401).json({ error: "Invalid credentials" });
```

**How I Found It**: Testing login endpoint showed it always returned "Invalid credentials" regardless of password correctness.

### Bug #2: Typo in Environment Variable Name

**Location**: `src/routes/auth.ts`, line 29
**Problem**: Environment variable name had typo: `JWT_SECERT` instead of `JWT_SECRET`
**Symptoms**: JWT token generation threw errors due to undefined secret
**Root Cause**: Spelling mistake in environment variable reference

```typescript
// Buggy Code
const token = jwt.sign({ id: user.id }, process.env.JWT_SECERT!, {
  expiresIn: "1h",
});

// Fixed Code
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
  expiresIn: "1h",
});
```

**How I Found It**: JWT signing failed with undefined secret error during login testing.

### Bug #3: Wrong Authorization Header Name

**Location**: `src/middleware/authMiddleware.ts`, line 7
**Problem**: Looking for `authorization-token` header instead of standard `authorization`
**Symptoms**: Protected routes always returned "No token provided" error
**Root Cause**: Non-standard header name used

```typescript
// Buggy Code
const token = req.headers["authorization-token"];

// Fixed Code
const authHeader = req.headers.authorization;
const token = authHeader?.substring(7); // Remove 'Bearer ' prefix
```

**How I Found It**: Profile endpoint always returned 401 even with valid Bearer token in Authorization header.

### Bug #4: Wrong Database Column Name in Query

**Location**: `src/routes/profile.ts`, line 9
**Problem**: Query used `user_id` field but database schema has `id` field
**Symptoms**: Profile endpoint returned empty result
**Root Cause**: Column name mismatch between query and database schema

```sql
-- Buggy Query
SELECT * FROM users WHERE user_id = $1

-- Fixed Query
SELECT * FROM users WHERE id = $1
```

**How I Found It**: Profile endpoint returned empty object after successful authentication.

### Bug #5: Model Field Mismatch with Database Schema

**Location**: `src/models/user.ts`, line 3
**Problem**: User model defined `username` field but database schema uses `email`
**Symptoms**: TypeScript type mismatches and potential runtime errors
**Root Cause**: Inconsistency between model definition and actual database schema

```typescript
// Buggy Model
export type User = {
  id: string;
  username: string;  // Wrong field name
  password: string;
  created_at: Date;
};

// Fixed Model
export type User = {
  id: string;
  email: string;     // Correct field name
  password: string;
  created_at: Date;
};
```

**How I Found It**: Reviewing database migration file and comparing with TypeScript model definitions.

## Debugging Process

### Testing Methodology
1. **Registration Testing**: Created test user via POST `/auth/register`
2. **Login Testing**: Attempted login with correct credentials
3. **Token Validation**: Tested protected routes with generated tokens
4. **Database Verification**: Checked actual database schema against code
5. **Code Review**: Systematic review of all route handlers and middleware

### Tools Used
- Manual API testing with curl/Postman
- Database schema inspection
- Static code analysis
- Console logging for debugging async operations

## Additional Improvements Made

Beyond the core bug fixes, I also implemented the required controller and service architecture:

- **UserService**: Handles database operations and business logic
- **AuthService**: Manages JWT operations
- **AuthController**: Handles authentication endpoints
- **UserController**: Manages user profile operations

This addresses the requirement for "Controllers and services are required" mentioned in the assessment instructions.