'use client'

import marketService from "@/bot-trading/services/market";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ApexCharts from "react-apexcharts";
import { setSymbolData, setKlineData } from "@/lib/redux/slices/marketSlice";
import { setSymbol } from "@/lib/redux/slices/filterSlice";

const SymbolDropdown = ({ symbolData, currentSymbol, onChange }) => {
  return (
    <div>
      <select
        className="w-full p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-600"
        value={currentSymbol}
        onChange={onChange}
      >
        {symbolData.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
};

const Chart = () => {
  const [klineData, setKlineData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { category, symbol, interval } = useSelector((state) => state.filter);
  const symbolData = useSelector((state) => state.market.symbolData);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const data = await marketService.getAllSymbol(category);
        dispatch(setSymbolData(data));
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
    };

    fetchSymbols();
  }, [category, dispatch]);

  const fetchKlineData = async () => {
    setLoading(true);
    try {
      const data = await marketService.getAllKline({
        category,
        symbol,
        interval
      });
      setKlineData(data || []);
      if (data.length > 0) {
        setCurrentPrice(Number(data[data.length - 1][4]));
      }
    } catch (error) {
      console.error("Error fetching kline data:", error);
      setKlineData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKlineData();
    const intervalId = setInterval(fetchKlineData, 10000);
    return () => clearInterval(intervalId);
  }, [category, symbol, interval]);

  const chartData = useMemo(() => ({
    series: [{
      data: klineData.map(item => ({
        x: new Date(Number(item[0])), 
        y: [Number(item[1]), Number(item[2]), Number(item[3]), Number(item[4])]
      }))
    }],
    options: {
      chart: {
        type: 'candlestick',
        height: '100%',
        toolbar: {
          show: true,
          tools: {
            download: false
          },
          theme: "dark"
        },
        background: "#2d3748",
      },
      title: {
        text: 'Candlestick Chart',
        align: 'center',
        style: {
          color: '#ffffff',
          fontSize: '16px'
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#a0aec0'
          }
        }
      },
      yaxis: {
        show: true,
        labels: {
          style: {
            colors: '#a0aec0'
          }
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#00b894',
            downward: '#e74c3c'
          }
        }
      },
      annotations: {
        yaxis: currentPrice !== null ? [{
          y: currentPrice,
          borderColor: '#FF4560',
          label: {
            text: `${currentPrice.toFixed(2)}`,
            borderColor: '#FF4560',
            style: {
              color: '#fff',
              background: '#FF4560',
            },
          }
        }] : []
      },
      grid: {
        borderColor: '#4a5568',
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
          color: '#ffffff'
        },
        x: {
          show: true,
          format: 'dd MMM yyyy HH:mm'
        },
        y: {
          formatter: (value) => `Price: ${value.toFixed(2)}`,
          title: {
            formatter: (seriesName) => `${seriesName}`
          }
        },
        marker: {
          show: true
        },
        background: {
          enabled: true,
          color: '#1a202c',
        },
        border: {
          color: '#4a5568'
        }
      }
    }
  }), [klineData, currentPrice]);

  const handleSymbolChange = (e) => {
    dispatch(setSymbol(e.target.value));
  };

  if (loading && klineData.length === 0) {
    return (
      <div className="p-4 rounded-lg shadow bg-gray-800 text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Chart Data</h2>
        <div className="text-center py-4">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg shadow bg-gray-800 text-gray-100">
      <div className="flex justify-between items-center mb-4">
        <SymbolDropdown
          symbolData={symbolData}
          currentSymbol={symbol}
          onChange={handleSymbolChange}
        />
        <span className="text-sm text-gray-400">
          {symbol} - {interval}min
        </span>
      </div>
      <div className="w-full" style={{ height: '400px' }}>
        <ApexCharts options={chartData.options} series={chartData.series} type="candlestick" height="100%" />
      </div>
    </div>
  );
};

export default Chart;
