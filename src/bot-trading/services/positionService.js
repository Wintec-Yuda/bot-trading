import { axiosInstanceDemo } from "@/lib/axios/axios";
import { generateSignature } from "../utils";

const formatPosition = (position) => ({
  symbol: position.symbol,
  side: position.side,
  size: position.size,
  entryPrice: position.avgPrice,           
  markPrice: position.markPrice,
  leverage: position.leverage,
  unrealizedPnl: position.unrealisedPnl,
  realizedPnl: position.cumRealisedPnl,
  marginType: position.tradeMode === 0 ? 'Cross' : 'Isolated',
  liquidationPrice: position.liqPrice,
  takeProfit: position.takeProfit,
  stopLoss: position.stopLoss,
  updateTime: position.updatedTime 
    ? new Date(Number(position.updatedTime)).toLocaleString()
    : '-'
});

const positionService = {
  getActivePositions: async (category, symbol = "BTCUSDT") => {
    try {
      const timestamp = Date.now().toString();
      const queryString = `category=${category}&symbol=${symbol}`;
      const signature = generateSignature(queryString);

      const response = await axiosInstanceDemo.get('/v5/position/list', {
        params: { 
          category,
          symbol
        },
        headers: {
          'X-BAPI-TIMESTAMP': timestamp,
          'X-BAPI-SIGN': signature
        }
      });

      // Extract positions list with null check
      const positions = response.data?.result?.list || [];
      
      // Filter out positions with zero size and format them
      return positions
        .filter(pos => Number(pos.size) > 0)
        .map(formatPosition);
        
    } catch (error) {
      throw error;
    }
  }
};

export default positionService;