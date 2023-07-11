import './styles/tailwind.scss';

import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from './components/nhs/Header';
import { Footer } from './components/nhs/Footer';
import { wrapper } from './components/nhs/wrapper';
import { SERVICE_DESC, SERVICE_NAME, SERVICE_URL } from '../lib/utils/constants';

export const metadata: Metadata = {
  title: SERVICE_NAME,
  description: SERVICE_DESC,
  openGraph: {
    title: SERVICE_NAME,
    description: SERVICE_DESC,
    type: 'website',
    locale: 'en',
    url: SERVICE_URL,
  },
  twitter: {
    title: SERVICE_NAME,
    description: SERVICE_DESC,
    card: 'summary',
  },
};

export default async function RootLayout({
  children, params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // this is needed for translation in client components
  let internationalisation;
  try {
    internationalisation = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
      <NextIntlClientProvider locale={locale} messages={internationalisation}>
        <Header locale={locale} />
          { wrapper(children)}
        <Footer />
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
