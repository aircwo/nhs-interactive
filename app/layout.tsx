import '@/styles/tailwind.scss';
import { Metadata } from 'next';
import { Header } from './components/nhs/Header';
import { Footer } from './components/nhs/Footer';
import { wrapper } from './components/nhs/wrapper';

export const metadata: Metadata = {
  title: 'NHS - Interactive',
  description: 'AI-powered search.',
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