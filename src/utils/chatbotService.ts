
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
        content: "I'm designed to provide insights on cryptocurrency and trading only. Let me know if you need help with anything related to the crypto market!",
        timestamp: new Date(),
      };
    }

    // Check for specific requests
    if (message.toLowerCase().includes("price") || 
        message.toLowerCase().includes("value") ||
        message.toLowerCase().includes("worth")) {
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
      content: "I apologize, but I encountered an error processing your request. Please try again with a different question about cryptocurrencies or trading.",
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
    "bitcoin": "bitcoin",
    "ethereum": "ethereum",
    "binance": "binancecoin",
    "solana": "solana",
    "cardano": "cardano",
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
      return "Bitcoin (BTC) is the first and most valuable cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It's a decentralized digital currency that operates without a central authority or bank, using a peer-to-peer network to verify transactions through cryptography.";
    }
    if (lowercaseMessage.includes("ethereum")) {
      return "Ethereum (ETH) is a decentralized blockchain platform that enables the creation of smart contracts and decentralized applications (dApps). Created by Vitalik Buterin, it's the second-largest cryptocurrency by market capitalization and has become the foundation for much of the DeFi (Decentralized Finance) ecosystem.";
    }
    if (lowercaseMessage.includes("blockchain")) {
      return "Blockchain is a distributed digital ledger technology that records transactions across many computers in a way that ensures security, transparency, and immutability. Each 'block' contains a list of transactions, and once completed, it's linked to the previous block, forming a 'chain'. This technology underpins all cryptocurrencies.";
    }
    if (lowercaseMessage.includes("defi")) {
      return "DeFi (Decentralized Finance) refers to financial applications built on blockchain technology that aim to recreate and improve upon traditional financial systems without central authorities. This includes decentralized exchanges, lending platforms, insurance, and more, primarily built on the Ethereum blockchain.";
    }
    if (lowercaseMessage.includes("nft")) {
      return "NFTs (Non-Fungible Tokens) are unique digital assets that represent ownership of a specific item or piece of content on the blockchain. Unlike cryptocurrencies such as Bitcoin where each unit is identical, each NFT has unique properties and cannot be exchanged on a like-for-like basis. They're commonly used for digital art, collectibles, music, and gaming items.";
    }
  }
  
  if (lowercaseMessage.includes("investment") || lowercaseMessage.includes("invest") || lowercaseMessage.includes("portfolio")) {
    return "When investing in cryptocurrencies, diversification is key. Consider allocating your portfolio across established cryptocurrencies like Bitcoin and Ethereum (60-70%), mid-cap altcoins (20-30%), and smaller, more speculative projects (5-10%). Always do your own research, invest only what you can afford to lose, and consider dollar-cost averaging to manage volatility.";
  }
  
  if (lowercaseMessage.includes("scam") || lowercaseMessage.includes("security") || lowercaseMessage.includes("safe")) {
    return "To protect yourself from crypto scams: 1) Research projects thoroughly before investing, 2) Be wary of promises of guaranteed returns or pressure to invest quickly, 3) Use hardware wallets for long-term storage, 4) Enable two-factor authentication on all exchanges, 5) Never share your private keys or seed phrases, and 6) Be skeptical of unexpected token airdrops or messages asking for your crypto.";
  }
  
  if (lowercaseMessage.includes("bull") || lowercaseMessage.includes("bear") || lowercaseMessage.includes("market cycle")) {
    return "Cryptocurrency markets typically cycle through accumulation (early bull), markup (bull market), distribution (early bear), and markdown (bear market) phases. Bull markets are characterized by optimism and rising prices, while bear markets feature pessimism and falling prices. These cycles are often more extreme in crypto compared to traditional markets due to the industry's relative immaturity and volatility.";
  }
  
  // Default response for other crypto-related queries
  return "That's an interesting question about the crypto market. While I don't have specific data on that particular topic right now, I recommend consulting technical charts, market sentiment indicators, and fundamental analysis of the project's development when making trading decisions. Would you like me to explain any specific crypto concept or trading strategy in more detail?";
};
