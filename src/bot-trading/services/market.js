import { axiosInstanceTestnet } from "@/lib/axios/axios";

const marketService = {
  getAllSymbol: async (category = 'spot') => {
    try {
      const response = await axiosInstanceTestnet.get(`/v5/market/instruments-info?category=${category}`);
      
      const symbolsData = response.data.result.list.map((item) => item.symbol);
      return symbolsData;
    } catch (error) {
      console.error("Error fetching symbols:", error);
      return null;
    }
  },
  getAllKline: async (category = 'spot', symbol = 'BTCUSDT', interval = '1') => {
    try {
      const response = await axiosInstanceTestnet.get(`/v5/market/kline?category=${category}&symbol=${symbol}&interval=${interval}`);

      const klineData = response.data.result.list;
      return klineData;
    } catch (error) {
      console.error("Error fetching kline data:", error);
      return null;
    }
  }
}

export default marketService