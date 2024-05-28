import './styles/tailwind.scss';

import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/react"
import { Header, Footer, Wrapper } from './components/nhs';
import { SERVICE_DESC, SERVICE_DESC_EXT, SERVICE_NAME, SERVICE_URL, checkHealthAPIStatus, getInternationalisation } from '../utils';

const META_DESCRIPTION = SERVICE_DESC + " - " + SERVICE_NAME;
const META_URL = new URL(SERVICE_URL);

export const metadata: Metadata = {
  metadataBase: META_URL,
  robots: {
    index: false,
    follow: false,
  },
  title: SERVICE_NAME + " - " + SERVICE_DESC,
  description: SERVICE_DESC_EXT + " - " + SERVICE_NAME,
  openGraph: {
    siteName: SERVICE_NAME,
    title: SERVICE_NAME,
    description: META_DESCRIPTION,
    type: 'website',
    locale: 'en',
    url: META_URL,
  },
  twitter: {
    title: SERVICE_NAME,
    description: META_DESCRIPTION,
    card: 'summary',
  },
};

export default async function RootLayout({
  children, params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // this is needed for translation in client components
  const internationalisation = await getInternationalisation(locale);
  const maintenanceMode: boolean = await checkHealthAPIStatus(process.env.HEALTH_AI_API_HEALTH_CHECK_URL);
  return (
    <html lang={locale} className='overflow-x-hidden mt-0'>
      <body>
      <NextIntlClientProvider locale={locale} messages={internationalisation}>
        <Header locale={locale} />
          { Wrapper(children, maintenanceMode)}
        <Footer />
      </NextIntlClientProvider>
      <SpeedInsights />
      <Analytics />
      </body>
    </html>
  );
}
