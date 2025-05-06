const jwt = require('jsonwebtoken');
const createHttpError = require('create-http-error');
const User = require('../models/user.model');
const Session = require('../models/session.model');

const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if session exists and is valid
    const session = await Session.findOne({
      userId: decoded.userId,
      accessToken: token,
      accessTokenValidUntil: { $gt: new Date() }
    });

    if (!session) {
      throw createHttpError(401, 'Access token expired');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createHttpError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(createHttpError(401, 'Access token expired'));
    } else {
      next(error);
    }
  }
};

module.exports = authenticate; 