import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import ConsultationModal from '../components/ConsultationModal'

export const metadata = {
  metadataBase: new URL('https://hayagrivainteriors.com'),
  title: {
    default: 'Hayagriva Interiors',
    template: '%s | Hayagriva Interiors',
  },
  description: 'Premium Interior Design Studio',
  openGraph: {
    siteName: 'Hayagriva Interiors',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <ConsultationModal />
      </body>
    </html>
  )
}
