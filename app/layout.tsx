import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Street Run Pup',
  description: 'Animated video of a dog running through a street scene.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
