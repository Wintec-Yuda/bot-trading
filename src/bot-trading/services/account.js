import axiosInstance from "@/lib/axios/axios"

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

    try {
      const response = await axiosInstance.post('/v5/account/demo-apply-money', params);
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
    try {
      const response = await axiosInstance.get('/v5/account/wallet-balance', params);
      
      const account = response.data?.result?.list?.[0];
      return {
        walletBalance: account?.totalWalletBalance || '0',
        marginBalance: account?.totalMarginBalance || '0',
        availableBalance: account?.totalAvailableBalance || '0'
      };
    } catch (error) {
      console.error('Error getting balance:', error?.response?.data || error);
      return null;
    }
  }
}

export default accountService