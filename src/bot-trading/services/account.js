import { axiosInstanceDemo } from "@/lib/axios/axios"
import { generateSignature } from "../utils";

const accountService = {
  requestDemoFunds: async () => {
    const params = {
      adjustType: 0,
      utaDemoApplyMoney: [
        {
          coin: "USDT",
          amountStr: "10000"
        }
      ]
    };

    const signature = generateSignature(JSON.stringify(params));

    try {
      const response = await axiosInstanceDemo.post('/v5/account/demo-apply-money', {
        headers: {
          "X-BAPI-SIGN": signature,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting demo funds:', error);
      return null;
    }
  },
  getAccountBalance: async () => {
    const params = {
      accountType: 'UNIFIED'
    }

    console.log(params);
    
    const signature = generateSignature(JSON.stringify(params));

    try {
      const response = await axiosInstanceDemo.get('/v5/account/wallet-balance', params, {
        headers: {
          "X-BAPI-SIGN": signature,
        },
      });

      console.log(response);
      
      
      const account = response.data?.result?.list?.[0];
      return {
        walletBalance: account?.totalWalletBalance || '0',
        availableBalance: account?.totalAvailableBalance || '0'
      };
    } catch (error) {
      console.error('Error getting balance:', error?.response?.data || error);
      return null;
    }
  }
}

export default accountService