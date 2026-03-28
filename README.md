# HireMe API Server - Postman Guide

This API server provides endpoints for authentication, job postings, application submissions, and an AI-powered chat system based on a robust Node.js, Express, and MongoDB backend using MVC architecture.

- Link : https://hire-me-backend-server-with-mvc-arc.vercel.app

## Getting Started

1. **Environment Setup**: Ensure your `.env` file contains necessary configuration (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`).
2. **Start the server**: 
   - **Development**: `npm run dev`
   - **Production**: `npm run build` followed by `npm start`
3. **Base URL**: `http://localhost:5000` (assuming default port config `5000`)
   - **API Base**: `http://localhost:5000/api/v1`

## Demo Credentials

Use these pre-configured credentials in the **Login** endpoint to retrieve a JWT token for testing corresponding role-based routes via Postman.

- **Admin Account**:
  - `email`: admin@mail.com
  - `password`: admin@123
- **Employee (Applicant) Account**:
  - `email`: test@mail.com
  - `password`: test@123
- **Employer Account**:
  - `email`: employer@mail.com
  - `password`: employer@123

---

## Setting Up Postman for Authorization

Most functional endpoints are protected by the `auth` middleware, and some further restrict access depending on your role (`employee`, `employer`, `admin`).

1. Make a `POST` request to `/api/v1/users/login` with your credentials.
2. The response will contain a `token`. Copy this string.
3. In postman, select your desired protected route, navigate to the **Authorization** tab.
4. Choose **"Bearer Token"** from the Type dropdown menu.
5. Paste your copied token into the **Token** field.

---

## API Endpoints Overview

### 1. Users / Authentication (`/users`)

#### Register a New User
- **Method**: `POST`
- **URL**: `/api/v1/users/register`
- **Type**: Public
- **Body (JSON)**:
  ```json
  {
      "username": "John Doe",
      "email": "johndoe@mail.com",
      "password": "securepassword123",
      "role": "employee" // Options: 'employee', 'employer', 'admin'
  }
  ```

#### Login
- **Method**: `POST`
- **URL**: `/api/v1/users/login`
- **Type**: Public
- **Body (JSON)**:
  ```json
  {
      "email": "test@mail.com",
      "password": "test@123"
  }
  ```

#### Get All Users
- **Method**: `GET`
- **URL**: `/api/v1/users/all-users`
- **Type**: Private (`admin` only)

#### Logout
- **Method**: `POST`
- **URL**: `/api/v1/users/logout`
- **Type**: Public

---

### 2. Jobs (`/jobs`)

#### Create a Job
- **Method**: `POST`
- **URL**: `/api/v1/jobs/create`
- **Type**: Private (`employer` only)
- **Body (JSON)**:
  ```json
  {
      "title": "Backend Software Engineer",
      "description": "Develop and maintain robust web applications and RESTful APIs.",
      "company": "Tech Innovations Inc.",
      "location": "Remote",
      "salary": 120000,
      "jobType": "full-time", // Options: 'full-time', 'part-time', 'contract', 'internship'
      "requirements": ["TypeScript", "Node.js", "MongoDB"],
      "responsibilities": ["Architecture Design", "API Development"]
  }
  ```

#### Get All Jobs (Feed)
- **Method**: `GET`
- **URL**: `/api/v1/jobs/feeds`
- **Type**: Public

#### Get Single Job
- **Method**: `GET`
- **URL**: `/api/v1/jobs/:id` (Replace `:id` with job `_id`)
- **Type**: Private (Any logged-in user)

#### Get Current Employer's Listings
- **Method**: `GET`
- **URL**: `/api/v1/jobs/employer/listings`
- **Type**: Private (`employer` only)

#### Update a Job
- **Method**: `PATCH`
- **URL**: `/api/v1/jobs/update/:id`
- **Type**: Private (`employer` only)
- **Body (JSON)**: Update desired fields (e.g., `{"status": "closed"}`)

#### Delete a Job
- **Method**: `DELETE`
- **URL**: `/api/v1/jobs/delete/:id`
- **Type**: Private (`employer` or `admin` only)

---

### 3. Applications (`/apply`)

#### Submit a Job Application
- **Method**: `POST`
- **URL**: `/api/v1/apply/submitted`
- **Type**: Private (`employee` only)
- **Body (JSON)**:
  ```json
  {
      "job": "<job_id_here>",
      "coverLetter": "Hello, I am extremely interested in joining your technical team...",
      "resumeUrl": "https://link.to.your/resume.pdf"
  }
  ```

#### Get My Applications
- **Method**: `GET`
- **URL**: `/api/v1/apply/my-applications`
- **Type**: Private (`employee` only)

#### Update Application Status
- **Method**: `PATCH`
- **URL**: `/api/v1/apply/job-status-update/:id` (Replace `:id` with application `_id`)
- **Type**: Private (`employer` or `admin` only)
- **Body (JSON)**:
  ```json
  {
      "status": "accepted" // Options: 'pending', 'accepted', 'rejected'
  }
  ```

---

### 4. ChatGPT Integration (`/chatgpt`)

#### Chat with the AI Assistant
- **Method**: `POST`
- **URL**: `/api/v1/chatgpt/chat`
- **Type**: Private (Any logged-in user)
- **Body (JSON)**:
  ```json
  {
      "message": "Hi, could you help me optimize my cover letter for a backend developer role?"
  }
  ```
