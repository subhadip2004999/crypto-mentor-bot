
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartData, generateChartData } from "@/utils/cryptoData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CryptoChartProps {
  coinId: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ coinId }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<"1d" | "7d" | "30d" | "90d">("7d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [coinId, period]);

  const loadChartData = () => {
    setIsLoading(true);
    // Convert period to days
    const days = period === "1d" ? 1 : period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const data = generateChartData(days);
    setChartData(data);
    setIsLoading(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (period === "1d") {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Determine color based on trend
  const isPositiveTrend = chartData.length > 1 && 
    chartData[chartData.length - 1].price > chartData[0].price;
  const chartColor = isPositiveTrend ? "#00ff88" : "#ff4976";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium capitalize">{coinId} Chart</h3>
        <Tabs defaultValue="7d" className="w-auto" value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList className="bg-crypto-darker">
            <TabsTrigger value="1d" className="text-xs">1D</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs">30D</TabsTrigger>
            <TabsTrigger value="90d" className="text-xs">90D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-64 w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-crypto-green">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColor}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                minTickGap={20}
              />
              <YAxis
                dataKey="price"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatPrice}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-crypto-darker p-3 border border-crypto-gray rounded-lg shadow-lg">
                        <p className="text-sm text-gray-400">
                          {formatDate(payload[0].payload.timestamp)}
                        </p>
                        <p className="text-lg font-medium text-white">
                          {formatPrice(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-gray-400">Open</p>
          <p className="text-white text-sm">
            {chartData.length > 0 ? formatPrice(chartData[0].price) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Current</p>
          <p className="text-white text-sm">
            {chartData.length > 0 ? formatPrice(chartData[chartData.length - 1].price) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Change</p>
          <p className={`text-sm ${isPositiveTrend ? 'text-green-400' : 'text-red-400'}`}>
            {chartData.length > 0 ? (
              ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price * 100).toFixed(2) + '%'
            ) : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;
