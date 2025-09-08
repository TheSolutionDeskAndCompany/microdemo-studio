import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Data Collection</h2>
        <p className="mb-4">
          Microdemo Studio and its browser extension are designed with your privacy in mind. We collect minimal data to provide our services:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Demo recordings you create (including screenshots, interactions, and metadata)</li>
          <li>Basic usage analytics (e.g., feature usage, errors)</li>
          <li>Anonymous performance metrics</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Data Usage</h2>
        <p className="mb-4">
          We use the collected data to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Provide and improve our services</li>
          <li>Process and store your demo recordings</li>
          <li>Debug and fix issues</li>
          <li>Understand usage patterns to enhance user experience</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your data:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Data in transit is encrypted using HTTPS</li>
          <li>Access to demo recordings is restricted to the creator</li>
          <li>Regular security audits and updates</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
        <p className="mb-4">
          We do not sell or share your personal data with third parties except:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>When required by law</li>
          <li>To provide the service (e.g., cloud storage providers)</li>
          <li>When you explicitly choose to share a demo</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access your data</li>
          <li>Delete your account and associated data</li>
          <li>Export your demo recordings</li>
          <li>Opt-out of analytics collection</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this privacy policy from time to time. We'll notify you of any changes by posting the new policy on this page.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy, please contact us at <a href="mailto:privacy@example.com" className="text-blue-600 hover:underline">privacy@example.com</a>.
        </p>
      </section>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
