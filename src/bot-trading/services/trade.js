const tradeService = {
  placeOrder: async (category, symbol, side, quantity, takeProfit, stopLoss) => {
    const params = {
      category,
      symbol,
      side,
      orderType: "Market",
      qty: quantity.toString(),
      marketUnit: "quoteCoin",
      timeInForce: "GoodTillCancel",
      takeProfit: takeProfit.toString(),
      stopLoss: stopLoss.toString()
    };

    try {
      const response = await axiosInstance.post('/v5/order/create', params);
      return response.data;
    } catch (error) {
      console.error('Order placement error:', error);
      return null;
    }
  }
}

export default tradeService