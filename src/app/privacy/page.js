import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Comeet Controls Pvt. Ltd.",
  description:
    "Privacy Policy for Comeet Controls Pvt. Ltd. — how we collect, use, and protect your personal information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#020c18] text-white">
      {/* Header */}
      <section className="border-b border-white/10 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-white/50 text-sm">
            Last updated: November 2026 &nbsp;·&nbsp; Comeet Controls Pvt. Ltd.
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-14 prose prose-invert prose-blue max-w-none">

        {/* 1 */}
        <h2>1. Who We Are</h2>
        <p>
          <strong>Comeet Controls Pvt. Ltd.</strong> (&ldquo;Comeet&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
          or &ldquo;our&rdquo;) is an industrial automation company incorporated in India, with its
          registered office at Shop No. 34, Mahasainik Industrial Estate Rd, T Block, MIDC,
          Bhosari, Pimpri-Chinchwad – 411026, Maharashtra.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, and protect information when you
          visit <strong>www.comeetindia.com</strong> (the &ldquo;Website&rdquo;).
        </p>

        {/* 2 */}
        <h2>2. Information We Collect</h2>
        <h3>a) Information you provide voluntarily</h3>
        <p>
          When you submit our contact / inquiry form, we collect:
        </p>
        <ul>
          <li>Full name</li>
          <li>Work email address</li>
          <li>Phone number (optional)</li>
          <li>Company name (optional)</li>
          <li>Service category and project description</li>
        </ul>

        <h3>b) Information collected automatically</h3>
        <ul>
          <li>
            <strong>IP address</strong> — collected temporarily for spam / abuse prevention
            (rate-limiting). Stored in our database for up to 30 days and then automatically
            deleted.
          </li>
          <li>
            <strong>Submission timestamp</strong> — used to detect bot submissions.
          </li>
        </ul>

        <h3>c) Third-party services</h3>
        <p>
          Our Website loads the following third-party services. Each has its own privacy policy:
        </p>
        <ul>
          <li>
            <strong>Google reCAPTCHA v3</strong> — detects bot traffic on our contact form.
            Google may collect usage data.{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
          </li>
          <li>
            <strong>Google Fonts</strong> — loads web fonts from Google&apos;s CDN.{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
          </li>
          <li>
            <strong>FontAwesome CDN (cdnjs.cloudflare.com)</strong> — loads icon fonts.{" "}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare Privacy Policy
            </a>
          </li>
          <li>
            <strong>Vercel</strong> — our hosting provider. May collect server access logs.{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vercel Privacy Policy
            </a>
          </li>
        </ul>
        <p>
          We do <strong>not</strong> use Google Analytics, Facebook Pixel, or any advertising
          trackers. We do <strong>not</strong> place cookies on your device.
        </p>

        {/* 3 */}
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To respond to your technical inquiry or project requirement</li>
          <li>To prevent spam and abuse on our contact form</li>
          <li>To improve the Website&apos;s performance and reliability</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent, or share your personal information with any
          third party for marketing purposes.
        </p>

        {/* 4 */}
        <h2>4. Legal Basis for Processing (India DPDP Act 2023)</h2>
        <p>
          We process your personal data on the basis of <strong>consent</strong> — by submitting
          our inquiry form, you consent to us using your contact details to respond to your
          inquiry. You may withdraw consent at any time by emailing us (see Section 8).
        </p>

        {/* 5 */}
        <h2>5. Data Retention</h2>
        <ul>
          <li>
            <strong>Contact inquiry data</strong> — retained in our email inbox for as long as
            necessary to fulfil the business relationship, then deleted.
          </li>
          <li>
            <strong>IP addresses</strong> — automatically purged from our database after 30 days.
          </li>
        </ul>

        {/* 6 */}
        <h2>6. Data Security</h2>
        <p>
          We implement industry-standard security measures including HTTPS (TLS), HTTP security
          headers (CSP, HSTS, X-Frame-Options), server-side input validation, parameterised
          database queries, and access-controlled admin systems. Our database is hosted on Neon
          (AWS ap-southeast-1) with encrypted connections.
        </p>

        {/* 7 */}
        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Our Website is a B2B industrial automation service. We do not knowingly collect data
          from anyone under the age of 18.
        </p>

        {/* 8 */}
        <h2>8. Your Rights</h2>
        <p>
          Under the Digital Personal Data Protection Act 2023 (India), you have the right to:
        </p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request erasure of your data</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <a href="mailto:sales@comeetindia.com">sales@comeetindia.com</a>.
          We will respond within 30 days.
        </p>

        {/* 9 */}
        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date
          at the top of this page will reflect any changes. Continued use of the Website after
          changes constitutes acceptance.
        </p>

        {/* 10 */}
        <h2>10. Contact Us</h2>
        <address className="not-italic">
          <strong>Comeet Controls Pvt. Ltd.</strong><br />
          Shop No. 34, Mahasainik Industrial Estate Rd,<br />
          T Block, MIDC, Bhosari, Pimpri-Chinchwad – 411026,<br />
          Maharashtra, India<br />
          Email:{" "}
          <a href="mailto:sales@comeetindia.com">sales@comeetindia.com</a><br />
          Phone: <a href="tel:+919960194497">+91 99601 94497</a>
        </address>
      </article>

      {/* Footer nav */}
      <div className="border-t border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto flex gap-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white transition-colors">← Back to Home</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
