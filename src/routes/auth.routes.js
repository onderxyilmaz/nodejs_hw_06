const express = require('express');
const { validateBody } = require('../middleware/validateBody');
const { register, login, refresh, logout, sendResetEmail, resetPwd } = require('../controllers/auth.controller');

const router = express.Router();

// Validation schemas
const registerSchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  }
};

const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 }
  }
};

const resetEmailSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email' }
  }
};

const resetPasswordSchema = {
  type: 'object',
  required: ['token', 'password'],
  properties: {
    token: { type: 'string' },
    password: { type: 'string', minLength: 6 }
  }
};

// Routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPwd);

module.exports = router; 