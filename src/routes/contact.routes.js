const express = require('express');
const router = express.Router();
const { create, update, getAll, getById, remove } = require('../controllers/contact.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { validateBody } = require('../middlewares/validate.middleware');

// Validation schemas
const contactSchema = {
  type: 'object',
  required: ['name', 'email', 'phone'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', minLength: 1 }
  }
};

// Routes
router.use(authenticate);

router.post('/', upload, validateBody(contactSchema), create);
router.put('/:contactId', upload, validateBody(contactSchema), update);
router.get('/', getAll);
router.get('/:contactId', getById);
router.delete('/:contactId', remove);

module.exports = router; 