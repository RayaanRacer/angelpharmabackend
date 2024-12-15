/**
 * Validate email address
 * @param {String} email - The email to validate
 * @returns {Boolean} - Returns true if the email is valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
/**
 * Validate phone number
 * @param {String} phoneNumber - The phone number to validate
 * @returns {Boolean} - Returns true if the phone number is valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\d{10,14}$/;
  return phoneRegex.test(phoneNumber);
};
