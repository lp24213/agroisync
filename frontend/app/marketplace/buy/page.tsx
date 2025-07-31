import dynamic from 'next/dynamic';

const MarketplaceBuyPage = dynamic(() => import('./MarketplaceBuyPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// Disable SSR for this page
export const revalidate = 0;

export default MarketplaceBuyPage;
