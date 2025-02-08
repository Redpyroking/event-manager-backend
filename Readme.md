# Event Management Platform

## Overview
This project is a full-stack event management platform that allows users to create, manage, and view events with real-time updates. Users can register, log in (or use Guest Login for limited features), create events, and see real-time updates via Socket.IO.

## Features
- **User Authentication:** Register, Login, and Guest Login.
- **Event Dashboard:** View upcoming and past events with filtering capabilities.
- **Event Creation:** Create events with details like title, description, date/time.
- **Real-Time Updates:** Real-time notifications for event creation, updates, and deletions.
- **Responsive Design:** Works on all devices.

## Technologies Used
- **Frontend:** React.js, Axios, React Router, Socket.IO Client.
- **Backend:** Node.js, Express.js, JWT, Socket.IO, MongoDB (Mongoose).
- **Deployment:** Vercel or Netlify for the frontend, Render or Railway.app for the backend, MongoDB Atlas for the database.

## Setup Instructions

### Backend
1. Navigate to the `server` directory.
2. Create a `.env` file with the following variables:

MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_jwt_secret PORT=5000

3. Run `npm install` to install dependencies.
4. Start the server with `node server.js` or `nodemon server.js`.

### Frontend
1. Navigate to the `client` directory.
2. Run `npm install` to install dependencies.
3. Start the React app with `npm start`.

### Test User Credentials
- **Test Email:** test@example.com
- **Test Password:** test123

## Live Deployment
- **Frontend URL:** [Your deployed frontend URL]
- **Backend URL:** [Your deployed backend URL]