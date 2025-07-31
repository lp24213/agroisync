import dynamic from 'next/dynamic';

const NFTMarketplacePage = dynamic(() => import('./NFTMarketplacePage'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// Disable SSR for this page
export const revalidate = 0;

export default NFTMarketplacePage;
