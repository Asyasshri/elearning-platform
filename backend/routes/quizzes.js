const express = require('express');
const router  = express.Router();
const pool    = require('../db');
const { authenticate, isInstructor, isStudent } = require('../middleware/auth');

router.post('/', authenticate, isInstructor, async (req, res) => {
  const { course_id, title, week_number, quiz_date, questions } = req.body;
  const day = new Date(quiz_date).getDay();
  if (day !== 0 && day !== 6)
    return res.status(400).json({ error: 'Quizzes must be scheduled on weekends Saturday or Sunday only' });
  const quiz = await pool.query(
    `INSERT INTO quiz (CourseID, Title, Week_Number, ScheduledDate, Total_Marks)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [course_id, title, week_number, quiz_date, questions.length]
  );
  for (const q of questions) {
    await pool.query(
      `INSERT INTO question (QuizID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [quiz.rows[0].quizid, q.text, q.a, q.b, q.c, q.d, q.correct]
    );
  }
  res.status(201).json(quiz.rows[0]);
});

router.get('/course/:courseId', authenticate, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM quiz WHERE CourseID = $1 ORDER BY ScheduledDate',
    [req.params.courseId]
  );
  res.json(result.rows);
});

router.get('/:quizId', authenticate, async (req, res) => {
  const quiz = await pool.query('SELECT * FROM quiz WHERE QuizID = $1', [req.params.quizId]);
  const questions = await pool.query(
    'SELECT QuestionID, QuestionText, OptionA, OptionB, OptionC, OptionD FROM question WHERE QuizID = $1',
    [req.params.quizId]
  );
  res.json({ ...quiz.rows[0], questions: questions.rows });
});

router.post('/:quizId/submit', authenticate, isStudent, async (req, res) => {
  const { answers } = req.body;
  const questions = await pool.query(
    'SELECT * FROM question WHERE QuizID = $1', [req.params.quizId]
  );
  let score = 0;
  for (const q of questions.rows) {
    if (answers[q.questionid] === q.correctoption) score++;
  }
  await pool.query(
    `INSERT INTO quiz_attempt (StudentID, QuizID, Score, TotalQuestions)
     VALUES ($1,$2,$3,$4)`,
    [req.user.id, req.params.quizId, score, questions.rows.length]
  );
  res.json({ score, total: questions.rows.length, percentage: Math.round((score / questions.rows.length) * 100) });
});

module.exports = router;