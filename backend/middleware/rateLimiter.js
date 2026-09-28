const rateLimit = require('express-rate-limit');
const make = (max) => rateLimit({ windowMs: 60 * 1000, max, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a minute and try again.' } });
module.exports = { general: make(30), youtube: make(6) };
