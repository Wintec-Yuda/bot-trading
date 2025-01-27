import axios from 'axios';
import config from '@/config';
import { generateSignature } from '../utils';

const {baseURL, apiKey} = config;
const timestamp = Date.now().toString();

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'X-BAPI-API-KEY': apiKey,
    'X-BAPI-SIGN': generateSignature(JSON.stringify(params), timestamp),
    'X-BAPI-TIMESTAMP': timestamp,
    'X-BAPI-RECV-WINDOW': '5000',
    'Content-Type': 'application/json'
  }
});

export default axiosInstance