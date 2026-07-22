# FlowBit Ticket Management System

FlowBit is a full-stack application for managing work tickets across projects. It provides secure sign-in, role-based access control, ticket tracking, comments, file references, and administration screens for projects, users, and roles.

## Features

- JWT authentication and self-registration
- Role-based permissions (admin, agent, and end user)
- Create, view, update, filter, paginate, and delete tickets
- Ticket priority, status, project, and assignee management
- Ticket comments and file-title/link references
- Project, user, and role management
- Swagger API documentation
- Responsive React user interface

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, JavaScript/JSX, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Authentication | JSON Web Tokens and bcrypt |

## Project structure

```text
Ticket-Management-System/
├── backend/                 # Express API and Prisma database layer
│   ├── prisma/              # Schema, migrations, and seed data
│   └── src/                 # Routes, controllers, services, middleware
├── frontend/                # React + JavaScript application
│   └── src/
│       ├── components/      # Login, layout, tickets, shared UI
│       ├── pages/           # Dashboard, projects, users, and roles
│       ├── App.jsx          # Application state and page coordination
│       └── api.js           # API client
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL 16, or Docker Desktop to run the included PostgreSQL container

## Getting started

### 1. Start PostgreSQL

From the `backend` directory, start the bundled database container:

```bash
docker compose up -d
```

Alternatively, use an existing PostgreSQL database.

### 2. Configure the backend

Create `backend/.env` with your database connection and a JWT secret:

```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/ticketdb?schema=public"
JWT_SECRET="replace-this-with-a-secure-secret"
CORS_ORIGINS="http://localhost:4000"
```

Install dependencies, apply migrations, seed the database, and run the API:

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

The API runs at `http://localhost:3000`. Swagger documentation is available at `http://localhost:3000/flowbit`.

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:4000`.

By default, the frontend calls `http://localhost:3000`. To use a different API address, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Demo account

After running the seed command, you can sign in with:

```text
Email: cb@gmail.com
Password: cb@1234
```

## Useful commands

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run start:dev` | Run the API in development mode |
| `backend` | `npm run build` | Compile the backend |
| `backend` | `npm run typecheck` | Check backend TypeScript types |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Create a production frontend build |
| `frontend` | `npm run preview` | Preview the production build |

## Notes

- The frontend intentionally uses React with JavaScript (`.jsx` and `.js`), not TypeScript.
- Access to actions depends on the permissions assigned to the signed-in user's role.
- Deletions in the API are soft deletes, so records are marked inactive rather than immediately removed from the database.
