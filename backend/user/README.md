# User Service

This service provides functionality for user management in the travel platform. It includes basic CRUD operations with security validations and pagination.

## Overview

The user service handles the creation, querying, and management of system users. All passwords are securely stored using bcrypt with 10 salt rounds. API responses never include the user's password for security reasons.

## Service Structure

The service is organized into three main files:

- **`user.types.ts`**: Defines the TypeScript interfaces used in the service
- **`user.service.ts`**: Contains business logic and data access
- **`user.ts`**: Defines the REST API endpoints

## Data Types

### `User`
Represents a complete user with all their data (including the hashed password).

```typescript
interface User {
    id: number;
    email: string;
    name: string;
    password: string; 
    role_id: number; 
    created_at: Date;
    updated_at: Date;
}
```

### `UserPublic`
Represents a user without the password, used in API responses.

```typescript
interface UserPublic {
    id: number;
    email: string;
    name: string;
    role_id: number; 
    created_at: Date;
    updated_at: Date;
}
```

### `GetAllUsersResponse`
Paginated response for querying multiple users.

```typescript
interface GetAllUsersResponse {
    users: UserPublic[];
    count: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}
```

## API Endpoints

### 1. Create User

**Endpoint:** `POST /users`

**Description:** Creates a new user in the system.

**Body Parameters:**
- `email` (string, required): User's email. Must be a valid email address.
- `name` (string, required): User's name. Must be between 1 and 100 characters.
- `password` (string, required): User's password. Must meet the following requirements:
  - Minimum 8 characters
  - Maximum 100 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

**Success Response:**
```json
{
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid email, empty name, or password doesn't meet requirements
- `409 Conflict`: Email already exists in the system
- `500 Internal Server Error`: Error creating the user

**Request Example:**
```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "Password123"
  }'
```

---

### 2. Get All Users

**Endpoint:** `GET /users`

**Description:** Retrieves a paginated list of all users in the system.

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1. Must be greater than 0.
- `limit` (number, optional): Number of users per page. Default: 10. Minimum: 1, Maximum: 100.

**Success Response:**
```json
{
    "users": [
        {
            "id": 1,
            "email": "user1@example.com",
            "name": "John Doe",
            "role_id": 1,
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        },
        {
            "id": 2,
            "email": "user2@example.com",
            "name": "Jane Smith",
            "role_id": 1,
            "created_at": "2024-01-15T11:00:00Z",
            "updated_at": "2024-01-15T11:00:00Z"
        }
    ],
    "count": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
}
```

**Request Example:**
```bash
curl -X GET "http://localhost:4000/users?page=1&limit=10"
```

---

### 3. Get User by Email

**Endpoint:** `GET /users/email/:email`

**Description:** Retrieves a specific user by their email address.

**Path Parameters:**
- `email` (string, required): Email of the user to search for. Must be a valid email address.

**Success Response:**
```json
{
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid or empty email
- `404 Not Found`: User not found

**Request Example:**
```bash
curl -X GET "http://localhost:4000/users/email/user@example.com"
```

---

### 4. Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Retrieves a specific user by their ID.

**Path Parameters:**
- `id` (string, required): User ID. Must be a positive integer.

**Success Response:**
```json
{
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
}
```

**Possible Errors:**
- `400 Bad Request`: Invalid ID (must be a positive integer)
- `404 Not Found`: User not found

**Request Example:**
```bash
curl -X GET "http://localhost:4000/users/1"
```

---

## Service Functions

### `createUser(email: string, name: string, password: string): Promise<UserPublic>`
Creates a new user in the system. Validates that the email doesn't already exist and hashes the password before storing it.

### `getAllUsers(page: number, limit: number): Promise<GetAllUsersResponse>`
Retrieves a paginated list of users. Users are ordered by creation date in descending order.

### `getUserByEmail(email: string): Promise<UserPublic>`
Retrieves a user by their email address.

### `getUserById(id: number): Promise<UserPublic>`
Retrieves a user by their ID.

### `checkUserExists(email: string): Promise<boolean>`
Checks if a user exists in the system based on their email. Returns `true` if exists, `false` otherwise.

---

## Validations

### Email Validation
- Must be a valid email format
- Cannot be empty
- Validated using Zod schema with `.email()`

### Name Validation
- Must have at least 1 character
- Maximum 100 characters

### Password Validation
- Minimum 8 characters
- Maximum 100 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number

### ID Validation
- Must be a positive integer
- Validated both at the endpoint and service level

---

## Security

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds before being stored in the database.

2. **Password Obfuscation**: API responses never include the user's password. The `toUserPublic()` function is used to convert `User` objects to `UserPublic`, removing the `password` field.

3. **Input Validation**: All input data is validated using Zod before processing.

---

## Error Handling

The service uses Encore's standard error codes:

- `APIError.invalidArgument`: For invalid input data (400)
- `APIError.notFound`: When a resource is not found (404)
- `APIError.alreadyExists`: When attempting to create a resource that already exists (409)
- `APIError.internal`: For internal server errors (500)

---

## Dependencies

- **encore.dev/api**: Framework for creating APIs with Encore
- **bcrypt**: Library for password hashing
- **zod**: Library for schema validation

---

## Implementation Notes

- Users are ordered by `created_at DESC` in paginated queries
- Maximum limit of users per page is 100 to avoid overload
- Email is normalized (trim) before performing searches
- Pagination uses `OFFSET` and `LIMIT` in SQL queries
