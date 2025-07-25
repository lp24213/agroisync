import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ids, vs_currencies } = req.query;

  if (!ids || !vs_currencies) {
    return res
      .status(400)
      .json({ error: 'Missing required query parameters: ids and vs_currencies' });
  }

  try {
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: Array.isArray(ids) ? ids.join(',') : ids,
        vs_currencies: Array.isArray(vs_currencies) ? vs_currencies.join(',') : vs_currencies,
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch price data' });
  }
}
