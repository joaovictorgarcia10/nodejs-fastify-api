# Node.js API - Course Management System

A robust and scalable RESTful API built with Node.js, Fastify, and PostgreSQL for managing courses, users, and enrollments.

## 🚀 Features

- **User Management**: User registration, authentication, and role-based access control
- **Course Management**: Create, read, and manage courses
- **Enrollment System**: Handle course enrollments with user-course relationships
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens
- **Database Migrations**: Version-controlled database schema with Drizzle ORM
- **API Documentation**: Interactive API documentation with Swagger/Scalar
- **Test Coverage**: Comprehensive test suite with Vitest
- **Docker Support**: Containerized application with Docker and Docker Compose

## 🛠️ Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Fastify
- **Database**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **Authentication**: JWT with Argon2 password hashing
- **Validation**: Zod schemas
- **Testing**: Vitest with coverage reports
- **Documentation**: Swagger/OpenAPI with Scalar UI
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd nodejs-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` and `.env.test` files in the root directory:

### 4. Start the database

Using Docker Compose:
```bash
docker-compose up -d
```

Or set up PostgreSQL manually and create the databases.

### 5. Run database migrations

```bash
npm run db:migrate
```

### 6. Seed the database (optional)

```bash
npm run db:seed
```

### 7. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3333`

## 📖 API Documentation

When running in development mode, interactive API documentation is available at:
- **Scalar UI**: `http://localhost:3333/docs`

## 🗄️ Database Schema

The application uses three main entities:

- **Users**: User accounts with role-based permissions (ADMIN/USER)
- **Courses**: Course information and content
- **Enrollments**: Many-to-many relationship between users and courses

## 🔌 API Endpoints

### Authentication
- `POST /users` - Register a new user
- `POST /login` - Authenticate user and get JWT token

### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create a new course (Admin only)

### Enrollments
- `GET /enrollments` - List user enrollments
- `POST /enrollments` - Enroll in a course

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Generate test coverage report:

```bash
npm run test
```

Coverage reports are generated in the `coverage/` directory.

## 🗃️ Database Operations

### Migrations
```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

### Seeding
```bash
npm run db:seed
```

## 🐳 Docker Deployment

### Build and run with Docker

```bash
# Build the image
docker build -t nodejs-api .

# Run the container
docker run -p 3333:3333 nodejs-api
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
src/
├── app.ts                    # Fastify application setup
├── server.ts                 # Server entry point
├── @types/                   # TypeScript type definitions
├── database/
│   ├── client.ts            # Database connection
│   ├── schema.ts            # Drizzle schema definitions
│   └── seed.ts              # Database seeding
├── pre-handlers/            # Fastify pre-handlers
│   ├── check-request-jwt.ts # JWT validation
│   ├── check-user-role.ts   # Role-based access control
│   └── get-user-from-request.ts
└── routes/
    ├── courses/             # Course-related endpoints
    ├── enrollments/         # Enrollment endpoints
    └── user/               # User authentication endpoints
```

## 🔒 Security Features

- **Password Hashing**: Argon2 for secure password storage
- **JWT Authentication**: Stateless authentication with JSON Web Tokens
- **Role-Based Access**: Admin and User roles with different permissions
- **Input Validation**: Zod schemas for request/response validation
- **SQL Injection Protection**: Drizzle ORM with prepared statements


## 📝 Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use meaningful commit messages
- Update documentation when needed
- Ensure code passes linting and tests

## 📄 License

This project is licensed under the ISC License.
