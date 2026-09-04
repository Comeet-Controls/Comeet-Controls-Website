import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: "Comeet Controls Pvt. Ltd. | Industrial Automation & SPM Solutions",
  description:
    "Leading industrial automation company in Pune, Maharashtra. Specializing in Special Purpose Machines (SPMs), PLC Control Panels, SCADA, HMI development, and turnkey engineering solutions.",
  keywords:
    "industrial automation Pune, PLC programming, SCADA development, special purpose machines, control panels, HMI engineering, Comeet Controls, CES Pune",
  openGraph: {
    title: "Comeet Controls Pvt. Ltd. | Industrial Automation & SPM Solutions",
    description:
      "Precision automation engineered for industry. 50+ delivered projects, 75+ happy clients across India and globally.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body className="bg-bg text-ctext min-h-screen flex flex-col antialiased selection:bg-accent/30 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}