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
    const params = {
      category,
      symbol,
      side,
      orderType: "Market",
      qty: quantity.toString(),
      marketUnit: "quoteCoin",
      timeInForce: "GoodTillCancel",
      takeProfit: takeProfit.toString(),
      stopLoss: stopLoss.toString(),
    };

    const signature = generateSignature(JSON.stringify(params));

    try {
      const response = await axiosInstanceDemo.post("/v5/order/create", {
        headers: {
          "X-BAPI-SIGN": signature,
          "X-BAPI-TIMESTAMP": timestamp,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Order placement error:", error);
      return null;
    }
  },
};

export default tradeService;
