import crypto from 'crypto';

export const hashPassword = (password: string, salt: string) => crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
