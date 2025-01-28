'use client'

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import positionService from '@/bot-trading/services/positionService';
import { setPositionData } from '@/lib/redux/slices/tradeSlice';
import { toast } from "react-toastify";

const Position = () => {
  const [loading, setLoading] = useState(false);

  const positionData = useSelector(state => state.trade.positionData);
  const { category, symbol } = useSelector(state => state.filter);
  const { botRunning } = useSelector(state => state.account);

  const dispatch = useDispatch();

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const activePositions = await positionService.getActivePositions(category, symbol);
      
      dispatch(setPositionData(activePositions));
    } catch (error) {
      toast.error('Failed to fetch positions');
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

  if (loading && positionData.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Active Positions</h2>
        <div className="text-center py-4">Loading positions...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Positions</h2>
        <div className="text-sm text-gray-400">
          <span>{category.toUpperCase()} - {symbol}</span>
        </div>
      </div>
      
      {positionData.length === 0 ? (
        <div className="text-center py-4 text-gray-400">No active positions</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-gray-300">Symbol</th>
                <th className="px-4 py-2 text-left text-gray-300">Side</th>
                <th className="px-4 py-2 text-right text-gray-300">Size</th>
                <th className="px-4 py-2 text-right text-gray-300">Entry Price</th>
                <th className="px-4 py-2 text-right text-gray-300">Mark Price</th>
                <th className="px-4 py-2 text-right text-gray-300">Margin</th>
                <th className="px-4 py-2 text-right text-gray-300">PnL</th>
                <th className="px-4 py-2 text-right text-gray-300">TP/SL</th>
              </tr>
            </thead>
            <tbody>
              {positionData.map((position, index) => (
                <tr key={`${position.symbol}-${index}`} className="border-b border-gray-600 hover:bg-gray-700">
                  <td className="px-4 py-2 font-medium">{position.symbol}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      position.side === 'Buy' 
                        ? 'bg-green-800 text-green-100' 
                        : 'bg-red-800 text-red-100'
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
                    <span className="ml-1 text-sm text-gray-400">
                      ({position.leverage}x)
                    </span>
                  </td>
                  <td className={`px-4 py-2 text-right font-mono ${
                    Number(position.unrealizedPnl) >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
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
