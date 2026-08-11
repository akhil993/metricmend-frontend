export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main>
      <section className="page-hero section">
        <p className="eyebrow">Legal</p>
        <h1>Privacy at MetricMend AI</h1>
        <p>Last updated: August 10, 2026</p>
      </section>
      <section className="section legal-content">
        <h2>Our approach</h2>
        <p>MetricMend AI builds products that may process information you provide, account details, and product usage data. We use that information to provide, secure, maintain, and improve the services you choose to use.</p>
        <h2>How information is used</h2>
        <p>We use information to operate our products, authenticate users, respond to requests, prevent abuse, understand reliability, and meet legal obligations. We do not sell personal information.</p>
        <h2>Service providers and retention</h2>
        <p>We may use vetted service providers for infrastructure, analytics, communications, and support. We retain information only as long as reasonably necessary for the service, security, and legal purposes described here.</p>
        <h2>Your choices</h2>
        <p>You may request access, correction, or deletion of your personal information, subject to applicable law and legitimate retention requirements.</p>
        <h2>Contact</h2>
        <p>Questions or privacy requests can be sent to <a href="mailto:hello@metricmendai.com?subject=Privacy%20request">hello@metricmendai.com</a>.</p>
      </section>
    </main>
  );
}
