const _ = require('lodash');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const {
  validateCreate, validateLogin, validateUpdate, validateMakeSuper,
} = require('../helpers/validations/adminValidation');
const { hash } = require('../helpers/hash');

const AdminController = {
  async create(req, res) {
    // Validate admin input
    const { error } = validateCreate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if admin already exist
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) return res.status(409).send({ message: `Admin with email: ${req.body.email} already exist` });

    const hashedPassword = await hash(req.body.password);

    // Save admin details
    admin = new Admin({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      isSuperAdmin: false,
    });

    try {
      await admin.save();
      const token = await admin.generateAuthToken();
      return res.status(201).header('x-auth-token', token).send({
        message: 'Admin account has been created successfully',
        admin: _.pick(admin, ['_id', 'firstName', 'lastName', 'email', 'isSuperAdmin']),
      });
    } catch (e) {
      return res.status(400).send({ message: e });
    }
  },

  async login(req, res) {
    // Validate admin input
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if admin already exist
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).send({ message: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid email or password' });

    const token = await admin.generateAuthToken();

    return res.status(200).send({ message: 'Login successful', token });
  },

  async getAdmins(req, res) {
    const admins = await Admin.find().select('-password');
    if (admins.length === 0) {
      return res.status(404).send({ message: 'You do not have any admin accounts' });
    }
    return res.status(200).send({
      message: 'All admin accounts have been fetched successfully',
      admins,
    });
  },

  async update(req, res) {
    const { error } = validateUpdate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { _id } = req.admin;

    const admin = await Admin.findById(_id);
    if (!admin) return res.status(404).send({ message: 'The admin with the given ID was not found' });

    await admin.updateOne({
      firstName: req.body.firstName ? req.body.firstName : admin.firstName,
      lastName: req.body.lastName ? req.body.lastName : admin.lastName,
      email: req.body.email ? req.body.email : admin.email,
      password: req.body.password ? await hash(req.body.password) : admin.password,
    });

    await admin.save();

    return res
      .status(200)
      .send({ message: 'Admin profile has been updated successfully' });
  },

  async makeSuper(req, res) {
    const { error } = validateMakeSuper(req.params);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const admin = await Admin.findOne({ email: req.params.email });
    if (!admin) return res.status(404).send({ message: `Admin with email: ${req.params.email} does not exist` });

    await admin.updateOne({ isSuperAdmin: true });

    await admin.save();

    return res.status(200).send({
      message: `Admin with email: ${req.params.email} has been made a super admin successfully`,
    });
  },

  async getAdmin(req, res) {
    const { _id } = req.admin;
    const admin = await Admin.findById(_id).select('-password');
    return res.status(200).send({ message: 'Your profile has been fetched successfully', admin });
  },

  async deleteAdmin(req, res) {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).send({ message: 'The Admin with the given ID was not found' });
    }
    const { _id } = req.admin;
    if (_id === req.params.id) return res.status(400).send({ message: 'You can not delete yourself' });

    await admin.deleteOne({ _id: req.params.id });

    return res.status(200).send({
      message: 'Admin profile has been deleted successfully',
      admin: _.pick(admin, ['_id', 'firstName', 'lastName', 'email', 'isSuperAdmin']),
    });
  },

  async deleteSelf(req, res) {
    const { _id } = req.admin;
    const admin = await Admin.findById(_id).select('-password');
    if (!admin) {
      return res.status(404).send({ message: 'Your Admin account was not found.' });
    }
    await admin.deleteOne({ _id });

    return res.status(200).send({
      message: 'Your admin profile has been deleted successfully',
      admin: _.pick(admin, ['_id', 'firstName', 'lastName', 'email', 'isSuperAdmin']),
    });
  },
};

module.exports = AdminController;
