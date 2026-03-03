/**
 * Application Constants
 * Centralized configuration values and magic strings
 */

module.exports = {
  // User Roles
  ROLES: {
    VOLUNTEER: 'user1',
    ADMIN: 'user2',
    ORGANIZATION: 'user2', // Alias for admin
  },

  // Program Types
  PROGRAM_TYPES: {
    ORGANIZATION: 'organization',
    INDIVIDUAL: 'Individual',
  },

  // HTTP Status Codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  },

  // Response Messages
  MESSAGES: {
    // Success
    LOGIN_SUCCESS: 'Login successful',
    SIGNUP_SUCCESS: 'Signup successful',
    PROGRAM_CREATED: 'Program created successfully',
    PROGRAM_UPDATED: 'Program updated successfully',
    PROGRAM_DELETED: 'Program deleted successfully',
    VOLUNTEER_ACCEPTED: 'Volunteer accepted',
    VOLUNTEER_REJECTED: 'Volunteer rejected',
    MESSAGE_SENT: 'Message sent successfully',

    // Errors
    INVALID_CREDENTIALS: 'Invalid username or password',
    USER_EXISTS: 'Username already exists',
    USER_NOT_FOUND: 'User not found',
    PROGRAM_NOT_FOUND: 'Program not found',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid or expired token',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
  },

  // Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_USERNAME_LENGTH: 50,
    MAX_NAME_LENGTH: 100,
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    UPLOAD_DIR: './uploads/',
  },
};
