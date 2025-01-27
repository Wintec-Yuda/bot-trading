'use client'

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import positionService from '@/bot-trading/services/positionService';

const Position = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category, symbol } = useSelector(state => state.filter);
  const { botRunning } = useSelector(state => state.account);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const activePositions = await positionService.getActivePositions(category, symbol);
      setPositions(activePositions);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPositions();
    // Only start polling when bot is running
    let interval;
    if (botRunning) {
      interval = setInterval(fetchPositions, 10000); // Refresh every 10s
    }
    return () => clearInterval(interval);
  }, [category, symbol, botRunning]);

  if (loading && positions.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Active Positions</h2>
        <div className="text-center py-4">Loading positions...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Positions</h2>
        <div className="text-sm text-gray-500">
          <span>{category.toUpperCase()} - {symbol}</span>
        </div>
      </div>
      
      {positions.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No active positions</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Symbol</th>
                <th className="px-4 py-2 text-left">Side</th>
                <th className="px-4 py-2 text-right">Size</th>
                <th className="px-4 py-2 text-right">Entry Price</th>
                <th className="px-4 py-2 text-right">Mark Price</th>
                <th className="px-4 py-2 text-right">Margin</th>
                <th className="px-4 py-2 text-right">PnL</th>
                <th className="px-4 py-2 text-right">TP/SL</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, index) => (
                <tr key={`${position.symbol}-${index}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{position.symbol}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      position.side === 'Buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {position.side}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono">{position.size}</td>
                  <td className="px-4 py-2 text-right font-mono">
                    {Number(position.entryPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {Number(position.markPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {position.marginType}
                    <span className="ml-1 text-sm text-gray-500">
                      ({position.leverage}x)
                    </span>
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${
                    Number(position.unrealizedPnl) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {Number(position.unrealizedPnl).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right font-mono">
                    {position.takeProfit ? `TP: ${position.takeProfit}` : ''}
                    {position.takeProfit && position.stopLoss ? ' / ' : ''}
                    {position.stopLoss ? `SL: ${position.stopLoss}` : ''}
                    {!position.takeProfit && !position.stopLoss && '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Position;