import '@/styles/tailwind.scss';
import { Metadata } from 'next';

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
          {children}
      </body>
    </html>
  );
}