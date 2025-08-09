// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.header('Authorization') || '';
    const token = header.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // decoded should contain user info when you signed the token (e.g. { id: user._id, email: ... })
    req.user = decoded;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Invalid token or token expired' });
  }
};
