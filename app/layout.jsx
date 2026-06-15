import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Hayagriva Interiors',
  description: 'Premium Interior Design Studio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
