'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MarketplaceBuyPage = dynamic(() => import('./MarketplaceBuyPage'), {
    loading: () => <div>Loading...</div>,
    ssr: false,
});

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketplaceBuyPage />
        </Suspense>
    );
}
