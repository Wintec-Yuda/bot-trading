import { axiosInstanceDemo } from "@/lib/axios/axios";

const marketService = {
  getAllSymbol: async (category = 'spot') => {
    try {
      const response = await axiosInstanceDemo.get('/v5/market/instruments-info', {
        params: { category }
      });
      
      const symbolsData = response.data.result.list.map((item) => item.symbol);
      return symbolsData;
    } catch (error) {
      throw error;
    }
  },

  getAllKline: async ({ category = 'spot', symbol = 'BTCUSDT', interval = '1' }) => {
    try {
      const params = {
        category,
        symbol,
        interval,
        limit: 200
      };

      const response = await axiosInstanceDemo.get('/v5/market/kline', { params });
      return response.data.result.list;
    } catch (error) {
      throw error;
    }
  }
};

export default marketService;