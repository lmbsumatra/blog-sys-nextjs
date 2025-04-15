import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 2,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many login attempts, please try again after 15 minutes' });
  }
});
