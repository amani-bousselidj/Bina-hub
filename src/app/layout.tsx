import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/core/shared/auth/AuthProvider'
import { I18nProvider } from '@/core/shared/i18n/I18nProvider'
import { ThemeProvider } from '@/core/shared/theme/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/contexts/CartContext'
import MainHeader from '@/components/layout/MainHeader'

export const metadata: Metadata = {
  title: 'binaaHub - Construction Platform',
  description: 'Complete construction management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <MainHeader />
                {children}
                <Toaster position="top-center" />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}




