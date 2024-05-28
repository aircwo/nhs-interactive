import './styles/tailwind.scss';

import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Header, Footer, Wrapper } from './components/nhs';
import { SERVICE_DESC, SERVICE_NAME, SERVICE_URL, checkHealthAPIStatus, getInternationalisation } from '../utils';

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
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // this is needed for translation in client components
  const internationalisation = await getInternationalisation(locale);
  const maintenanceMode: boolean = await checkHealthAPIStatus(process.env.HEALTH_AI_API_HEALTH_CHECK_URL);
  return (
    <html lang={locale}>
      <body>
      <NextIntlClientProvider locale={locale} messages={internationalisation}>
        <Header locale={locale} />
          { Wrapper(children, maintenanceMode)}
        <Footer />
      </NextIntlClientProvider>
      <SpeedInsights />
      </body>
    </html>
  );
}
