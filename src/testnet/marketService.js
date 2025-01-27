const marketServiceTestnet = {
  getKlineData: async ({category, symbol, interval}) => {
    // Gunakan WebSocket bawaan browser, tanpa perlu impor library lain
    const ws = new WebSocket(`wss://stream-testnet.bybit.com/v5/public/${category}`);

    ws.onopen = () => {
      console.log("Connected to Bybit WebSocket");

      // Subscribe ke Kline sesuai dengan interval dan simbol yang diberikan
      const subscribeMessage = JSON.stringify({
        op: "subscribe",
        args: [`kline.${interval}.${symbol}`],
      });

      ws.send(subscribeMessage);
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);

      console.log("Received WebSocket message:", response);
      

      // Cek apakah ada data Kline yang diterima
      if (response.topic && response.topic.startsWith("kline")) {
        const klineData = response.data[0];


        console.log(`Timestamp: ${klineData.timestamp}`);
        console.log(`Open: ${klineData.open}`);
        console.log(`High: ${klineData.high}`);
        console.log(`Low: ${klineData.low}`);
        console.log(`Close: ${klineData.close}`);
        console.log(`Volume: ${klineData.volume}`);
        console.log("-----------------------------------");

        // return klineData
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  },
};

export default marketServiceTestnet;
