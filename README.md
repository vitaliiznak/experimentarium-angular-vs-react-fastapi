# Experimentarium: Angular vs React and FastAPI

A hands-on learning project comparing Angular(never worked with it before) and React implementations while building a secure authentication system with FastAPI backend. This project serves as a practical exploration of modern web development frameworks and practices.

## 🎯 Project Purpose

1. **Framework Comparison**
   - Compare Angular and React approaches to common web development tasks
   - Understand the strengths and trade-offs of Angualar framework
   - Implement the same features in both frameworks to highlight differences

2. **Explore FastAPI**
   - Explore FastAPI



## 🛠 Tech Stack

### Backend
- FastAPI 0.115.6
- SQLAlchemy 2.0.37
- PostgreSQL (via psycopg2-binary 2.9.10)
- Python 3.12

### Frontend
- React 18.2 with TypeScript
- Angular 19.1
- Vite (React)
- Angular CLI

### Quick Start with Docker




### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start all services:

```bash
docker compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- FastAPI backend (port 8000), http://localhost:8000/docs to see API docs

- Angular frontend (port 4200), http://localhost:4200 to see Angular app
- React frontend (port 5173), http://localhost:5173 to see React app



### E2E Tests

Prerequisites:
- All services are running

```bash
cd packages/testing
npm run test:e2e # Run all E2E tests
npm run test:e2e:react # Run React E2E tests only, no tests for React yet
npm run test:e2e:angular # Run Angular E2E tests only
```


Start specific service

```bash
docker compose up web-react # For React frontend
docker compose up web-angular # For Angular frontend
docker compose up api # For backend
```

Stop all services
```bash
docker compose down
```

View logs for a specific service
```bash
docker compose logs -f api # Backend logs
docker compose logs -f web-react # React frontend logs
docker compose logs -f web-angular # Angular frontend logs
docker compose logs -f db # Database logs
```


## 🔑 Testing Password Reset Using UI

### Using Angular Frontend (http://localhost:4200)

1. Navigate to Login page
2. Click "Forgot Password?" link
3. Enter your email address
4. Click "Reset Password" button

### Using React Frontend (http://localhost:5173)

1. Navigate to Login page
2. Click "Forgot Password?" link
3. Enter your email address
4. Click "Reset Password" button

### Finding the Reset Link

After submitting the form through either frontend:

1. Check the API logs to find the reset link:
```bash
# Using Docker
docker-compose logs -f api
```

2. Look for output that looks like:
```
Password reset link would be sent to your.email@example.com with token: <token>
Reset link: http://localhost:4200/auth/reset-password?token=<token>
```

3. Use the provided link to reset your password:
   - For Angular: Click the link directly
   - For React: Copy and paste the link, replacing the port 4200 with 5173

> 💡 Tip: Keep the API logs open in a separate terminal window while testing the password reset functionality to easily spot the reset links.

### Complete Reset Process

1. Open the reset link
2. Enter your new password
3. Submit the form
4. You should be redirected to the login page
5. Try logging in with your new password


