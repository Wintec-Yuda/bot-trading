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
      throw error;
    }
  },
  getAccountBalance: async (category) => {
    try {
      // For spot market
      if (category === 'spot') {
        const response = await axiosInstanceDemo.get('/v5/account/wallet-balance', {
          params: {
            accountType: 'UNIFIED',
            coin: 'USDT'
          }
        });
        
        const account = response.data?.result?.list?.[0];
        const coin = account?.coin?.find(c => c.coin === 'USDT');
        
        return {
          walletBalance: coin?.walletBalance || '0',
          availableBalance: coin?.availableToWithdraw || '0',
          marginBalance: '0' // Not applicable for spot
        };
      } 
      // For futures market
      else {
        const response = await axiosInstanceDemo.get('/v5/account/wallet-balance', {
          params: {
            accountType: 'UNIFIED'
          }
        });
        
        const account = response.data?.result?.list?.[0];
        
        return {
          walletBalance: account?.totalWalletBalance || '0',
          availableBalance: account?.totalAvailableBalance || '0',
          marginBalance: account?.totalMarginBalance || '0'
        };
      }
    } catch (error) {
      return {
        walletBalance: '0',
        availableBalance: '0',
        marginBalance: '0'
      };
    }
  }
}

export default accountService