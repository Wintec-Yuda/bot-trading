import axiosInstance from "@/lib/axios/axios";

const marketService = {
  getAllSymbol: async (category) => {
    try {
      const response = await axiosInstance.get(`/v5/market/instruments-info?category=${category}`);
      const data = await response.json();
      const symbolsData = data.result.list.map((item) => item.symbol);
      return symbolsData;
    } catch (error) {
      console.error("Error fetching symbols:", error);
      return null;
    }
  },
  getAllKline: async (category, symbol, interval) => {
    try {
      const response = await axiosInstance.get(`/v5/market/kline?category=${category}&symbol=${symbol}&interval=${interval}`);
      const data = await response.json();
      const klineData = data.result.list;
      return klineData;
    } catch (error) {
      console.error("Error fetching kline data:", error);
      return null;
    }
  }
}

export default marketService