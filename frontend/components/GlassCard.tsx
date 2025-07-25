import { ReactNode } from 'react';

export default function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-glass backdrop-blur-lg rounded-2xl shadow-glass border border-glassLight p-6 ${className} animate-pulse-neon`}
    >
      {children}
    </div>
  );
}
