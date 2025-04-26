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
    const isLoginKeyValid = () => {
      const loginKey = JSON.parse(localStorage.getItem('velvet_login_key'));
      const validEmailList = ["ritvik.sharma1@velvet.com", "ritvik.sharma2@velvet.com", "ritvik.sharma3@velvet.com", "ritvik.sharma4@velvet.com", "ritvik.sharma5@velvet.com"];
      if (loginKey) {
        if (!validEmailList.includes(loginKey.email)) {
          return false
        }
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - loginKey.timestamp;
        const fiveMinutes = 5 * 60 * 1000;

        if (timeElapsed < fiveMinutes) {
          return true;
        } else {
          localStorage.removeItem('velvet_login_key');
          return false;
        }
      }
      return false;
    };

    return isLoginKeyValid();
  }
  return false;
}

/**
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