const Joi = require('@hapi/joi');

const AdminValidations = {
  validateCreate(admin) {
    const schema = Joi.object({
      firstName: Joi.string().alphanum().min(1).required(),
      lastName: Joi.string().alphanum().min(1).required(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(admin);
  },

  validateUpdate(admin) {
    const schema = Joi.object({
      firstName: Joi.string().alphanum().min(1),
      lastName: Joi.string().alphanum().min(1),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().min(5).max(255),
    });

    return schema.validate(admin);
  },

  validateMakeSuper(admin) {
    const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    });

    return schema.validate(admin);
  },

  validateLogin(admin) {
    const schema = Joi.object({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: Joi.string().min(5).max(255).required(),
    });

    return schema.validate(admin);
  },
};


module.exports = AdminValidations;
