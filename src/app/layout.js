import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.comeetindia.com/#organization",
      name: "Comeet Controls Pvt. Ltd.",
      alternateName: "Comeet Engineering Services (CES)",
      url: "https://www.comeetindia.com",
      logo: "https://www.comeetindia.com/logo.png",
      description:
        "Leading industrial automation company in Pune, Maharashtra. Specializing in Special Purpose Machines (SPMs), PLC Control Panels, SCADA, HMI development, and turnkey engineering solutions.",
      foundingYear: "2012",
      email: "sales@comeetindia.com",
      telephone: "+919960194497",
      address: {
        "@type": "PostalAddress",
        streetAddress: "709, S. No. 33/2, Sukhwani Fairview, Near Aditya Birla Hospital, Thergaon, Chinchwad",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411033",
        addressCountry: "IN",
      },
      areaServed: ["India", "Global"],
      sameAs: [],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.comeetindia.com/#localbusiness",
      name: "Comeet Controls Pvt. Ltd.",
      image: "https://www.comeetindia.com/og-image.jpg",
      url: "https://www.comeetindia.com",
      telephone: "+919960194497",
      email: "sales@comeetindia.com",
      priceRange: "₹₹₹",
      openingHours: "Mo-Sa 09:00-18:00",
      address: {
        "@type": "PostalAddress",
        streetAddress: "709, S. No. 33/2, Sukhwani Fairview, Near Aditya Birla Hospital, Thergaon, Chinchwad",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411033",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 18.6551,
        longitude: 73.7889,
      },
      hasMap: "https://maps.google.com/?q=Sukhwani+Fairview+Thergaon+Pune",
    },
  ],
};

export const metadata = {
  metadataBase: new URL("https://www.comeetindia.com"),
  title: {
    default: "Comeet Controls Pvt. Ltd. | Industrial Automation & SPM Solutions — Pune",
    template: "%s | Comeet Controls Pvt. Ltd.",
  },
  description:
    "Leading industrial automation company in Pune, Maharashtra. Specializing in Special Purpose Machines (SPMs), PLC Control Panels, SCADA, HMI development, and turnkey engineering solutions.",
  keywords:
    "industrial automation Pune, PLC programming, SCADA development, special purpose machines, control panels, HMI engineering, Comeet Controls, CES Pune, SPM manufacturer India",
  openGraph: {
    title: "Comeet Controls Pvt. Ltd. | Industrial Automation & SPM Solutions",
    description:
      "Precision automation engineered for industry. 50+ delivered projects, 75+ happy clients across India and globally. Based in Chinchwad, Pune.",
    url: "https://www.comeetindia.com",
    siteName: "Comeet Controls Pvt. Ltd.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Comeet Controls Pvt. Ltd. — Industrial Automation & SPM Solutions, Pune",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comeet Controls Pvt. Ltd. | Industrial Automation & SPM Solutions",
    description:
      "Precision automation engineered for industry. 50+ delivered projects, 75+ happy clients.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-bg text-ctext min-h-screen flex flex-col antialiased selection:bg-accent/30 selection:text-white">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
        {/* JSON-LD Structured Data for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        {/* Floating WhatsApp Button — visible on all pages, zero cost */}
        <WhatsAppButton />
      </body>
    </html>
  );
}