const createHttpError = require('create-http-error');
const Contact = require('../models/contact.model');

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.json({
      status: 'success',
      data: { contacts }
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      throw createHttpError(400, 'Missing required fields');
    }

    const contact = new Contact({
      name,
      email,
      phone,
      userId: req.user._id
    });

    await contact.save();

    res.status(201).json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 