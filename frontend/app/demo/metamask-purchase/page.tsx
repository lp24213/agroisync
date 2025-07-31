import dynamic from 'next/dynamic';

const MetamaskPurchasePage = dynamic(() => import('./MetamaskPurchasePage'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

// Disable SSR for this page
export const revalidate = 0;

export default MetamaskPurchasePage;
