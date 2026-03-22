# 🛡️ SQL Injection & JWT Authentication Lab

This project is an educational lab designed to demonstrate common web vulnerabilities, specifically **SQL Injection** in both login and registration flows, and how they can lead to **Privilege Escalation** and **Authentication Bypass**.

## 🚀 Features
* **Vulnerable Login:** Demonstrates authentication bypass using `' OR '1'='1'--`.
* **Vulnerable Registration:** Demonstrates role injection to gain `admin` privileges.
* **JWT Authentication:** Shows how successful SQL injection leads to the issuance of valid administrative tokens.
* **Secure Implementation:** Includes examples of how to fix these vulnerabilities using **Parameterized Queries** and **Libraries (ORMs/Query Builders)**.
* **Dockerized:** Easy setup with Docker and Docker Compose.

## 🛡️ Vulnerabilities & Fixes

### 1. SQL Injection (Login Bypass)
**Vulnerable Code (`models/User.js`):**
```javascript
// DANGEROUS: Direct string concatenation
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```
**The Attack:** Enter `admin'--` as the username. The query becomes: `SELECT * FROM users WHERE username = 'admin'--' AND password = '...'` The `--` comments out the password check, logging you in as admin.

**The Fix 1: Parameterized Query (Raw SQL):**
```javascript
// SECURE: Use placeholders
const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
const values = [username, password];
await pool.query(query, values);
```

**The Fix 2: Using a Library (ORM/Query Builder):**
Libraries handle parameterization automatically, eliminating syntax mistakes.

**Node.js (Prisma ORM):**
```javascript
// SECURE: Prisma abstracts the SQL and automatically parameterizes inputs
const user = await prisma.user.findFirst({
  where: { username, password }
});
```

**Rust (SQLx):**
```rust
// SECURE: sqlx::query! enforces parameter binding at compile time
let user = sqlx::query!(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    username,
    password
)
.fetch_optional(&pool)
.await?;
```

### 2. SQL Injection (Role Injection/Privilege Escalation)
**Vulnerable Code (`models/User.js`):**
```javascript
// DANGEROUS: Direct string concatenation in INSERT
const query = `INSERT INTO users (username, password, role) VALUES ('${username}', '${password}', '${role}')`;
```
**The Attack:** Enter `hacker', 'password', 'admin')--` as the username. This bypasses the default 'user' role and creates an 'admin' account.

**The Fix 1: Parameterized Query (Raw SQL):**
```javascript
// SECURE: Use placeholders
const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)';
const values = [username, password, 'user']; // Hardcode the role or validate it
await pool.query(query, values);
```

**The Fix 2: Using a Library (ORM/Query Builder):**

**Node.js (Prisma ORM):**
```javascript
// SECURE: Strict schema validation prevents injecting unexpected fields
const newUser = await prisma.user.create({
  data: {
    username,
    password,
    role: 'user' // Explicitly set the default
  }
});
```

## 🛠️ Setup & Installation

### Option 1: Using Docker (Recommended)
The easiest way to run the lab is using Docker Compose.
```bash
docker compose up
```
This will start both the Express app and a PostgreSQL database pre-configured with the necessary tables.

### Option 2: Manual Installation
1.  **Install Dependencies:** `pnpm install` (or `npm install`)
2.  **Setup Database:** Run the commands in `setup.sql` on your local PostgreSQL server.
3.  **Configure Environment:** Create a `.env` file based on `.env.example`.
4.  **Start Server:** `pnpm start`

## 📜 Automation Scripts

### 🗄️ Database Setup
Use these scripts to automatically create the `vulndb` database and run the `setup.sql` script (requires PostgreSQL client tools installed).
- **Windows:** `setup-db.bat`
- **Linux/macOS:** `./setup-db.sh`

### 🚀 Application Installation
Run these scripts to install dependencies and start the server (requires Node.js and pnpm/npm).

**Windows (install.bat):**
```dos
@echo off
echo Installing dependencies...
call pnpm install
echo Starting the server...
call pnpm start
pause
```

**Linux/macOS (install.sh):**
```bash
#!/bin/bash
echo "Installing dependencies..."
pnpm install
echo "Starting the server..."
pnpm start
```

## 🌐 Accessing the Lab
- **Login Page:** `http://localhost:3000/login.html`
- **Registration Page:** `http://localhost:3000/register.html`
- **Admin Dashboard:** `http://localhost:3000/admin.html` (Protected)
- **User Profile:** `http://localhost:3000/user.html` (Protected)

---
**Disclaimer**: This project is for educational purposes only. Never use these vulnerable patterns in production applications. Always prefer using modern ORMs or query builders to mitigate these types of security risks.
