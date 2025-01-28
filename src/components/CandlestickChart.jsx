"use client";

import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const CandlestickChart = ({ chartData }) => {
  return (
    <div className="w-full" style={{ height: "400px" }}>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="candlestick"
        height="100%"
      />
    </div>
  );
};

export default CandlestickChart;
