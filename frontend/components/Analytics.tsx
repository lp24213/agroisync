'use client';

import { useEffect } from 'react';

interface AnalyticsProps {
  trackingId?: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID,
}) => {
  useEffect(() => {
    if (!trackingId || typeof window === 'undefined') return;

    // Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', trackingId);

    return () => {
      document.head.removeChild(script);
    };
  }, [trackingId]);

  return null;
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
