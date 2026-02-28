# 🧪 LeetLab — Full-Stack Coding Practice Platform

A LeetCode-inspired platform where users can practice coding problems with real-time code execution, submission tracking, and personal playlists.

---

## ✨ Features

- **Authentication** — Register/Login with JWT-based cookie auth
- **Role-Based Access** — Admin (manage problems) vs User (solve problems)
- **Code Editor** — Monaco Editor (same editor as VS Code) with multi-language support
- **Real-Time Execution** — Code runs via Piston Sandbox (supports Python, JavaScript, Java, C++, Go, Rust, Ruby and more)
- **Submission Tracking** — Every run is saved with pass/fail per test case
- **Playlists** — Organize problems into personal collections
- **Solved Problems** — Track which problems you've completed

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js, Prisma ORM, PostgreSQL |
| Code Execution | Piston Engine API (emkc.org/api/v2/piston) |
| Frontend | React 19, Vite, Tailwind CSS, DaisyUI |
| State Management | Zustand |
| Form Handling | React Hook Form + Zod |
| Code Editor | Monaco Editor |

---

## 🚀 Getting Started

### Prerequisites

### Prerequisites

- Node.js v18+
- PostgreSQL (local or cloud like [Neon](https://neon.tech))

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/leetlab.git
cd leetlab
```

---

### 2. Backend Setup

```bash
cd backend
npm install

# Copy the env template and fill in your values
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/leetlab"
JWT_SECRET="your-secret-key"
PORT=8081
NODE_ENV=development
```

Run migrations and start:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

Backend runs at: `http://localhost:8081`

---

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 5. Create your first Admin user

After registering via the UI, manually update your role in the database:

```bash
npx prisma studio
# Open the User table → find your user → change role to ADMIN
```

Or via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 📁 Project Structure

```
leetlab/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── controllers/        # Route logic
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # Auth & admin checks
│   │   └── libs/               # Piston client, Prisma client
│   └── .env.example
├── frontend/
│   └── src/
│       ├── page/               # Route pages
│       ├── components/         # Reusable components
│       ├── store/              # Zustand stores
│       └── lib/                # Axios instance, language utils
└── README.md
```

---

## 🌐 API Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/v1/auth/register` | — | Register new user |
| POST | `/api/v1/auth/login` | — | Login |
| POST | `/api/v1/auth/logout` | ✅ | Logout |
| GET | `/api/v1/auth/check` | ✅ | Check session |
| GET | `/api/v1/problems/get-all-problems` | ✅ | List all problems |
| GET | `/api/v1/problems/get-problem/:id` | ✅ | Get problem details |
| POST | `/api/v1/problems/create-problem` | Admin | Create problem |
| PUT | `/api/v1/problems/update-problem/:id` | Admin | Update problem |
| DELETE | `/api/v1/problems/delete-problem/:id` | Admin | Delete problem |
| POST | `/api/v1/execute-code` | ✅ | Run code |
| GET | `/api/v1/submission/get-all-submissions` | ✅ | Get all submissions |
| GET | `/api/v1/submission/get-submission/:id` | ✅ | Get submissions for problem |
| GET | `/api/v1/playlist/` | ✅ | Get all playlists |
| POST | `/api/v1/playlist/create-playlist` | ✅ | Create playlist |
| POST | `/api/v1/playlist/:id/add-problem` | ✅ | Add problem to playlist |

---

## 🚢 Deployment

### Backend — Render / Railway

1. Set environment variables in the dashboard
2. Build command: `npx prisma generate && npx prisma db push`
3. Start command: `node src/index.js`
4. Set `NODE_ENV=production`
5. Set `ALLOWED_ORIGINS` to your frontend URL

### Frontend — Vercel / Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set `VITE_API_URL` to your backend URL

### Database — Neon (free PostgreSQL)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`

---

## 🐛 Known Limitations

- The "Bookmark" button and "Submit Solution" button on the problem page are UI-only (not yet wired to backend)
- Discussion tab is a placeholder (not implemented)
- No password reset functionality

---

## 📄 License

MIT
