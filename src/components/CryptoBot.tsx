
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Message, WELCOME_MESSAGE, processMessage } from "@/utils/chatbotService";
import { Lightbulb, Send, Loader2, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import CryptoPriceTracker from "./CryptoPriceTracker";
import CryptoRecommendation from "./CryptoRecommendation";
import CryptoChart from "./CryptoChart";

const CryptoBot = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPriceTracker, setShowPriceTracker] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartCoin, setChartCoin] = useState("bitcoin");
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add temporary loading message
    const loadingMsgId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMsgId,
        role: "assistant",
        content: "Thinking...",
        timestamp: new Date(),
        isLoading: true,
      },
    ]);

    try {
      const response = await processMessage(userMessage.content);

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsgId));

      if ("type" in response) {
        if (response.type === "recommendation") {
          setRecommendation(response.data);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `Here's my trading recommendation for ${response.data.coin}:`,
              timestamp: new Date(),
            },
          ]);
        } else if (response.type === "chart") {
          setChartCoin(response.coinId);
          setShowChart(true);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `Here's the current chart for ${response.coinId}:`,
              timestamp: new Date(),
            },
          ]);
        } else if (response.type === "price") {
          setShowPriceTracker(true);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content: `Here are the current cryptocurrency prices:`,
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // Regular message response
        setMessages((prev) => [...prev, response]);
      }
    } catch (error) {
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsgId));
      
      toast.error("Failed to get a response");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I encountered an error processing your request. Please try again with a different question about cryptocurrencies or trading.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-crypto-darker">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-crypto-dark border-b border-crypto-gray">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-crypto-green glow-border-green">
            <AvatarImage src="/lovable-uploads/741a14b5-85e9-474e-bca4-46878f00819b.png" alt="Bot Avatar" />
            <AvatarFallback className="bg-crypto-gray text-crypto-green">CB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-white font-bold">CryptoMentor</h1>
            <p className="text-xs text-gray-400">Crypto Trading Assistant</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="text-crypto-green border-crypto-green hover:bg-crypto-green hover:text-black"
          onClick={() => setShowPriceTracker(!showPriceTracker)}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Live Prices
        </Button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden bg-crypto-dark relative crypto-pattern">
        <div className="absolute inset-0 bg-glow-green animate-pulse-glow opacity-30" />
        
        <ScrollArea className="h-full px-4 py-6 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-crypto-blue text-white ml-12"
                      : "bg-crypto-gray text-white mr-12"
                  } ${message.isError ? "border border-red-500" : ""}`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing your request...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {recommendation && (
              <div className="flex justify-start">
                <div className="max-w-[90%] mr-12">
                  <CryptoRecommendation recommendation={recommendation} />
                </div>
              </div>
            )}

            {showChart && (
              <div className="flex justify-start">
                <div className="w-full max-w-2xl mr-12 bg-crypto-gray rounded-xl p-3">
                  <CryptoChart coinId={chartCoin} />
                </div>
              </div>
            )}

            {showPriceTracker && (
              <div className="flex justify-start">
                <div className="w-full max-w-2xl mr-12">
                  <CryptoPriceTracker />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Suggestion chips */}
      <div className="bg-crypto-dark border-t border-crypto-gray p-2 flex gap-2 overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          className="text-xs whitespace-nowrap border-crypto-gray text-gray-300 hover:bg-crypto-gray"
          onClick={() => {
            setInput("What's the current price of Bitcoin?");
            setTimeout(() => {
              const form = document.getElementById("chat-form") as HTMLFormElement;
              form?.dispatchEvent(new Event("submit", { cancelable: true }));
            }, 100);
          }}
        >
          Bitcoin price?
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs whitespace-nowrap border-crypto-gray text-gray-300 hover:bg-crypto-gray"
          onClick={() => {
            setInput("Show me Ethereum chart");
            setTimeout(() => {
              const form = document.getElementById("chat-form") as HTMLFormElement;
              form?.dispatchEvent(new Event("submit", { cancelable: true }));
            }, 100);
          }}
        >
          ETH chart
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs whitespace-nowrap border-crypto-gray text-gray-300 hover:bg-crypto-gray"
          onClick={() => {
            setInput("Should I buy Solana?");
            setTimeout(() => {
              const form = document.getElementById("chat-form") as HTMLFormElement;
              form?.dispatchEvent(new Event("submit", { cancelable: true }));
            }, 100);
          }}
        >
          SOL recommendation
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs whitespace-nowrap border-crypto-gray text-gray-300 hover:bg-crypto-gray"
          onClick={() => {
            setInput("Explain DeFi");
            setTimeout(() => {
              const form = document.getElementById("chat-form") as HTMLFormElement;
              form?.dispatchEvent(new Event("submit", { cancelable: true }));
            }, 100);
          }}
        >
          What is DeFi?
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs whitespace-nowrap border-crypto-gray text-gray-300 hover:bg-crypto-gray"
          onClick={() => {
            setInput("How to avoid crypto scams?");
            setTimeout(() => {
              const form = document.getElementById("chat-form") as HTMLFormElement;
              form?.dispatchEvent(new Event("submit", { cancelable: true }));
            }, 100);
          }}
        >
          Crypto security
        </Button>
      </div>

      {/* Input area */}
      <div className="p-4 bg-crypto-dark border-t border-crypto-gray">
        <form id="chat-form" onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-center relative">
            <Lightbulb className="absolute left-3 h-5 w-5 text-crypto-green opacity-70" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crypto prices, charts, or trading advice..."
              className="flex-1 bg-crypto-darker border-crypto-gray focus-visible:ring-crypto-green pl-10"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-crypto-green hover:bg-crypto-green/80 text-black"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CryptoBot;
