const createHttpError = require('http-errors');
const { createContact, updateContact, getContacts, getContactById, deleteContact } = require('../services/contact.service');

const create = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.userId;
    const photo = req.file;

    const contact = await createContact({ name, email, phone }, userId, photo);

    res.status(201).json({
      status: 'success',
      message: 'Contact created successfully',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;
    const photo = req.file;

    const contact = await updateContact(contactId, userId, updateData, photo);

    res.status(200).json({
      status: 'success',
      message: 'Contact updated successfully',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const contacts = await getContacts(userId);

    res.status(200).json({
      status: 'success',
      message: 'Contacts retrieved successfully',
      data: { contacts }
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.userId;

    const contact = await getContactById(contactId, userId);

    res.status(200).json({
      status: 'success',
      message: 'Contact retrieved successfully',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user.userId;

    await deleteContact(contactId, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  update,
  getAll,
  getById,
  remove
}; 