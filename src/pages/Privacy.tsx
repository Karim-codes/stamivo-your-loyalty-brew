import { Coffee } from "lucide-react";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Coffee className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl md:text-2xl font-bold text-primary">Stamivo</span>
            </a>
            
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: November 23, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="leading-relaxed mb-4">
                Welcome to Stamivo. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our services and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="leading-relaxed">
                This privacy policy applies to information we collect about you when you use our digital loyalty platform, including our website, mobile applications, and related services (collectively, the "Service").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Information You Provide</h3>
              <p className="leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
                <li><strong>Business Information:</strong> Business name, address, logo, and other details for Business Users</li>
                <li><strong>Payment Information:</strong> Billing details and payment card information (processed securely through our payment providers)</li>
                <li><strong>Communications:</strong> Information you provide when you contact us for support or feedback</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Information We Collect Automatically</h3>
              <p className="leading-relaxed mb-4">
                When you use our Service, we automatically collect certain information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Usage Information:</strong> Stamps collected, rewards redeemed, and loyalty program participation</li>
                <li><strong>Device Information:</strong> Device type, operating system, browser type, and unique device identifiers</li>
                <li><strong>Log Information:</strong> IP address, access times, pages viewed, and the page you visited before navigating to our Service</li>
                <li><strong>Location Information:</strong> Approximate location based on IP address or precise location if you grant permission</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Information from Third Parties</h3>
              <p className="leading-relaxed mb-4">
                We may receive information about you from third parties, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Social media platforms if you choose to connect your account</li>
                <li>Payment processors for transaction verification</li>
                <li>Analytics providers to help us understand how users interact with our Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Communicate with you about products, services, offers, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize and improve the Service and provide content or features that match your interests</li>
                <li>Facilitate contests, sweepstakes, and promotions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Sharing of Information</h2>
              <p className="leading-relaxed mb-4">
                We may share information about you as follows:
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">4.1 With Business Users</h3>
              <p className="leading-relaxed mb-4">
                When you participate in a coffee shop's loyalty program, we share your stamp collection and reward redemption information with that business.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.2 With Service Providers</h3>
              <p className="leading-relaxed mb-4">
                We share information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.3 For Legal Reasons</h3>
              <p className="leading-relaxed mb-4">
                We may disclose information if we believe it's necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Comply with applicable law, regulation, legal process, or governmental request</li>
                <li>Enforce our Terms of Service and other agreements</li>
                <li>Detect, prevent, or address fraud, security, or technical issues</li>
                <li>Protect the rights, property, or safety of Stamivo, our users, or the public</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3">4.4 With Your Consent</h3>
              <p className="leading-relaxed mb-4">
                We may share information with your consent or at your direction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Retention</h2>
              <p className="leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide the Service and fulfill the purposes outlined in this privacy policy. We may also retain and use your information to comply with our legal obligations, resolve disputes, and enforce our agreements.
              </p>
              <p className="leading-relaxed">
                When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Security</h2>
              <p className="leading-relaxed mb-4">
                We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Restricted access to personal information</li>
                <li>Secure payment processing through PCI-compliant providers</li>
              </ul>
              <p className="leading-relaxed">
                However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights and Choices</h2>
              <p className="leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">7.1 Access and Update</h3>
              <p className="leading-relaxed mb-4">
                You can access and update your account information through your account settings.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">7.2 Data Portability</h3>
              <p className="leading-relaxed mb-4">
                You have the right to request a copy of your personal data in a structured, commonly used format.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">7.3 Deletion</h3>
              <p className="leading-relaxed mb-4">
                You can request deletion of your personal information by contacting us or deleting your account through the Service.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">7.4 Marketing Communications</h3>
              <p className="leading-relaxed mb-4">
                You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails or by updating your account settings.
              </p>

              <h3 className="text-xl font-semibold text-foreground mb-3">7.5 Cookies</h3>
              <p className="leading-relaxed mb-4">
                Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. UK GDPR Compliance</h2>
              <p className="leading-relaxed mb-4">
                If you are located in the United Kingdom, you have certain rights under the UK General Data Protection Regulation (UK GDPR), including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>The right to access your personal data</li>
                <li>The right to rectification of inaccurate personal data</li>
                <li>The right to erasure of your personal data</li>
                <li>The right to restrict processing of your personal data</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
                <li>Rights related to automated decision-making and profiling</li>
              </ul>
              <p className="leading-relaxed">
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Children's Privacy</h2>
              <p className="leading-relaxed mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. International Data Transfers</h2>
              <p className="leading-relaxed mb-4">
                Your information may be transferred to and maintained on computers located outside of your country where data protection laws may differ. We take steps to ensure that your data is treated securely and in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
              <p className="leading-relaxed mb-4">
                We may update this privacy policy from time to time. If we make material changes, we will notify you by email or through the Service. Your continued use of the Service after changes become effective constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
              <p className="leading-relaxed mb-4">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: privacy@stamivo.com</li>
                <li>Phone: +44 20 1234 5678</li>
                <li>Address: London, United Kingdom</li>
              </ul>
              <p className="leading-relaxed mt-4">
                You also have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
