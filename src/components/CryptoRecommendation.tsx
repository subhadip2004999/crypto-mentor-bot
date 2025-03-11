
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, Check, BarChart, Activity } from "lucide-react";

interface CryptoRecommendationProps {
  recommendation: {
    coin: string;
    action: string;
    confidence: number;
    reasoning: string[];
    riskLevel: string;
    targetPrice: number;
    stopLoss: number;
  };
}

const CryptoRecommendation: React.FC<CryptoRecommendationProps> = ({ recommendation }) => {
  const { coin, action, confidence, reasoning, riskLevel, targetPrice, stopLoss } = recommendation;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const getActionColor = () => {
    switch (action) {
      case "Buy":
        return "bg-green-500/20 text-green-500 border-green-500/40";
      case "Sell":
        return "bg-red-500/20 text-red-500 border-red-500/40";
      default:
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/40";
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-500/20 text-green-500";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-500";
      case "High":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case "Buy":
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case "Sell":
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Card className="bg-crypto-gray border-crypto-gray overflow-hidden">
      <div className={`h-1 ${action === "Buy" ? "bg-green-500" : action === "Sell" ? "bg-red-500" : "bg-yellow-500"}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <span className="flex items-center gap-2">
            {getActionIcon()}
            Trading Recommendation
          </span>
          <Badge variant="outline" className={getRiskColor()}>
            {riskLevel} Risk
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Asset</p>
              <p className="text-lg font-medium text-white">{coin}</p>
            </div>
            <Badge variant="outline" className={getActionColor()}>
              {action}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-crypto-darker p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <BarChart className="h-4 w-4" />
                Target Price
              </div>
              <p className="text-white font-medium">{formatCurrency(targetPrice)}</p>
            </div>
            <div className="bg-crypto-darker p-3 rounded-lg">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                <Activity className="h-4 w-4" />
                Stop Loss
              </div>
              <p className="text-white font-medium">{formatCurrency(stopLoss)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Analysis</p>
            <ul className="space-y-2">
              {reasoning.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-white">
                  <Check className="h-4 w-4 mt-0.5 text-crypto-green" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <div className="w-full bg-crypto-darker rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  confidence > 80
                    ? "bg-green-500"
                    : confidence > 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-right">
              Confidence: {confidence}%
            </p>
          </div>

          <div className="text-xs text-gray-400 border-t border-crypto-gray/30 pt-3">
            This is an AI-generated trading recommendation based on technical analysis. 
            Always do your own research before making investment decisions.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoRecommendation;
