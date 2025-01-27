import marketService from "@/bot-trading/services/market";
import React, { useEffect, useState } from "react";

const MarketData = () => {
  const [klineData, setKlineData] = useState([]);

  const {category, symbol, interval} = useSelector(state => state.filter);

  const fetchKlineData = async () => {
    const klineData = await marketService.getAllKline(category, symbol, interval);
    setKlineData(klineData);
  };

  useEffect(() => {
    fetchKlineData();
  }, [category, symbol, interval]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Market Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Open</th>
              <th className="px-4 py-2 text-left">High</th>
              <th className="px-4 py-2 text-left">Low</th>
              <th className="px-4 py-2 text-left">Close</th>
              <th className="px-4 py-2 text-left">Volume</th>
            </tr>
          </thead>
          <tbody>
            {klineData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">
                  {new Date(Number(item[0])).toLocaleString()}
                </td>
                <td className="px-4 py-2">{item[1]}</td>
                <td className="px-4 py-2">{item[2]}</td>
                <td className="px-4 py-2">{item[3]}</td>
                <td className="px-4 py-2">{item[4]}</td>
                <td className="px-4 py-2">{item[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketData;
