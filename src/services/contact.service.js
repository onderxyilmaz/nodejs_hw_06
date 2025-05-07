const Contact = require('../models/contact.model');
const createHttpError = require('http-errors');
const cloudinaryService = require('./cloudinary.service');
const fs = require('fs').promises;

const createContact = async (contactData, userId, photo) => {
  try {
    let photoUrl = null;
    let photoPublicId = null;

    if (photo) {
      const result = await cloudinaryService.uploadImage(photo.path);
      photoUrl = result.url;
      photoPublicId = result.public_id;
      
      // Geçici dosyayı sil
      await fs.unlink(photo.path);
    }

    const contact = new Contact({
      ...contactData,
      userId,
      photo: photoUrl,
      photoPublicId
    });

    await contact.save();
    return contact;
  } catch (error) {
    if (photo) {
      try {
        await fs.unlink(photo.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
    throw error;
  }
};

const updateContact = async (contactId, userId, updateData, photo) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  try {
    if (photo) {
      // Eski fotoğrafı Cloudinary'den sil
      if (contact.photoPublicId) {
        await cloudinaryService.deleteImage(contact.photoPublicId);
      }

      // Yeni fotoğrafı yükle
      const result = await cloudinaryService.uploadImage(photo.path);
      updateData.photo = result.url;
      updateData.photoPublicId = result.public_id;

      // Geçici dosyayı sil
      await fs.unlink(photo.path);
    }

    Object.assign(contact, updateData);
    await contact.save();
    return contact;
  } catch (error) {
    if (photo) {
      try {
        await fs.unlink(photo.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
    throw error;
  }
};

const getContacts = async (userId) => {
  return Contact.find({ userId });
};

const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // Fotoğrafı Cloudinary'den sil
  if (contact.photoPublicId) {
    await cloudinaryService.deleteImage(contact.photoPublicId);
  }

  await contact.deleteOne();
};

module.exports = {
  createContact,
  updateContact,
  getContacts,
  getContactById,
  deleteContact
}; 