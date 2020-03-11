const Joi = require('@hapi/joi');

const EmployeeValidations = {
  validateCreate(employee) {
    const schema = Joi.object({
      firstName: Joi.string().alphanum().min(1).required(),
      lastName: Joi.string().alphanum().min(1).required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      department: Joi.string()
        .trim()
        .alphanum()
        .valid('human resource', 'engineering', 'operations')
        .required(),
      designation: Joi.string().min(2).required(),
      avatar: Joi.string(),
    });

    return schema.validate(employee);
  },

  validateUpdate(employee) {
    const schema = Joi.object({
      firstName: Joi.string().alphanum().min(1),
      lastName: Joi.string().alphanum().min(1),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      department: Joi.string()
        .trim()
        .alphanum()
        .valid('human resource', 'engineering', 'operations'),
      designation: Joi.string().min(2),
      avatar: Joi.string(),
    });

    return schema.validate(employee);
  },

  validateByDep(dep) {
    const schema = Joi.object({
      department: Joi.string()
        .trim()
        .alphanum()
        .valid('human resource', 'engineering', 'operations')
        .required(),
    });

    return schema.validate(dep);
  },
};


module.exports = EmployeeValidations;
