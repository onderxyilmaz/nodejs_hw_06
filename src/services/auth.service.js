const User = require('../models/user.model');
const Session = require('../models/session.model');
const jwt = require('jsonwebtoken');
const createHttpError = require('create-http-error');

const registerUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Delete existing sessions for this user
  await Session.deleteMany({ userId: user._id });

  // Create tokens
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  // Calculate token expiration dates
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Create new session
  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil
  });

  await session.save();

  return {
    user,
    accessToken,
    refreshToken
  };
};

const refreshSession = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find session
    const session = await Session.findOne({
      userId: decoded.userId,
      refreshToken,
      refreshTokenValidUntil: { $gt: new Date() }
    });

    if (!session) {
      throw createHttpError(401, 'Invalid refresh token');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Delete old session
    await Session.deleteOne({ _id: session._id });

    // Create new tokens
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    // Calculate new token expiration dates
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Create new session
    const newSession = new Session({
      userId: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil
    });

    await newSession.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw createHttpError(401, 'Invalid refresh token');
    }
    throw error;
  }
};

const logoutUser = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Delete session
    await Session.deleteOne({
      userId: decoded.userId,
      refreshToken
    });
  } catch (error) {
    // Even if token is invalid, we still want to clear the cookie
    console.error('Logout error:', error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser
}; 