📚 eLearning Platform

A full-stack Learning Management System (LMS) built with React, Node.js, and PostgreSQL — featuring role-based dashboards for students and instructors, video delivery, quizzes, progress tracking, and certificate generation.
📌 About
A production-ready eLearning platform with a React frontend and Node.js/Express REST API backend, backed by a PostgreSQL database with 10 relational tables. The system supports two user roles — Students and Instructors — each with their own dashboard, permissions, and workflows.

✨ Features
👨‍🎓 Student Features

🔐 Authentication — JWT-based secure signup, login, and protected routes
📖 Course Browsing & Enrollment — Discover and enroll in available courses
🎬 Video Lessons — Watch instructor-uploaded video content with a dedicated video player
📊 Progress Tracking — Track lesson completion with a visual progress bar
📝 Quizzes — Attempt per-course quizzes and view scores
🏆 Certificates — Earn and claim completion certificates with unique codes

🧑‍🏫 Instructor Features

🖥️ Instructor Dashboard — Manage all created courses from one place
➕ Course Creation — Create and manage courses with structured content
📤 Video Upload — Upload video lessons directly to the platform
❓ Quiz Builder — Create quizzes with custom questions per course
📈 Enrollment Insights — View student enrollments per course

🔧 Technical Highlights

JWT Authentication with Bearer token and Axios interceptors for secure API calls
PrivateRoute component for frontend route protection
PostgreSQL with 10 normalized tables and proper relational design
RESTful API with Express routes and middleware


🛠️ Tech Stack
LayerTechnologyFrontendReact.js, Axios, React RouterBackendNode.js, Express.jsDatabasePostgreSQLAuthJWT (JSON Web Tokens)UI ComponentsCustom components (Navbar, Sidebar, Modal, Spinner, Toast)

🗄️ Database Schema
The platform uses 10 relational tables in PostgreSQL:
TablePurposestudentStudent accounts and profilesinstructorInstructor accounts and profilescourseCourse metadata (title, description, etc.)enrollmentStudent–course enrollment recordsvideoVideo lesson metadata per coursevideo_progressPer-student video completion trackingquizQuiz definitions per coursequestionQuiz questions per quizquiz_attemptStudent quiz attempt records and scorescertificateIssued certificates with unique codes

🚀 Getting Started
Prerequisites

Node.js 16+
PostgreSQL 14+
npm or yarn

Installation
bash# 1. Clone the repository
git clone https://github.com/Asyasshri/elearning-platform.git
cd elearning-platform
Backend Setup
bashcd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret

# Run database migrations / seed
psql -U your_user -d elearning_db -f database/schema.sql

# Start the backend server (runs on port 3001)
node server.js
Frontend Setup
bashcd frontend
npm install

# Start the React development server (runs on port 3000)
npm start
Open your browser at http://localhost:3000

📂 Project Structure
elearning-platform/
├── backend/
│   ├── server.js             # Express app entry point
│   ├── routes/               # API route handlers
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── videos.js
│   │   ├── quizzes.js
│   │   └── certificates.js
│   ├── middleware/           # Auth & error middleware
│   ├── db.js                 # PostgreSQL connection
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Axios instance with JWT interceptor
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── InstructorDashboard.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── UploadVideo.jsx
│   │   │   ├── CreateQuiz.jsx
│   │   │   └── Certificates.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── VideoPlayer.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Spinner.jsx
│   │   └── App.jsx
│   └── package.json
│
└── README.md


🔮 Future Improvements

 Add payment gateway for premium courses
 Real-time notifications for enrollment and quiz results
 Discussion forum per course
 Mobile-responsive design
 Course rating and review system
 Email verification on signup
