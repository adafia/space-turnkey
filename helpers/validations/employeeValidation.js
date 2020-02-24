const Joi = require('@hapi/joi');

function validateEmployee(employee) {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(1).required(),
    lastName: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    department: Joi.string().min(2).required(),
    designation: Joi.string().min(2).required(),
    avatar: Joi.string(),
  });

  return schema.validate(employee);
}

module.exports = validateEmployee;
