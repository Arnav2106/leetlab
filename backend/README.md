# LeetLab Backend API Documentation 🚀

This is the central backend repository for the LeetLab application. It is responsible for multi-language execution handling, database communication, and user authentication.

## Table of Contents
1. [Architecture](#architecture)
2. [Database Strategy & Seeding](#database-strategy--seeding)
3. [Language Support](#language-support)
4. [General Setup](#general-setup)
5. [API Routes](#api-routes)

---

## Architecture
- **Framework**: Express.js
- **Database ORM**: Prisma (PostgreSQL)
- **Code Execution**: The execution system sits heavily upon the [Piston Engine API](https://github.com/engineer-man/piston), abstracting container limits away from the main servers and routing standardized sandbox execution for tests reliably.
- **Authentication**: JWT Cookies + Bcrypt.

## Database Strategy & Seeding
The default `schema.prisma` accommodates relational mappings for Users, Submissions (with runtime and memory performance tracking), and Problem Sets. 

If this is a fresh setup, you do not need to hunt for 500 algorithm problems to seed. We have built an automated seeder script!
```bash
npx prisma generate
npx prisma db push
npm run seed  # Generates >500 problems and assigns them securely automatically!
```

## Language Support
The application supports the following languages natively via the `piston.lib.js`:
- `JAVASCRIPT` (Node v18+)
- `PYTHON` (v3.10)
- `JAVA` (v15)
- `C++`
- `C`
- `C#`
- `GO`
- `RUST`
- `RUBY`
- `PHP`
- `SWIFT`
- `SQL`

## General Setup
To start the developer environment backend server locally:

1. Clone backend and root into it:
```bash
cd backend
```

2. Establish `.env`:
```env
PORT=8081
DATABASE_URL="postgresql://usr:pass@pool.neon.tech/neondb"
JWT_SECRET="YOUR_JWT_SECRET"
ALLOWED_ORIGINS="http://localhost:5173"
```

3. Start server
```bash
npm run dev
```

## API Routes

### 🔥 Code Execution
- **`POST /api/v1/execute-code`**
  - Requires valid JWT
  - Body: `{ source_code, language_id, stdin, expected_outputs, problemId, timeSpent }`
  - Validates source against inputs, creates `Submission` mapping, and returns a fully detailed code test trace response.

### 📝 Problem Sets
- **`GET /api/v1/problems/`** (Fetches active list of problems)
- **`GET /api/v1/problems/:id`** (Fetch problem details + initial snippets)
- **`POST /api/v1/problems/`** (Admin: Creates problem mappings)

### 👤 Authentication
- **`POST /api/v1/auth/signup`**
- **`POST /api/v1/auth/login`**
- **`POST /api/v1/auth/logout`**
- **`GET /api/v1/auth/check`**

---
🚀 *Happy Coding on LeetLab!* 🚀
