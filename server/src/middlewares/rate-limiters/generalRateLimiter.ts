import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 2,
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again after 1 hour.' });
      }
  });
  