# RiwiMediCare - Medical Supply Chain Management System

Enterprise REST API to manage and control the lifecycle of pharmaceutical supply requests between healthcare clinics and central distribution warehouses, built with **Node.js**, **Express 5**, **TypeScript 5**, **Sequelize ORM**, and **PostgreSQL**.

---

## Developer & Project Information
- **Developer:** Brayan Lozada
- **Clan:** NodeJS / NestJS AM
- **Competency Standard:** 220501096 - Develop software solutions in accordance with design specifications and reference frameworks.
- **GitHub Public Repository:** [https://github.com/brayanlozada1102-collab/Prueba_de_desempe-o_Node.js_RiwiMediCare.git](https://github.com/brayanlozada1102-collab/Prueba_de_desempe-o_Node.js_RiwiMediCare.git)

---

## 📚 Deliverables and Documentation

The project includes complete technical and functional documentation required for formal product evaluation:

| Deliverable Item | File Link | Description |
| :--- | :--- | :--- |
| **1. Source Code Technical Document** | [DOCUMENTO_TECNICO_CODIGO_FUENTE_RIWIMEDICARE.md](./DOCUMENTO_TECNICO_CODIGO_FUENTE_RIWIMEDICARE.md) | Project structure, multi-layer architecture, HTTP request flow, commented code snippets (controllers, services, repositories, models, middlewares), and best programming practices (SOLID, Clean Code, JWT/bcrypt security, strict typing). |
| **2. User Manual & Deployment Instructions** | [INSTRUCTIVO_DE_USO_MANUAL_DE_USUARIO_RIWIMEDICARE.md](./INSTRUCTIVO_DE_USO_MANUAL_DE_USUARIO_RIWIMEDICARE.md) | Step-by-step user and installation manual, environment variables, bulk data loading with Seeders, JSON Request/Response examples, interactive Swagger UI guide, and troubleshooting. |
| **3. Functional Software Solution** | `src/` and `dist/` | 100% functional REST API backend, strictly typed with TypeScript and validated with PostgreSQL. |
| **Database SQL Backup** | [BackUpDBLozada](./BackUpDBLozada) | Full PostgreSQL DDL/DML dump including schemas, relational constraints, foreign keys, and initial seed records. |
| **Software Design Document (Standard 220501095)** | [DOCUMENTO_DISENO_SOFTWARE_RIWIMEDICARE.md](./DOCUMENTO_DISENO_SOFTWARE_RIWIMEDICARE.md) | Use case diagrams, UML class diagrams, sequence diagrams, activity diagrams, ERD, and wireframe prototypes. |
| **Interactive UI Wireframes** | [wireframes/index.html](./wireframes/index.html) | Navigable frontend wireframes built with HTML5, Tailwind CSS, and JavaScript. |

---

## 🛠️ Technology Stack & Frameworks
- **Language:** TypeScript 5.5+
- **Runtime Environment:** Node.js 18+ LTS
- **Web Framework:** Express 5.2+
- **Database:** PostgreSQL 16
- **ORM:** Sequelize 6.37+
- **Security & Cryptography:** JSON Web Tokens (JWT) & bcryptjs (10 salt rounds)
- **File Upload Processing:** Multer (In-memory stream processing for JSON seeders)
- **Interactive Documentation:** Swagger UI / OpenAPI 3.0
- **Containerization:** Docker & Docker Compose (PostgreSQL + pgAdmin 4)

---

## 📁 Project Architecture & Directory Layout

```
src/
├── config/        # Database (Sequelize), typed environment variables, and Swagger OpenAPI
├── controllers/   # HTTP request handlers and standardized JSON responses
├── middlewares/   # Security interceptors (JWT verifyToken & verifyAdmin RBAC)
├── models/        # Sequelize entity schemas and relational associations
├── repositories/  # Data access layer (Repository Pattern)
├── routes/        # Semantic route definitions and HTTP verbs
├── services/      # Business logic layer (stock validation and request lifecycle)
├── app.ts         # Central Express application integration
└── server.ts      # Server bootstrap and database synchronization
```

---

## 🚀 Quick Installation & Setup Guide

### 1. Clone the repository
```bash
git clone https://github.com/brayanlozada1102-collab/Prueba_de_desempe-o_Node.js_RiwiMediCare.git
cd Prueba_de_desempe-o_Node.js_RiwiMediCare
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create your `.env` configuration file from the template:
```bash
# Windows
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

Configure your credentials:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=riwi_base_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=super_secret_jwt_key_riwimedicare_2026
JWT_EXPIRES_IN=1d
```

### 4. Start PostgreSQL with Docker Compose (Recommended)
```bash
docker compose up -d
```
*Starts PostgreSQL on port `5432` and pgAdmin 4 on port `5050`.*

### 5. Run the Application

- **Development Mode (with hot-reload):**
  ```bash
  npm run dev
  ```

- **Production Mode (TypeScript compilation):**
  ```bash
  npm run build
  npm start
  ```

Once running:
- **Base URL:** `http://localhost:3000`
- **Health Check:** `http://localhost:3000/health`
- **Interactive Swagger UI Documentation:** `http://localhost:3000/api/docs`

---

## 📦 Bulk Initial Data Import (Seeders)

To quickly populate the database with realistic test data without duplicate key conflicts, use the 4 JSON datasets located in `seeders/`:

```
seeders/
├── users.json        # 2 users (1 Admin, 1 Clinical Manager)
├── clinics.json      # 3 healthcare clinics
├── warehouses.json   # 2 distribution warehouses
└── medications.json  # 4 medications with initial stock quantities
```

### Seeding via cURL:
```bash
# 1. Obtain Admin JWT token via login
TOKEN="YOUR_ADMIN_JWT_TOKEN_HERE"

# 2. Upload JSON datasets via multipart/form-data endpoint
curl -X POST http://localhost:3000/api/seed/users -H "Authorization: Bearer $TOKEN" -F "file=@./seeders/users.json"
curl -X POST http://localhost:3000/api/seed/clinics -H "Authorization: Bearer $TOKEN" -F "file=@./seeders/clinics.json"
curl -X POST http://localhost:3000/api/seed/warehouses -H "Authorization: Bearer $TOKEN" -F "file=@./seeders/warehouses.json"
curl -X POST http://localhost:3000/api/seed/medications -H "Authorization: Bearer $TOKEN" -F "file=@./seeders/medications.json"
```

*You can also execute bulk seeding interactively in Swagger UI (`/api/docs`) under the **Seeder** tag.*