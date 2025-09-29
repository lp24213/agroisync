import { useEffect, useState } from 'react';

export default function useCoinChart(coinId = 'bitcoin', days = 1) {
  const [data, setData] = useState({ points: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        );
        if (!res.ok) throw new Error('Erro ao buscar dados do CoinGecko');

        const json = await res.json();
        const points = json.prices.map(([timestamp, price]) => ({
          x: new Date(timestamp),
          y: price
        }));

        if (mounted) {
          setData({ points, loading: false, error: null });
        }
      } catch (e) {
        if (mounted) {
          setData({ points: [], loading: false, error: e.message });
        }
      }
    }

    fetchData();

    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchData, 1000 * 60 * 5);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [coinId, days]);

  return data;
}
