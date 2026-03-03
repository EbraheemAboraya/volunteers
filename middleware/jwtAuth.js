const jwt = require('jsonwebtoken');
const { STATUS_CODES, MESSAGES } = require('../config/constants');

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches decoded user data to request
 */
const verifyToken = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
    }

    // Remove quotes if present and extract token
    const token = authHeader.replace(/"/g, '').replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_secret_key');

    // Attach user data to request
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);

    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.INVALID_TOKEN,
      error: error.message,
    });
  }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED,
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Access forbidden: Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
};
