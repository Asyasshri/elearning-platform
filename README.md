📚 eLearning Platform

A full-featured online learning management system with course management, user authentication, quizzes, and an admin dashboard.

📌 About
A comprehensive eLearning platform that enables students to browse, enroll in, and complete online courses — while giving administrators full control over content, users, and assessments. Built with Python and MySQL, the platform supports video content delivery, quizzes, and role-based access.

✨ Features
👤 Student Features

🔐 User Authentication — Secure sign up, login, and logout
📖 Course Browsing & Enrollment — Browse available courses and enroll with one click
🎬 Video Content — Watch uploaded video lessons within the platform
📝 Quizzes & Assessments — Take quizzes after lessons and track your score
📊 Progress Tracking — View enrolled courses and completion status

🛠️ Admin Features

🖥️ Admin Dashboard — Centralized control panel for managing the platform
➕ Course Management — Create, edit, and delete courses and lessons
📤 Content Upload — Upload videos and course materials
👥 User Management — View and manage registered students
📈 Assessment Management — Create and manage quizzes per course


🛠️ Tech Stack
LayerTechnologyFrontendHTML, CSSBackendPythonDatabaseMySQLAuthSession-based authentication

🚀 Getting Started
Prerequisites

Python 3.8+
MySQL Server
pip package manager
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


👩‍💻 Author
Asyas Shri
B.Tech CSE — SRM University (2024–2028)
LinkedIn • GitHub

📄 License
This project is open source and available under the MIT License.
