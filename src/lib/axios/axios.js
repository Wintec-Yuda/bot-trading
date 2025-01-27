import axios from 'axios';
import config from '@/config';
import { generateSignature } from '@/bot-trading/utils';

const { apiKey } = config;

const axiosInstanceDemo = axios.create({
  baseURL: 'https://api-demo.bybit.com',
  headers: {
    'Content-Type': 'application/json',
    'X-BAPI-API-KEY': apiKey,
    'X-BAPI-RECV-WINDOW': '5000'
  }
});

// Add request interceptor to handle authentication
axiosInstanceDemo.interceptors.request.use((reqConfig) => {
  const timestamp = Date.now().toString();
  const { method, params = {}, data = {} } = reqConfig;
  
  // For GET requests, use params; for POST, use data
  const signString = method === 'get' 
    ? new URLSearchParams(params).toString()
    : JSON.stringify(data);

  const signature = generateSignature(signString);

  reqConfig.headers['X-BAPI-TIMESTAMP'] = timestamp;
  reqConfig.headers['X-BAPI-SIGN'] = signature;

  return reqConfig;
}, (error) => {
  return Promise.reject(error);
});

const axiosInstanceTestnet = axios.create({
  baseURL: 'https://api-testnet.bybit.com',
});

export { axiosInstanceDemo, axiosInstanceTestnet };