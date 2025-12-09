# Christmas Media App

A Node.js + Express + MySQL web app for managing programs, actors, directors, producers, and streaming platforms.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features
- Add, view, and manage programs, actors, directors, producers, and platforms.
- RESTful API endpoints for all main resources.
- MySQL database connection via environment variables.
- Simple front-end with EJS templates.

---

## Requirements
- Node.js v20+  
- MySQL 8+  
- npm

---

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd christmas-app

2.	Install dependencies:
bash

npm install

3.	Create a .env file in the root of the project with your database credentials:

code

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootroot
DB_NAME=christmas_media

4.	Make sure your MySQL database christmas_media exists.
5.	Start the app:
bash

npm run dev   # if using nodemon
# or
node app.js

Usage
	•	Open your browser at http://localhost:3000
	•	Use Postman to test the API endpoints (/api/programs, /api/actors, etc.)

⸻

API Endpoints (example for Programs)
	•	GET /api/programs → List all programs
	•	GET /api/programs/:id → Get program by ID
	•	POST /api/programs → Add a new program
	•	Body JSON:

{
  "title": "Test Movie",
  "yr_released": 2025,
  "runtime_minutes": 120,
  "format": "live-action",
  "program_rating": "PG",
  "rating": 8.5,
  "description": "This is a test movie"
}

Similar endpoints exist for actors, directors, producers, and platforms.

⸻

Environment Variables
	•	DB_HOST → Database host
	•	DB_USER → Database username
	•	DB_PASSWORD → Database password
	•	DB_NAME → Database name

These are loaded in config/db.js via dotenv.

------
made with love, 
Seth Sargent