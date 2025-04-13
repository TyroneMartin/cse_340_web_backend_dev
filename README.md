# Car Dealership Backend System

This is a Node.js and Express-based backend application for a car dealership. It uses PostgreSQL for database management, EJS for templating, and Render for cloud deployment.

This project builds upon the [CSE 340 Starter Project](https://github.com/blainerobertson/cse340starter) and was customized to support multi-role access and inventory management for a simulated dealership.

---

## Features

- Role-based access (Employee, Visitor, Manager/Supervisor)
- Inventory management (add/delete vehicles)
- PostgreSQL-backed session handling and JWT authentication
- Modular MVC architecture (routes, controllers, views)
- Flash messages for user feedback

> Video demo: [Vehicle Inventory App Demo](https://youtu.be/f6Sj8UGBI3c) 

---

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- EJS Templating Engine
- `express-session` & `connect-pg-simple` (for session storage)
- `connect-flash` & `express-messages` (for flash alerts)
- `dotenv` (for managing environment variables)
- `jsonwebtoken` (for JWT token authentication)
- `bcryptjs` (for password hashing)
- `express-validator` (for input validation)
- [Render](https://render.com/) (for deployment)
- [PNPM](https://pnpm.io/) (for fast, efficient package management)

---

## Why PNPM?

This project uses [PNPM](https://pnpm.io/) as the preferred package manager.

Compared to NPM and Yarn:

1. **Efficient Storage** – Packages are only stored once and shared across projects.
2. **Faster Installs** – Uses a content-addressable filesystem, which speeds up installations.

### 📦 PNPM Installation

```bash
npm install -g pnpm
```

If you encounter any issues refer to:
👉 [PNPM Installation Guide](https://pnpm.io/installation)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/TyroneMartin/cse_340_web_backend_dev.git
cd cse_340_web_backend_dev
```

### 2. Install Dependencies

```bash
pnpm install
# or 
npm install
```

### 3. Create a `.env` File

```env
PORT=3000
HOST=localhost
SESSION_SECRET=yourSuperSecretSessionKey
ACCESS_TOKEN_SECRET=yourAccessTokenSecret
DATABASE_URL=postgres://username:password@host:port/database
NODE_ENV=development
NODE_VERSION=18
```

---

## 🔐 Generating an ACCESS_TOKEN_SECRET

To generate a secure JWT token secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Paste the result in your `.env` as:

```env
ACCESS_TOKEN_SECRET=yourGeneratedSecureTokenHere
```

---

## 🗄️ Hosting PostgreSQL on Render

1. Go to [Render.com](https://render.com/)
2. Select **New → PostgreSQL**
3. Enter a **unique database name**
4. Wait for provisioning (~1 minute)
5. Go to the **Info tab** of your new database
6. Copy the **External Database URL** and paste it into `.env`:

```env
DATABASE_URL=postgres://username:password@hostname:5432/databasename
```

> ✅ Use External URL for local dev  
> ✅ Use Internal URL if deployed on Render frontend/backend

---

## Initialize PostgreSQL

Run the SQL scripts in the `database/` folder:

```text
1. creation_of_tables.sql
2. assignment2.sql
3. final_project.sql
```

You can also use pgAdmin, DBeaver, or psql CLI to execute them.

---

## Local Development

To start the server:

```bash
pnpm start
# or
npm start
```
Also 

```bash
 pnpm run dev # watch for changes
```


Then visit:

```
http://localhost:3000
```

---

## Deployment on Render

### 1. Build & Start Commands

- **Build Command:** `pnpm install`
- **Start Command:** `pnpm start`

### 2. Add These Environment Variables

| Key                 | Value                                  |
|---------------------|----------------------------------------|
| PORT                | 3000                                   |
| HOST                | 0.0.0.0                                |
| SESSION_SECRET      | yourSuperSecretSessionKey              |
| ACCESS_TOKEN_SECRET | yourAccessTokenSecret                  |
| DATABASE_URL        | (Your PostgreSQL connection string)    |
| NODE_ENV            | production                             |
| NODE_VERSION        | 18 (or greater)                                    |

---

## Directory Structure

```
project-root/
│
├── controllers/
├── database/
├── models/
├── public/
├── routes/
├── utilities/
├── views/
├── .env
├── server.js
├── package.json
```

---

## Author

**Tyrone Martin**  
Software Engineering Student – BYU-Idaho

---

>## Notes

This project was developed as part of a CSE 340 class assignment.  
It is not intended for production use or as a real business application.
