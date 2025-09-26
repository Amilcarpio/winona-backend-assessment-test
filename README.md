# Backend Assessment

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Copy the example file and edit with your credentials:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env`:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/assessment_db
     JWT_SECRET=your-super-secret-jwt-key-here
     PORT=4000
     ```


3. **Run migrations**
   ```bash
   npm run migrate
   ```
   This command will automatically create the `assessment_db` database (if it does not exist) and apply the migration script.

4. **Start the application**
   ```bash
   npm run dev
   ```
   The server will run at `http://localhost:4000`.

## Docker Setup (Alternative)

If you prefer to use Docker instead of local setup:

1. **Start with Docker Compose**
   ```bash
   npm run docker:build   # Build and start containers
   ```
   Or, if already built:
   ```bash
   npm run docker:up      # Start containers
   ```

2. **Stop containers**
   ```bash
   npm run docker:down
   ```

The application will be available at `http://localhost:4000` with PostgreSQL automatically configured.

## Running Tests

1. **Start test database**
   ```bash
   npm run test:docker    # Starts test DB container
   ```

2. **Run tests**
   ```bash
   npm test
   ```

## API Endpoints

### Register User
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login User
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Response:
```json
{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:4000/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

Response:
```json
{
  "id": "uuid-here",
  "email": "user@example.com", 
  "created_at": "2025-09-26T13:29:57.125Z"
}
```

---

For bug details and fixes, see `DEBUG_REPORT.md`.