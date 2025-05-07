const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const createHttpError = require('http-errors');

const ajv = new Ajv();
addFormats(ajv);

function validateBody(schema) {
  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      return next(createHttpError(400, 'Validation error', { errors: validate.errors }));
    }
    next();
  };
}

module.exports = { validateBody }; 