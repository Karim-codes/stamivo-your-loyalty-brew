import { Coffee } from "lucide-react";
import Footer from "@/components/Footer";

export default function Terms() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: November 23, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed mb-4">
                By accessing and using Stamivo ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
              <p className="leading-relaxed">
                These terms apply to all visitors, users, and others who access or use the Service, including but not limited to coffee shop owners ("Business Users") and their customers ("End Users").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
              <p className="leading-relaxed mb-4">
                Stamivo provides a digital loyalty program platform that enables coffee shops to create and manage customer loyalty programs. The Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Digital stamp card creation and management</li>
                <li>QR code generation for stamp collection</li>
                <li>Customer analytics and insights</li>
                <li>Reward redemption tracking</li>
                <li>Mobile and web-based access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold text-foreground mb-3">3.1 Account Creation</h3>
              <p className="leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">3.2 Account Security</h3>
              <p className="leading-relaxed mb-4">
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Business User Obligations</h2>
              <p className="leading-relaxed mb-4">
                As a Business User, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Provide accurate information about your business and loyalty programs</li>
                <li>Honor all rewards and promotions created through the Service</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the Service for any fraudulent or illegal purposes</li>
                <li>Maintain the security of your QR codes and account credentials</li>
                <li>Respond to customer inquiries in a timely and professional manner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. End User Conduct</h2>
              <p className="leading-relaxed mb-4">
                As an End User, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Attempt to gain unauthorized stamps or rewards</li>
                <li>Share or transfer your account to others</li>
                <li>Use automated systems to collect stamps</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to reverse engineer or hack the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Payment Terms</h2>
              <h3 className="text-xl font-semibold text-foreground mb-3">6.1 Subscription Fees</h3>
              <p className="leading-relaxed mb-4">
                Business Users agree to pay all fees associated with their chosen subscription plan. Fees are billed monthly in advance and are non-refundable except as required by law.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">6.2 Price Changes</h3>
              <p className="leading-relaxed mb-4">
                We reserve the right to change our pricing with 30 days' notice. Continued use of the Service after price changes constitutes acceptance of the new prices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Intellectual Property</h2>
              <p className="leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by Stamivo and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="leading-relaxed">
                You retain all rights to any content you submit, post, or display on or through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection with the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Termination</h2>
              <p className="leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
              </p>
              <p className="leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may do so by contacting us or through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <p className="leading-relaxed mb-4">
                In no event shall Stamivo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Disclaimer</h2>
              <p className="leading-relaxed mb-4">
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
              <p className="leading-relaxed mb-4">
                These Terms shall be governed and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to Terms</h2>
              <p className="leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
              <p className="leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>Email: legal@stamivo.com</li>
                <li>Phone: +44 20 1234 5678</li>
                <li>Address: London, United Kingdom</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
