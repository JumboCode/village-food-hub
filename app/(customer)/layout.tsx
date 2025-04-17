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
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      {children}
    </>
  );
}