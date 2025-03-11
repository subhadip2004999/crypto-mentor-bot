
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCryptoData, CryptoCurrency } from "@/utils/cryptoData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CryptoPriceTracker = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    loadCryptoData();
    // Refresh data every 20 seconds
    const interval = setInterval(() => {
      refreshData(false);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const loadCryptoData = async () => {
    try {
      const data = await fetchCryptoData();
      setCryptos(data);
    } catch (error) {
      toast.error("Failed to load cryptocurrency data");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (showToast = true) => {
    setRefreshing(true);
    try {
      const data = await fetchCryptoData();
      setCryptos(data);
      if (showToast) {
        toast.success("Prices updated");
      }
    } catch (error) {
      if (showToast) {
        toast.error("Failed to refresh data");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatMarketCap = (value: number): string => {
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    return `$${(value / 1_000).toFixed(2)}K`;
  };

  const totalPages = Math.ceil(cryptos.length / itemsPerPage);
  const displayedCryptos = cryptos.slice(
    page * itemsPerPage,
    (page + 1) * itemsPerPage
  );

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  if (loading) {
    return (
      <Card className="bg-crypto-gray/90 border-crypto-gray backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            <span>Live Cryptocurrency Prices</span>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-crypto-gray/30">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-crypto-gray/90 border-crypto-gray backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <div className="flex items-center">
            <span>Live Cryptocurrency Prices</span>
            <span className="text-xs ml-2 text-gray-400">
              Page {page + 1}/{totalPages}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:text-crypto-green"
              onClick={prevPage}
              disabled={page === 0}
            >
              &lt;
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white hover:text-crypto-green"
              onClick={nextPage}
              disabled={page === totalPages - 1}
            >
              &gt;
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-crypto-green"
              onClick={() => refreshData()}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayedCryptos.map((crypto) => (
          <div key={crypto.id} className="flex items-center justify-between py-3 border-b border-crypto-gray/30">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
              </div>
              <div>
                <div className="font-medium text-white">{crypto.name}</div>
                <div className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-white">{formatCurrency(crypto.currentPrice)}</div>
              <div
                className={`text-xs flex items-center justify-end ${
                  crypto.percentChange24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {crypto.percentChange24h >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(crypto.percentChange24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CryptoPriceTracker;
