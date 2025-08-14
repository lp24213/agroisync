'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const NFTMarketplacePage = dynamic(() => import('./NFTMarketplacePage'), {
    loading: () => <div>Loading...</div>,
    ssr: false,
});

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NFTMarketplacePage />
        </Suspense>
    );
}
