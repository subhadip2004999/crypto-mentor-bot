
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
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    currentPrice: 0.52,
    marketCap: 28752314569,
    percentChange24h: 1.23,
    image: "https://cryptologos.cc/logos/xrp-xrp-logo.png?v=022",
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    currentPrice: 0.12,
    marketCap: 17895632145,
    percentChange24h: 3.45,
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=022",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    currentPrice: 6.78,
    marketCap: 8564123789,
    percentChange24h: -2.15,
    image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png?v=022",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    currentPrice: 32.15,
    marketCap: 11452365789,
    percentChange24h: 4.56,
    image: "https://cryptologos.cc/logos/avalanche-avax-logo.png?v=022",
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    currentPrice: 13.45,
    marketCap: 7563214589,
    percentChange24h: 2.78,
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png?v=022",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "LTC",
    currentPrice: 75.32,
    marketCap: 5632147895,
    percentChange24h: -0.98,
    image: "https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=022",
  },
  {
    id: "uniswap",
    name: "Uniswap",
    symbol: "UNI",
    currentPrice: 8.25,
    marketCap: 4123659874,
    percentChange24h: 1.52,
    image: "https://cryptologos.cc/logos/uniswap-uni-logo.png?v=022",
  },
  {
    id: "tron",
    name: "TRON",
    symbol: "TRX",
    currentPrice: 0.095,
    marketCap: 8945612357,
    percentChange24h: 0.75,
    image: "https://cryptologos.cc/logos/tron-trx-logo.png?v=022",
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    currentPrice: 0.65,
    marketCap: 6325147896,
    percentChange24h: -1.85,
    image: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=022",
  },
  {
    id: "stellar",
    name: "Stellar",
    symbol: "XLM",
    currentPrice: 0.11,
    marketCap: 3125478965,
    percentChange24h: 0.45,
    image: "https://cryptologos.cc/logos/stellar-xlm-logo.png?v=022",
  },
  {
    id: "cosmos",
    name: "Cosmos",
    symbol: "ATOM",
    currentPrice: 8.15,
    marketCap: 3245789615,
    percentChange24h: -0.65,
    image: "https://cryptologos.cc/logos/cosmos-atom-logo.png?v=022",
  },
  {
    id: "filecoin",
    name: "Filecoin",
    symbol: "FIL",
    currentPrice: 4.85,
    marketCap: 2154789632,
    percentChange24h: 1.25,
    image: "https://cryptologos.cc/logos/filecoin-fil-logo.png?v=022",
  },
  {
    id: "near",
    name: "NEAR Protocol",
    symbol: "NEAR",
    currentPrice: 3.75,
    marketCap: 3654789215,
    percentChange24h: 2.45,
    image: "https://cryptologos.cc/logos/near-protocol-near-logo.png?v=022",
  },
  {
    id: "algorand",
    name: "Algorand",
    symbol: "ALGO",
    currentPrice: 0.15,
    marketCap: 1254789632,
    percentChange24h: -0.35,
    image: "https://cryptologos.cc/logos/algorand-algo-logo.png?v=022",
  },
  {
    id: "vechain",
    name: "VeChain",
    symbol: "VET",
    currentPrice: 0.025,
    marketCap: 1854796325,
    percentChange24h: 1.05,
    image: "https://cryptologos.cc/logos/vechain-vet-logo.png?v=022",
  },
  {
    id: "shiba-inu",
    name: "Shiba Inu",
    symbol: "SHIB",
    currentPrice: 0.000019,
    marketCap: 11236547895,
    percentChange24h: 4.85,
    image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png?v=022",
  }
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
