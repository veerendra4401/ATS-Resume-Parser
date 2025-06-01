# ATS Resume Parser & Job Portal

A modern Applicant Tracking System with resume parsing capabilities and job portal functionality.

## Features

- Resume parsing with skill extraction using Stanford NLP
- Job posting and application management
- Employer dashboard
- Candidate skill matching with job requirements
- User authentication and authorization
- RESTful API integration

## Tech Stack

### Backend
- Spring Boot 3.1.x
- Java 17
- Stanford NLP
- MySQL 8.0
- Spring Security
- Spring Data JPA

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- Axios
- React Router

## Project Structure

```
resume/
├── backend/           # Spring Boot application
└── frontend/         # React application
```

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0
- Maven

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   mvn install
   ```

3. Configure MySQL database in `application.properties`

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available at `http://localhost:8080/swagger-ui.html` when running the backend server.

## License

MIT License 