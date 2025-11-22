import * as Yup from 'yup';

// ==================== PASSWORD STRENGTH VALIDATION ====================
/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: 'Password is required' };

  let score = 0;
  const feedback = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one lowercase letter');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one uppercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one number');
  }

  if (/@$!%*?&/.test(password)) {
    score += 1;
  } else {
    feedback.push('At least one special character (@$!%*?&)');
  }

  const strength = score < 2 ? 'Weak' : score < 4 ? 'Fair' : 'Strong';

  return {
    score,
    strength,
    feedback: feedback.length > 0 ? feedback : ['Strong password'],
    isValid: score === 5,
  };
};

// ==================== VALIDATION SCHEMAS ====================
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .test('email-or-username', 'Invalid email or username', function(value) {
      if (!value) return false;
      // Accept valid email OR username (alphanumeric, underscore, hyphen)
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_-]+$/.test(value);
      return isEmail || isUsername;
    })
    .required('Username or email is required')
    .trim(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const registerValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .required('Username is required')
    .trim(),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .trim(),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

// ==================== UTILITY FUNCTIONS ====================
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.errors?.email) {
    return error.errors.email;
  }

  if (error?.errors?.password) {
    return error.errors.password;
  }

  return 'An error occurred. Please try again.';
};
