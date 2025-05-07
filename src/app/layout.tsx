"use client";

import { ClientLayout } from '@/components/ClientLayout/ClientLayout';
import { SelectionProvider } from '@/contexts/SelectionContext';
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
          <ClientLayout>
            {children}
          </ClientLayout>
        </SelectionProvider>
      </body>
    </html>
  );
}
