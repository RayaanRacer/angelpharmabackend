/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (default 200)
 * @param {Object} data - The data to send in the response
 * @param {String} message - Optional success message (default: 'Success')
 */
export const sendSuccessResponse = (
  res,
  statusCode = 200,
  data = {},
  message = "Success"
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code (default 500)
 * @param {String} error - Error message (default: 'An error occurred')
 */
export const sendErrorResponse = (
  res,
  statusCode = 500,
  error = "An error occurred"
) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};
