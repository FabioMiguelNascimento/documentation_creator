"use client";

import { ClientLayout } from '@/components/ClientLayout/ClientLayout';
import { SelectionProvider } from '@/contexts/SelectionContext';
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
        <SelectionProvider>
          <ToastProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ToastProvider>
        </SelectionProvider>
      </body>
    </html>
  );
}
