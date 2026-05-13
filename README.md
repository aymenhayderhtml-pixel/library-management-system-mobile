# 📚 Library Management System

A full-stack mobile application for university library management built with React Native (Expo), Node.js, Express, and MongoDB.

## 🎯 Features

### Admin
- Role-based login (Admin / User toggle)
- User Control: Add, edit, delete library users
- Book Control: Add, edit, delete books
- View all borrow records with due dates
- Search books by title, author, or category

### User (Student)
- Browse available books with live quantity badges
- Search the book catalog
- Borrow books (with 14-day due date tracking)
- View "My Borrowed Books" with overdue warnings
- Return books with confirmation

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + Expo |
| Navigation | React Navigation (Stack) |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Storage | AsyncStorage (local auth state) |

## 🚀 Setup Instructions

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017, or update the connection string in `backend/server.js`.

### 2. Run Backend
```bash
cd backend
npm install
npm run dev
```
Server runs at `http://localhost:5000`

### 3. Run Frontend
```bash
cd frontend
npm install
npx expo start --web    # or --android / --ios
```

### 4. Login
- **Admin:** `admin` / `admin123`
- **User:** Create users from the Admin Dashboard first, then login as User

## 📂 Project Structure

```
library-management-system/
├── backend/
│   ├── models/         # Book, Borrow, User schemas
│   ├── routes/         # REST API routes
│   └── server.js       # Express entry point
└── frontend/
    └── src/screens/    # React Native screens
```

## 👨🎓 Course Context
Built for University coursework covering React Native components, Flexbox layout, useState/useEffect hooks, REST API integration, and MongoDB CRUD operations.

## 📱 Screenshots

*(Add screenshots here: Login Screen, Admin Dashboard, Book List, Borrow Records)*