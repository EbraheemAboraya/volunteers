const { STATUS_CODES } = require('../config/constants');

/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = STATUS_CODES.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {*} errors - Additional error details
 */
const sendError = (res, message = 'Error', statusCode = STATUS_CODES.INTERNAL_ERROR, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

/**
 * Send created response (201)
 * @param {Object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, STATUS_CODES.CREATED);
};

/**
 * Send not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Not found message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, STATUS_CODES.NOT_FOUND);
};

/**
 * Send unauthorized response (401)
 * @param {Object} res - Express response object
 * @param {string} message - Unauthorized message
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, message, STATUS_CODES.UNAUTHORIZED);
};

/**
 * Send validation error response (400)
 * @param {Object} res - Express response object
 * @param {*} errors - Validation errors
 */
const sendValidationError = (res, errors) => {
  return sendError(res, 'Validation failed', STATUS_CODES.BAD_REQUEST, errors);
};

module.exports = {
  sendSuccess,
  sendError,
  sendCreated,
  sendNotFound,
  sendUnauthorized,
  sendValidationError,
};
