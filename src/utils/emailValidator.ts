// src/utils/emailValidator.ts

/**
 * Validates an email address ensuring no uppercase letters or spaces.
 * @param email - The email address to validate.
 * @returns An object indicating if the email is valid and an optional error message.
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
    // Trim leading and trailing whitespace
    const trimmedEmail = email.trim();
  
    // Check for uppercase letters or spaces within the email
    if (/[A-Z\s]/.test(trimmedEmail)) {
      return { isValid: false, error: 'Email cannot contain spaces or uppercase letters.' };
    }
  
    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return { isValid: false, error: 'Invalid email format.' };
    }
  
    return { isValid: true, error: '' };
};