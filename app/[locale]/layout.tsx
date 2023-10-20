import './styles/tailwind.scss';

import { NextIntlClientProvider } from 'next-intl';
import { Metadata } from 'next';
import { Header } from './components/nhs/Header';
import { Footer } from './components/nhs/Footer';
import { wrapper } from './components/nhs/wrapper';
import { SERVICE_DESC, SERVICE_NAME, SERVICE_URL } from '../utils/constants';
import { getInternationalisation } from '../utils/functions';

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
  const internationalisation = await getInternationalisation(locale);
  // const maintenanceMode: boolean = await checkHealthAPIStatus(process.env.HEALTH_AI_API_HEALTH_CHECK_URL);
  const maintenanceMode = false;
  return (
    <html lang={locale}>
      <body>
      <NextIntlClientProvider timeZone='Europe/London' locale={locale} messages={internationalisation}>
        <Header locale={locale} />
          { wrapper(children, maintenanceMode)}
        <Footer />
      </NextIntlClientProvider>
      </body>
    </html>
  );
}
