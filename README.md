# New Arts Commerce and Science Library

A modern library management system designed for a college environment with role-based access for Admin, Librarian, and Students.

<p align="center">
  <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80" alt="Library banner" width="1200" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
</p>

## Overview

This project helps manage a digital library with:

- student registration and login
- book catalog browsing
- issue and return workflows
- librarian approval process
- admin dashboard management
- library attendance tracking with in-time and out-time entry
- responsive UI for desktop and mobile devices

## Features

### Student Features
- secure registration and login
- browse available books by category
- view book details and cover images
- check in and check out from the library
- track live library presence
- access personal profile and attendance information

### Librarian Features
- approve or reject borrowing requests
- manage book returns
- add and manage library inventory
- monitor student library activity

### Admin Features
- manage users and roles
- add librarians
- view library activity and dashboard statistics

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Bootstrap
- Axios
- React Toastify
- CSS modules and custom styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- nodemailer for OTP flows
- in-memory MongoDB fallback for local development

## Project Structure

```bash
.
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middlewares/
│   ├── model/
│   ├── routes/
│   ├── schemas/
│   ├── utils/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

## Demo Credentials

The application seeds demo users automatically when the backend starts.

- Admin
  - Email: admin@example.com
  - Password: admin123

- Librarian
  - Email: librarian@example.com
  - Password: lib123

- Student
  - Email: student@example.com
  - Password: student123

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/ddvaibhav/Library_Management.git
cd Library_Management
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Environment variables

Create a `.env` file in the backend folder if you want to use a real MongoDB connection.

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/library_db
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_SERVICE=gmail
```

For the frontend, create a `.env` file if needed:

```env
VITE_BACKEND_URL=http://localhost:5001/
```

If no MongoDB URL is set, the app automatically uses an in-memory MongoDB database for local development.

### 5. Run the app

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Then open the frontend in your browser, usually at:

```bash
http://localhost:5173
```

## Default Behavior

- backend tries port 5001 and automatically retries on the next available port if busy
- frontend expects backend URL through `VITE_BACKEND_URL` or falls back to localhost 5002 by default
- if no database is configured, demo data is automatically seeded into an in-memory Mongo instance

## Deployment Notes

This project is designed for deployment with:

- frontend on Vercel
- backend on Render or any Node.js host
- MongoDB Atlas or any MongoDB hosting provider

## License

This project is licensed under the ISC License.

## Contact

For questions or collaboration, connect via the GitHub repository or project owner.


