import '@/styles/tailwind.scss';
import { Metadata } from 'next';
import { Header } from './components/nhs/header';
import { Footer } from './components/nhs/footer';

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
          {children}
        <Footer />
      </body>
    </html>
  );
}