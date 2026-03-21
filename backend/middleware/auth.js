const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token)
    return res.status(401).json({ error: 'No token — please login' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const isInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor')
    return res.status(403).json({ error: 'Instructors only' });
  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ error: 'Students only' });
  next();
};

module.exports = { authenticate, isInstructor, isStudent };
