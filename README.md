# crm-test-task

## Overview

This project is a full-stack CRM system with authentication and GitHub repository management. It consists of a React frontend (Vite, TypeScript) and a NestJS backend. Users can register, log in, and manage their GitHub repositories (view, add, edit, delete) through a user-friendly interface.

## Features
- User registration and login with validation
- Secure authentication using cookies (access/refresh tokens)
- GitHub repository management (fetch, add, edit, delete)
- React context for user state
- Toast notifications for errors and actions
- Responsive, modern UI

## Prerequisites
- Node.js 18+
- npm or pnpm

## Setup Instructions

### 1. Clone the repository
```sh
git clone <repo-url>
cd crm-test-task
```

### 2. Install dependencies
```sh
cd apps/client
npm install
cd ../server
npm install
```

### 3. Environment Variables
- Copy `.env.example` to `.env` in both `apps/client` and `apps/server` if present.
- You **can use the provided GitHub API key and username from `.env`** for demo/testing purposes. If you want to use your own GitHub credentials, replace these values in your `.env` files.
- **Note:** The username and GitHub API key must match real GitHub credentials for full functionality (e.g., fetching and managing your own repositories).

### 4. Start the backend
```sh
cd apps/server
npm run start:dev
```

### 5. Start the frontend
```sh
cd apps/client
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173)
- The backend will run on [http://localhost:3000](http://localhost:3000) by default

## Usage
- Register or log in with your email, password, username, and GitHub API key.
- After login, you can view, add, edit, and delete your GitHub repositories.
- Use the logout button to securely end your session.

## Notes
- If you do not want to create your own GitHub credentials, you can use the demo GitHub API key and username provided in `.env.example`.
- **The username and GitHub API key must match real GitHub credentials for full access to your repositories.**
- All API requests are proxied through the backend for security.
- The system uses cookies for authentication; ensure your browser allows cookies for local development.

## Linting
To check code quality, run:
```sh
cd apps/client
npm run lint
```

---

For any issues or questions, please refer to the code comments or open an issue in the repository.