// services/trade.js
import { axiosInstanceDemo } from "@/lib/axios/axios";
import { generateSignature } from "../utils";

const validateOrderQuantity = (qty) => {
  if (!qty || isNaN(qty) || qty <= 0) {
    throw new Error('Invalid quantity: must be a positive number');
  }
  
  // Round to 8 decimal places to meet exchange requirements
  return Number(qty).toFixed(8);
};

const tradeService = {
  placeOrder: async (category, symbol, side, quantity, takeProfit, stopLoss) => {
    try {
      // Validate and format quantity
      const validatedQty = validateOrderQuantity(quantity);
      
      // Base order parameters
      const params = {
        category,
        symbol,
        side,
        orderType: "Market",
        qty: validatedQty,
        marketUnit: category === 'spot' ? 'baseCoin' : 'quoteCoin', // Important distinction
        timeInForce: "GoodTillCancel",
      };

      // Add TP/SL if provided
      if (takeProfit) {
        params.takeProfit = takeProfit.toFixed(2);
        params.tpTriggerBy = "LastPrice";
        params.tpslMode = "Full";
      }

      if (stopLoss) {
        params.stopLoss = stopLoss.toFixed(2);
        params.slTriggerBy = "LastPrice";
        params.tpslMode = "Full";
      }

      const timestamp = Date.now().toString();
      const signature = generateSignature(JSON.stringify(params));

      const response = await axiosInstanceDemo.post("/v5/order/create", params, {
        headers: {
          "X-BAPI-SIGN": signature,
          "X-BAPI-TIMESTAMP": timestamp,
        },
      });

      if (response.data?.retCode === 0) {
        return response.data;
      } else {
        throw new Error(response.data?.retMsg || 'Order placement failed');
      }
    } catch (error) {
      throw error;
    }
  },
};

export default tradeService;