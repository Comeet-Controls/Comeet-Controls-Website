

export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin | Comeet Controls",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen antialiased" style={{ background: "#020c18", color: "#e2eaf4" }}>
      {children}
    </div>
  );
}
