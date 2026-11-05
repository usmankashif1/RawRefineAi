import type { LoginErrors, LoginPayload } from './auth.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = ({ email, password }: LoginPayload): LoginErrors => {
    const errors: LoginErrors = {};

    if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Enter a valid email';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';

    return errors;
};
