
import { toast } from "sonner";

// Mock crypto data
export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  marketCap: number;
  percentChange24h: number;
  image: string;
}

export interface ChartData {
  timestamp: number;
  price: number;
}

// List of top cryptocurrencies
const cryptoCurrencies: CryptoCurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    currentPrice: 63254.12,
    marketCap: 1241256789012,
    percentChange24h: 2.35,
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=022",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    currentPrice: 3058.45,
    marketCap: 368120145632,
    percentChange24h: -1.24,
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022",
  },
  {
    id: "binancecoin",
    name: "Binance Coin",
    symbol: "BNB",
    currentPrice: 605.78,
    marketCap: 93125478965,
    percentChange24h: 0.89,
    image: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=022",
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    currentPrice: 135.25,
    marketCap: 57845124789,
    percentChange24h: 5.67,
    image: "https://cryptologos.cc/logos/solana-sol-logo.png?v=022",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    currentPrice: 0.45,
    marketCap: 15689745123,
    percentChange24h: -0.32,
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png?v=022",
  },
];

// Generate random chart data
export const generateChartData = (days: number = 7): ChartData[] => {
  const data: ChartData[] = [];
  const now = Date.now();
  const oneDayMs = 86400000;
  
  // Start with a base price
  let basePrice = 100 + Math.random() * 50;
  
  // Generate data points (24 points per day)
  for (let i = 0; i < days * 24; i++) {
    // Random price fluctuation (more volatile for crypto)
    const volatility = Math.random() * 8 - 4; // -4% to +4%
    basePrice = basePrice * (1 + volatility / 100);
    
    data.push({
      timestamp: now - (days * oneDayMs) + ((i / 24) * oneDayMs),
      price: basePrice
    });
  }
  
  return data;
};

// Simulated technical indicators
export const getTechnicalIndicators = (coinId: string) => {
  // Random values for demonstration
  const rsi = Math.floor(Math.random() * 100);
  const macd = Math.random() > 0.5 ? "Bullish" : "Bearish";
  const bollingerBand = Math.random() > 0.5 ? "Upper" : Math.random() > 0.5 ? "Middle" : "Lower";
  
  return {
    rsi,
    macd,
    bollingerBand,
    recommendation: getRsiRecommendation(rsi),
  };
};

// Get recommendation based on RSI
const getRsiRecommendation = (rsi: number) => {
  if (rsi < 30) return { action: "Buy", reasoning: "RSI shows oversold conditions" };
  if (rsi > 70) return { action: "Sell", reasoning: "RSI shows overbought conditions" };
  return { action: "Hold", reasoning: "RSI shows neutral market conditions" };
};

// Simulate fetching cryptocurrency data
export const fetchCryptoData = (): Promise<CryptoCurrency[]> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Add small random price changes to simulate live updates
      const updatedData = cryptoCurrencies.map(crypto => ({
        ...crypto,
        currentPrice: crypto.currentPrice * (1 + (Math.random() * 0.02 - 0.01)),
        percentChange24h: crypto.percentChange24h + (Math.random() * 0.5 - 0.25)
      }));
      resolve(updatedData);
    }, 500);
  });
};

// Simulate a trading recommendation
export const getTradingRecommendation = (coinId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const coin = cryptoCurrencies.find(c => c.id === coinId);
        if (!coin) {
          throw new Error("Cryptocurrency not found");
        }
        
        // Generate a random recommendation
        const random = Math.random();
        const recommendation = {
          coin: coin.name,
          action: random > 0.6 ? "Buy" : random > 0.3 ? "Hold" : "Sell",
          confidence: Math.floor(Math.random() * 30 + 70), // 70-99%
          reasoning: [],
          riskLevel: random > 0.7 ? "Low" : random > 0.4 ? "Medium" : "High",
          targetPrice: coin.currentPrice * (1 + (Math.random() * 0.2 - 0.05)),
          stopLoss: coin.currentPrice * (1 - (Math.random() * 0.1)),
        };
        
        // Add reasoning
        if (recommendation.action === "Buy") {
          recommendation.reasoning = [
            "Positive market sentiment",
            "Strong technical indicators",
            "Bullish trend formation",
            "Increasing trading volume"
          ].sort(() => Math.random() - 0.5).slice(0, 2);
        } else if (recommendation.action === "Sell") {
          recommendation.reasoning = [
            "Overbought conditions",
            "Bearish divergence detected",
            "Resistance level reached",
            "Decreasing market interest"
          ].sort(() => Math.random() - 0.5).slice(0, 2);
        } else {
          recommendation.reasoning = [
            "Market in consolidation phase",
            "Mixed technical signals",
            "Waiting for clearer direction",
            "Neutral trading volume"
          ].sort(() => Math.random() - 0.5).slice(0, 2);
        }
        
        resolve(recommendation);
      } catch (error) {
        reject(error);
        toast.error("Failed to generate recommendation");
      }
    }, 1000);
  });
};

export { cryptoCurrencies };
