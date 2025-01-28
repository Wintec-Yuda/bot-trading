import { axiosInstanceDemo } from "@/lib/axios/axios";
import { generateSignature } from "../utils";

const tradeService = {
  placeOrder: async (
    category,
    symbol,
    side,
    quantity,
    takeProfit,
    stopLoss
  ) => {
    // Base order parameters
    const params = {
      category,
      symbol,
      side,
      orderType: "Market",
      qty: quantity.toString(),
      marketUnit: "quoteCoin",
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

    try {
      const response = await axiosInstanceDemo.post("/v5/order/create", params, {
        headers: {
          "X-BAPI-SIGN": signature,
          "X-BAPI-TIMESTAMP": timestamp,
        },
      });

      if (response.data?.retCode === 0) {
        console.log('Order placed successfully:', {
          side,
          quantity,
          takeProfit: params.takeProfit,
          stopLoss: params.stopLoss
        });
        return response.data;
      } else {
        throw new Error(response.data?.retMsg || 'Order placement failed');
      }
    } catch (error) {
      console.error("Order placement error:", error?.response?.data || error);
      throw error;
    }
  },
};

export default tradeService;