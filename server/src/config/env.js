import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

const required = ['JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  collegeEmailDomain: process.env.COLLEGE_EMAIL_DOMAIN || 'college.edu',
  smtpHost: process.env.SMTP_HOST || ''
};
