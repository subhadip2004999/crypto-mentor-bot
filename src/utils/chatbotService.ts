
import { toast } from "sonner";
import { getTechnicalIndicators, getTradingRecommendation } from "./cryptoData";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  isError?: boolean;
}

export interface RecommendationResult {
  type: "recommendation";
  data: any;
}

export interface ChartRequest {
  type: "chart";
  coinId: string;
}

export interface PriceRequest {
  type: "price";
  coinId?: string;
}

export type BotResponse = Message | RecommendationResult | ChartRequest | PriceRequest;

// Welcome message from the bot
export const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! How can I help you? I am an AI agent specializing in cryptocurrencies and trading.",
  timestamp: new Date(),
};

// Function to analyze user input and determine if it's crypto-related
const isCryptoRelated = (input: string): boolean => {
  const cryptoKeywords = [
    "crypto", "bitcoin", "btc", "ethereum", "eth", "blockchain", "token", "coin", 
    "wallet", "mining", "defi", "nft", "altcoin", "binance", "exchange", "trading", 
    "market", "price", "chart", "analysis", "buy", "sell", "hold", "bull", "bear", 
    "trend", "volume", "indicator", "rsi", "macd", "volatility", "leverage", "yield",
    "stake", "liquidity", "smartcontract", "dex", "cex", "hodl", "whale", "dapp",
    "gas", "gwei", "satoshi", "block", "hash", "transaction", "ledger", "fork",
    "cardano", "solana", "ripple", "xrp", "litecoin", "ltc", "dogecoin", "doge",
    "shiba", "polkadot", "dot", "chainlink", "link", "stellar", "xlm", "tron", "trx",
    "uniswap", "pancakeswap", "metamask", "cold wallet", "hot wallet", "air drop",
    "ico", "ido", "ieo", "token sale", "whitepaper", "roadmap", "stablecoin",
    "tether", "usdt", "usdc", "dai", "pump", "dump", "fomo", "fud"
  ];
  
  // Convert input to lowercase for case-insensitive matching
  const lowercaseInput = input.toLowerCase();
  
  // Check if any crypto keyword is in the input
  return cryptoKeywords.some(keyword => lowercaseInput.includes(keyword));
};

// Function to process user messages and get bot responses
export const processMessage = async (message: string): Promise<BotResponse> => {
  try {
    // Check if the message is related to crypto or trading
    if (!isCryptoRelated(message)) {
      return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm designed to help with cryptocurrency and trading only. Let me know if you need help with crypto!",
        timestamp: new Date(),
      };
    }

    // Check for specific requests
    if (message.toLowerCase().includes("price") || 
        message.toLowerCase().includes("value") ||
        message.toLowerCase().includes("worth") ||
        message.toLowerCase().includes("top") ||
        message.toLowerCase().includes("list")) {
      return {
        type: "price",
        coinId: extractCoinFromMessage(message),
      };
    }

    if (message.toLowerCase().includes("chart") || 
        message.toLowerCase().includes("graph") ||
        message.toLowerCase().includes("trend")) {
      return {
        type: "chart",
        coinId: extractCoinFromMessage(message) || "bitcoin",
      };
    }

    if (message.toLowerCase().includes("recommend") || 
        message.toLowerCase().includes("should i buy") || 
        message.toLowerCase().includes("should i sell") ||
        message.toLowerCase().includes("analysis") ||
        message.toLowerCase().includes("advice")) {
      const coinId = extractCoinFromMessage(message) || "bitcoin";
      const recommendation = await getTradingRecommendation(coinId);
      return {
        type: "recommendation",
        data: recommendation,
      };
    }

    // Handle general crypto questions
    const response = generateResponse(message);
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
  } catch (error) {
    toast.error("Failed to process your message");
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "I encountered an error. Please try again with a different crypto question.",
      timestamp: new Date(),
      isError: true,
    };
  }
};

// Extract cryptocurrency name from message
const extractCoinFromMessage = (message: string): string | undefined => {
  const cryptoMap: Record<string, string> = {
    "btc": "bitcoin",
    "eth": "ethereum",
    "bnb": "binancecoin",
    "sol": "solana",
    "ada": "cardano",
    "doge": "dogecoin",
    "xrp": "xrp",
    "dot": "polkadot",
    "link": "chainlink",
    "ltc": "litecoin",
    "avax": "avalanche",
    "matic": "polygon",
    "uni": "uniswap",
    "shib": "shiba-inu",
    "trx": "tron",
    "xlm": "stellar",
    "near": "near",
    "algo": "algorand",
    "vet": "vechain",
    "fil": "filecoin",
    "atom": "cosmos",
    "bitcoin": "bitcoin",
    "ethereum": "ethereum",
    "binance": "binancecoin",
    "solana": "solana",
    "cardano": "cardano",
    "dogecoin": "dogecoin",
    "polkadot": "polkadot",
    "chainlink": "chainlink",
    "avalanche": "avalanche",
    "polygon": "polygon",
    "uniswap": "uniswap",
    "litecoin": "litecoin",
    "stellar": "stellar",
    "cosmos": "cosmos",
    "filecoin": "filecoin",
    "algorand": "algorand",
    "vechain": "vechain",
    "shiba": "shiba-inu",
  };

  const lowercaseMessage = message.toLowerCase();
  
  for (const [symbol, id] of Object.entries(cryptoMap)) {
    if (lowercaseMessage.includes(symbol)) {
      return id;
    }
  }
  
  return undefined;
};

// Generate a response based on the user's message
const generateResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  // Define some response templates
  if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
    return "Hello! I'm your crypto trading assistant. How can I help you today?";
  }
  
  if (lowercaseMessage.includes("what is") || lowercaseMessage.includes("explain")) {
    if (lowercaseMessage.includes("bitcoin")) {
      return "Bitcoin (BTC) is the first cryptocurrency, created in 2009 by Satoshi Nakamoto. It's a decentralized digital currency that operates without central authority.";
    }
    if (lowercaseMessage.includes("ethereum")) {
      return "Ethereum (ETH) is a blockchain platform for smart contracts and dApps. It's the second-largest cryptocurrency by market cap and powers most of DeFi.";
    }
    if (lowercaseMessage.includes("blockchain")) {
      return "Blockchain is a distributed digital ledger that records transactions securely across many computers. It's the technology behind cryptocurrencies.";
    }
    if (lowercaseMessage.includes("defi")) {
      return "DeFi (Decentralized Finance) refers to financial applications built on blockchain technology without central authorities. Includes exchanges, lending platforms, and more.";
    }
    if (lowercaseMessage.includes("nft")) {
      return "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of specific items on the blockchain. Used for digital art, collectibles, music, and gaming.";
    }
  }
  
  if (lowercaseMessage.includes("investment") || lowercaseMessage.includes("invest") || lowercaseMessage.includes("portfolio")) {
    return "Crypto investment tip: Diversify across established coins (60-70%), mid-caps (20-30%), and smaller projects (5-10%). Do your research and consider dollar-cost averaging.";
  }
  
  if (lowercaseMessage.includes("scam") || lowercaseMessage.includes("security") || lowercaseMessage.includes("safe")) {
    return "Crypto security tips: Research projects thoroughly, be skeptical of guaranteed returns, use hardware wallets, enable 2FA, never share private keys, and watch for unexpected airdrops.";
  }
  
  if (lowercaseMessage.includes("bull") || lowercaseMessage.includes("bear") || lowercaseMessage.includes("market cycle")) {
    return "Crypto markets cycle through accumulation, markup (bull), distribution, and markdown (bear) phases. These cycles are more extreme in crypto due to the market's volatility.";
  }
  
  // Default response for other crypto-related queries
  return "That's an interesting question. For trading decisions, I recommend checking technical charts, sentiment indicators, and project fundamentals. Need specific details?";
};
