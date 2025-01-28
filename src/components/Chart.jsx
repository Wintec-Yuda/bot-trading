import marketService from "@/bot-trading/services/market";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ApexCharts from "react-apexcharts";
import { setSymbolData, setKlineData } from "@/lib/redux/slices/marketSlice";
import { setIntervalFilter, setSearch, setSymbol } from "@/lib/redux/slices/filterSlice";
import { formatInterval } from "@/lib/utils/chart";
import SymbolModal from "./SymbolModal";

const Chart = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { category, symbol, interval } = useSelector((state) => state.filter);
  const klineData = useSelector((state) => state.market.klineData);
  const symbolData = useSelector((state) => state.market.symbolData);
  const botRunning = useSelector((state) => state.account.botRunning);

  const intervals = [
    "1",
    "3",
    "5",
    "15",
    "30",
    "60",
    "120",
    "240",
    "360",
    "720",
    "D",
    "W",
    "M",
  ];

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
        interval,
      });
      dispatch(setKlineData(data));
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

  const handleIntervalChange = (item) => {
    dispatch(setIntervalFilter(item));
  };

  const chartData = useMemo(
    () => ({
      series: [
        {
          data: klineData.map((item) => ({
            x: new Date(Number(item[0])),
            y: [
              Number(item[1]),
              Number(item[2]),
              Number(item[3]),
              Number(item[4]),
            ],
          })),
        },
      ],
      options: {
        chart: {
          type: "candlestick",
          height: "100%",
          toolbar: {
            show: true,
            tools: {
              download: false,
            },
            theme: "dark",
          },
          background: "#2d3748",
        },
        title: {
          text: "Candlestick Chart",
          align: "center",
          style: {
            color: "#ffffff",
            fontSize: "16px",
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              colors: "#a0aec0",
            },
          },
        },
        yaxis: {
          show: true,
          labels: {
            style: {
              colors: "#a0aec0",
            },
          },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: "#00b894",
              downward: "#e74c3c",
            },
          },
        },
        grid: {
          borderColor: "#4a5568",
        },
        tooltip: {
          theme: "dark",
          style: {
            fontSize: "12px",
            color: "#ffffff",
          },
          x: {
            show: true,
            format: "dd MMM yyyy HH:mm",
          },
          y: {
            formatter: (value) => `Price: ${value.toFixed(2)}`,
            title: {
              formatter: (seriesName) => `${seriesName}`,
            },
          },
          marker: {
            show: true,
          },
          background: {
            enabled: true,
            color: "#1a202c",
          },
          border: {
            color: "#4a5568",
          },
        },
      },
    }),
    [klineData]
  );

  const handleSymbolChange = (e) => {
    dispatch(setSymbol(e.target.value));
    setIsModalOpen(false); // Close the modal when a symbol is selected
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <button
          className="px-3 py-1 rounded-sm text-gray-100 bg-gray-700 flex justify-center items-center gap-2"
          onClick={openModal}
          disabled={botRunning}
        >
          <div className="text-xl mb-1">&#9776;</div>
          <div className="font-semibold">{symbol}</div>
        </button>
        {/* Interval Buttons - Scrollable on Small Screens */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {intervals.map((item) => (
            <button
              key={item}
              onClick={() => handleIntervalChange(item)}
              className={`px-3 py-1 rounded-sm text-gray-100 ${
                item === interval ? "text-white" : "text-gray-500"
              }`}
              disabled={botRunning}
            >
              {formatInterval(item)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "400px" }}>
        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="candlestick"
          height="100%"
        />
      </div>

      {/* Modal for Symbol Selection */}
      <SymbolModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        symbolData={symbolData}
        currentSymbol={symbol}
        onChange={handleSymbolChange}
      />
    </div>
  );
};

export default Chart;
