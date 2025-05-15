"use client";

import { ClientLayout } from '@/components/ClientLayout/ClientLayout';
import { ToastProvider } from '@/contexts/ToastContext';
import './globals.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
