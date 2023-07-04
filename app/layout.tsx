import '@/styles/tailwind.scss';
import { Metadata } from 'next';
import { Header } from './components/nhs/Header';
import { Footer } from './components/nhs/Footer';
import { wrapper } from './components/nhs/wrapper';
import { SERVICE_DESC, SERVICE_NAME, SERVICE_URL } from './lib/utils/constants';

export const metadata: Metadata = {
  title: SERVICE_NAME,
  description: SERVICE_DESC,
  openGraph: {
    title: SERVICE_NAME,
    description: SERVICE_DESC,
    type: 'website',
    locale: 'en_GB',
    url: SERVICE_URL,
    images: [{ url: 'landing.png', alt: SERVICE_NAME }],
  },
  twitter: {
    title: SERVICE_NAME,
    description: SERVICE_DESC,
    card: 'summary',
    images: [{ url: 'landing.png', alt: SERVICE_NAME }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
          { wrapper(children)}
        <Footer />
      </body>
    </html>
  );
}