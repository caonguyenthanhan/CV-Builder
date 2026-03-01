import type {Metadata} from 'next';
import {Inter, JetBrains_Mono} from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CV Builder Chuẩn ATS',
  description: 'A modern, ATS-friendly CV builder with real-time preview, AI review, and multi-language support.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
