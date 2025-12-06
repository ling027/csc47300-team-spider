# Movie Rating App

A full-stack movie rating application built with React, Express.js, and MongoDB.

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **IDE** (Recommended: VS Code)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Movie_Rating_app
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with MongoDB connection string
```

Create a `.env` file in the `backend/` directory with your MongoDB connection string:

```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your-secret-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Generate JWT Secret (optional):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 4. Set Up Frontend

Open a new terminal window and navigate to the root directory:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 5. Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Project Structure

```
Movie_Rating_app/
├── backend/          # Express.js API server
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   └── middleware/
│   └── .env          # Environment variables (create this)
├── src/              # React frontend
│   ├── api/          # API client functions
│   ├── components/  # React components
│   └── view/        # Page components
└── package.json
```

## Features

- User authentication (Register/Login)
- Movie watchlists with ratings and reviews
- Discussion threads and replies
- Movie comments
- User profiles with statistics
- Activity tracking

## Troubleshooting

**Backend won't start:**
- Check that MongoDB connection string is correct in `.env`
- Make sure port 5000 is not in use

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check that `FRONTEND_URL` in backend `.env` matches frontend URL

**Axios import errors:**
- Run `npm install` in the root directory






