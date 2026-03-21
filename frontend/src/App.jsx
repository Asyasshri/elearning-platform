import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseDetail from './pages/student/CourseDetail';
import VideoPlayer from './pages/student/VideoPlayer';
import QuizPage from './pages/student/QuizPage';
import Certificates from './pages/student/Certificates';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import UploadVideo from './pages/instructor/UploadVideo';
import CreateQuiz from './pages/instructor/CreateQuiz';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/course/:courseId" element={<PrivateRoute role="student"><CourseDetail /></PrivateRoute>} />
        <Route path="/student/video/:videoId/:enrollmentId" element={<PrivateRoute role="student"><VideoPlayer /></PrivateRoute>} />
        <Route path="/student/quiz/:quizId" element={<PrivateRoute role="student"><QuizPage /></PrivateRoute>} />
        <Route path="/student/certificates" element={<PrivateRoute role="student"><Certificates /></PrivateRoute>} />
        <Route path="/instructor" element={<PrivateRoute role="instructor"><InstructorDashboard /></PrivateRoute>} />
        <Route path="/instructor/upload/:courseId" element={<PrivateRoute role="instructor"><UploadVideo /></PrivateRoute>} />
        <Route path="/instructor/quiz/:courseId" element={<PrivateRoute role="instructor"><CreateQuiz /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}