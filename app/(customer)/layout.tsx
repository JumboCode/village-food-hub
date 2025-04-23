// app/(customer)/layout.tsx

import { ReactNode } from 'react';
import Head from 'next/head';

export const metadata = {
  title: 'Village Food Hub - Customer',
  description: 'Demographics Survey',
};

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Village Food Hub" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </Head>
      {children}
    </>
  );
}