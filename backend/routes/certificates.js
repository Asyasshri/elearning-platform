const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, isStudent } = require('../middleware/auth');

router.post('/claim/:courseId', authenticate, isStudent, async (req, res) => {
  const { courseId } = req.params;

  const total = await pool.query(
    'SELECT COUNT(*) FROM video WHERE CourseID = $1',
    [courseId]
  );

  const done = await pool.query(
    `SELECT COUNT(*) FROM video_progress vp
     JOIN enrollment e ON vp.EnrollmentID = e.EnrollmentID
     WHERE e.StudentID = $1 AND vp.IsCompleted = TRUE AND e.CourseID = $2`,
    [req.user.id, courseId]
  );

  const percentage = Math.round(
    (parseInt(done.rows[0].count) / parseInt(total.rows[0].count)) * 100
  );

  if (percentage < 100)
    return res.status(400).json({
      error: 'You are only ' + percentage + '% complete. Finish all videos first.'
    });

  const enroll = await pool.query(
    'SELECT EnrollmentID FROM enrollment WHERE StudentID = $1 AND CourseID = $2',
    [req.user.id, courseId]
  );

  try {
    const cert = await pool.query(
      'INSERT INTO certificate (EnrollmentID) VALUES ($1) RETURNING *',
      [enroll.rows[0].enrollmentid]
    );
    res.json({
      message:    'Certificate issued successfully',
      uniqueCode: cert.rows[0].uniquecode,
      issuedAt:   cert.rows[0].issuedate
    });
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Certificate already claimed' });
    res.status(500).json({ error: err.message });
  }
});

router.get('/mine', authenticate, isStudent, async (req, res) => {
  const result = await pool.query(
    `SELECT cert.*, c.Title as CourseTitle, u.Name as InstructorName
     FROM certificate cert
     JOIN enrollment e ON cert.EnrollmentID = e.EnrollmentID
     JOIN course c ON e.CourseID = c.CourseID
     JOIN instructor u ON c.InstructorID = u.InstructorID
     WHERE e.StudentID = $1`,
    [req.user.id]
  );
  res.json(result.rows);
});

module.exports = router;
