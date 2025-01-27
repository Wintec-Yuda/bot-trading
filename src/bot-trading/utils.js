import config from '@/config';
import crypto from 'crypto';

const { secretKey, apiKey } = config;

export const generateSignature = (params = '') => {
  const stringToSign = `${Date.now().toString()}${apiKey}5000${params}`;
  return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
};