const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../db');

router.post('/register', async (req, res) => {
  const { name, email, password, role, bio } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    let result;
    if (role === 'instructor') {
      result = await pool.query(
        `INSERT INTO instructor (Name, Email, PasswordHash, Bio)
         VALUES ($1,$2,$3,$4) RETURNING InstructorID, Name, Email`,
        [name, email, hashed, bio]
      );
    } else {
      result = await pool.query(
        `INSERT INTO student (Name, Email, PasswordHash)
         VALUES ($1,$2,$3) RETURNING StudentID, Name, Email`,
        [name, email, hashed]
      );
    }
    res.status(201).json({ user: result.rows[0], role });
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const table = role === 'instructor' ? 'instructor' : 'student';
    const idCol = role === 'instructor' ? 'instructorid' : 'studentid';
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE Email = $1`, [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.passwordhash);
    if (!match) return res.status(400).json({ error: 'Wrong password' });
    const token = jwt.sign(
      { id: user[idCol], role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user[idCol], name: user.name, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;