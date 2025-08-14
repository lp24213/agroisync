'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MetamaskPurchasePage = dynamic(() => import('./MetamaskPurchasePage'), {
    loading: () => <div>Loading...</div>,
    ssr: false,
});

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MetamaskPurchasePage />
        </Suspense>
    );
}
