/**
 * Is value numeric
 * 
 * Determine whether variable is a number
 * 
 * @param {*} str 
 */
function isNumeric(str) {
  if (['string', 'number'].indexOf(typeof str) === -1) return false;
  return (
    !isNaN(str) &&
    !isNaN(parseFloat(str))
  );
}

/**
 * Validate email format
 * 
 * @param   {String} email  The email address
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate strong password format
 * 
 * @param   {String} password
 */
function validateStrongPassword(password) {
  return /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password);
}

/**
 * Checks for empty string
 * 
 * @param   {String} input
 */
function isEmpty(input) {
  return input === '' || input === null || input === undefined;
}

/**
 * Checks if user is authenticated
 */
function isAuth() {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('key');
    return !!token;
  }
  return false; // Better default for SSR: unauthenticated
}

/**
 * Adds a query param to URLs which is captured by redirect rules
 * (when running in Netlify - otherwise it's harmless)
 * 
 * @param {String} imageUrl
 * @returns {String}
 */
function toOptimizedImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return imageUrl;
  if (!imageUrl.startsWith('/') || imageUrl.endsWith('imgcdn=true')) return imageUrl;

  return imageUrl + 
         (imageUrl.includes('?') ? '&' : '?') + 
         'imgcdn=true';
}

export {
  isNumeric,
  validateEmail,
  validateStrongPassword,
  isEmpty,
  isAuth,
  toOptimizedImage,
};