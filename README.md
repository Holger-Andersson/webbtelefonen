# Webbtelefonen

A web app where you can manage contacts and send SMS or make prank calls to them. The backend provides a REST API that communicates with the 46elks API to handle calls and texts.

## What it does

- Create an account and log in
- Add, edit and delete contacts
- Send SMS to a contact
- Make a prank call to a contact (calls are recorded and can be listened to afterwards on the 46elks dashboard)

## Tech stack

- Frontend: TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: MongoDB
- SMS / calls: 46elks

## How to run

You need to run the backend and frontend separately.

**Backend**
```
cd backend
npm install
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev:srv
```

The frontend runs on http://localhost:5173 and proxies API calls to the backend on port 3000.

Make sure you have a `.env` file in the backend folder with your MongoDB connection string and any other required variables.
