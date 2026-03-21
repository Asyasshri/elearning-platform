const express    = require('express');
const router     = express.Router();
const pool       = require('../db');
const cloudinary = require('cloudinary').v2;
const { authenticate, isInstructor, isStudent } = require('../middleware/auth');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/upload', authenticate, isInstructor, async (req, res) => {
  const { course_id, title, week_number, upload_date, sequence_number } = req.body;
  const day = new Date(upload_date).getDay();
  if (day === 0 || day === 6)
    return res.status(400).json({ error: 'Videos can only be uploaded on weekdays Monday to Friday' });
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  if (!req.files || !req.files.video)
    return res.status(400).json({ error: 'No video file uploaded' });
  try {
    const result = await cloudinary.uploader.upload(
      req.files.video.tempFilePath,
      { resource_type: 'video', folder: `elearning/course_${course_id}` }
    );
    const video = await pool.query(
      `INSERT INTO video
       (CourseID, Title, URL, UploadDate, Week_Day, WeekNumber, SequenceNumber, Duration)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [course_id, title, result.secure_url, upload_date,
       dayNames[day], week_number, sequence_number, result.duration]
    );
    res.status(201).json(video.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:videoId/progress', authenticate, isStudent, async (req, res) => {
  const { enrollment_id, watched_sec, total_sec } = req.body;
  const videoId = req.params.videoId;
  const isCompleted = watched_sec >= total_sec * 0.95;
  const points      = isCompleted ? 50 : 0;
  try {
    const result = await pool.query(
      `INSERT INTO video_progress
       (EnrollmentID, VideoID, WatchedDuration, IsCompleted, PointsAwarded, CanSeek, CompletedAt)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (EnrollmentID, VideoID) DO UPDATE SET
         WatchedDuration = $3,
         IsCompleted  = GREATEST(video_progress.IsCompleted, $4),
         PointsAwarded = GREATEST(video_progress.PointsAwarded, $5),
         CanSeek      = GREATEST(video_progress.CanSeek, $6),
         CompletedAt  = COALESCE(video_progress.CompletedAt, $7)
       RETURNING *`,
      [enrollment_id, videoId, watched_sec, isCompleted, points, isCompleted, isCompleted ? new Date() : null]
    );
    if (isCompleted) {
      await pool.query(
        'UPDATE student SET TotalPoints = TotalPoints + 50 WHERE StudentID = $1',
        [req.user.id]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:videoId/status/:enrollmentId', authenticate, async (req, res) => {
  const result = await pool.query(
    'SELECT CanSeek, IsCompleted, PointsAwarded FROM video_progress WHERE VideoID=$1 AND EnrollmentID=$2',
    [req.params.videoId, req.params.enrollmentId]
  );
  res.json(result.rows[0] || { CanSeek: false, IsCompleted: false, PointsAwarded: 0 });
});

router.get('/course/:courseId', authenticate, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM video WHERE CourseID = $1 ORDER BY WeekNumber, SequenceNumber',
    [req.params.courseId]
  );
  res.json(result.rows);
});

module.exports = router;