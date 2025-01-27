import axios from 'axios';
import config from '@/config';
import { generateSignature } from '@/bot-trading/utils';

const { apiKey } = config;

const axiosInstanceDemo = axios.create({
  baseURL: 'https://api-demo.bybit.com',
  headers: {
    'X-BAPI-API-KEY': apiKey,
    "X-BAPI-TIMESTAMP": Date.now().toString(),
    'X-BAPI-RECV-WINDOW': '5000',
    'Content-Type': 'application/json'
  }
});

const axiosInstanceTestnet = axios.create({
  baseURL: 'https://api-testnet.bybit.com',
});

export { axiosInstanceDemo, axiosInstanceTestnet };
