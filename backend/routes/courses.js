const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, isInstructor, isStudent } = require('../middleware/auth');

router.post('/', authenticate, isInstructor, async (req, res) => {
  const { title, description, duration_months, start_date } = req.body;
  if (duration_months < 1 || duration_months > 3)
    return res.status(400).json({ error: 'Duration must be 1 to 3 months' });
  const end = new Date(start_date);
  end.setMonth(end.getMonth() + duration_months);
  const result = await pool.query(
    `INSERT INTO course (Title, Description, InstructorID, DurationMonths, StartDate, EndDate)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, req.user.id, duration_months, start_date, end]
  );
  res.status(201).json(result.rows[0]);
});

router.get('/', authenticate, async (req, res) => {
  const result = await pool.query(
    `SELECT c.*, u.Name as InstructorName FROM course c
     JOIN instructor u ON c.InstructorID = u.InstructorID
     WHERE c.IsActive = true`
  );
  res.json(result.rows);
});

router.post('/:id/enroll', authenticate, isStudent, async (req, res) => {
  const courseId = req.params.id;
  const now   = new Date();
  const month = now.getMonth() + 1;
  const year  = now.getFullYear();
  const count = await pool.query(
    `SELECT COUNT(*) FROM enrollment
     WHERE StudentID = $1 AND Month = $2 AND Year = $3`,
    [req.user.id, month, year]
  );
  if (parseInt(count.rows[0].count) >= 3)
    return res.status(400).json({ error: 'Maximum 3 course enrollments per month reached' });
  try {
    const result = await pool.query(
      `INSERT INTO enrollment (StudentID, CourseID, Month, Year)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, courseId, month, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Already enrolled in this course' });
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-courses', authenticate, isStudent, async (req, res) => {
  const result = await pool.query(
    `SELECT c.*, e.Status, e.EnrollmentID FROM enrollment e
     JOIN course c ON e.CourseID = c.CourseID
     WHERE e.StudentID = $1`,
    [req.user.id]
  );
  res.json(result.rows);
});

module.exports = router;