const Joi = require('@hapi/joi');

const projectSchema = Joi.object().keys({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(10).required(),
  size: Joi.string().trim().min(1).required(),
});

function validateClient(client) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    logo: Joi.string().required(),
    projects: Joi.array().items(projectSchema).allow(null),
  });

  return schema.validate(client);
}

function validateClientUpdate(client) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(1),
    logo: Joi.string(),
    projects: Joi.array().items(projectSchema).allow(null),
  });

  return schema.validate(client);
}

module.exports.validateClient = validateClient;
module.exports.validateClientUpdate = validateClientUpdate;
