import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Surprise Pages',
  description: 'Personalised surprise pages for birthdays and celebrations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f0f13] text-white antialiased">{children}</body>
    </html>
  );
}
