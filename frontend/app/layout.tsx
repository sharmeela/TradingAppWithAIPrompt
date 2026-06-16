import './globals.css';

export const metadata = {
  title: 'AtlasTrade | Live Trading Desk',
  description: 'A real-time crypto and stock trading dashboard scaffold.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
