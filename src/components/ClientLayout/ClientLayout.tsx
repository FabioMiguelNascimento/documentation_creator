'use client';
import Navigation from '../Navigation/Navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex' }}>
      <Navigation />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
