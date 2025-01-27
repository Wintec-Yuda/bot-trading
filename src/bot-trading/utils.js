import config from '@/config';
import crypto from 'crypto';

const { secretKey, apiKey } = config;

export const generateSignature = (queryString = '') => {
  const timestamp = Date.now().toString();
  const recvWindow = '5000';
  
  const stringToSign = `${timestamp}${apiKey}${recvWindow}${queryString}`;
  
  return crypto
    .createHmac('sha256', secretKey)
    .update(stringToSign)
    .digest('hex');
};