import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bangla',
});

export const metadata: Metadata = {
  title: 'MSUS - Mohammadpur Samaj Unnayan Sangathan',
  description: 'মোহাম্মদপুর সমাজ উন্নয়ন সংগঠন - A non-profit social development organization working for community welfare in Mohammadpur, Ulchapara, Brahmanbaria.',
  keywords: ['MSUS', 'Mohammadpur', 'Social Organization', 'Brahmanbaria', 'NGO', 'Community Development'],
  authors: [{ name: 'MSUS' }],
  openGraph: {
    title: 'MSUS - Mohammadpur Samaj Unnayan Sangathan',
    description: 'Working for a Better Tomorrow',
    type: 'website',
    locale: 'bn_BD',
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#16a34a',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
