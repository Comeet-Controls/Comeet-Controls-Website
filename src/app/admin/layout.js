
export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin | Comeet Controls",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen antialiased" style={{ background: "#020c18", color: "#e2eaf4" }}>
      {/* Hide the root-layout Navbar (<nav>), Footer (<footer>), and WhatsApp button
          (fixed <div>) that are rendered by the parent RootLayout on every page. */}
      <style dangerouslySetInnerHTML={{ __html: `
        body > nav,
        body > footer,
        body > div.fixed { display: none !important; }
        body > main { display: contents !important; }
      ` }} />
      {children}
    </div>
  );
}
