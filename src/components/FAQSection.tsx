import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";

export default function FAQSection() {
  const faqs = [
    {
      question: "How does Stamivo work for customers?",
      answer: "Customers simply scan a QR code at your coffee shop after making a purchase. Each scan adds a digital stamp to their loyalty card. Once they collect enough stamps, they automatically unlock a reward. No app download or signup required!"
    },
    {
      question: "Do customers need to download an app?",
      answer: "No! Stamivo works entirely through the web browser. Customers just scan your QR code with their phone's camera, and they're instantly connected to your loyalty program. It's as simple as it gets."
    },
    {
      question: "How do I customize my loyalty program?",
      answer: "You have full control! Set how many stamps customers need to earn a reward, define what the reward is (free coffee, pastry, discount, etc.), and customize your shop's branding. You can also set rules like allowing multiple stamps per visit or requiring verification."
    },
    {
      question: "Can I use Stamivo for multiple locations?",
      answer: "Yes! Our Professional and Enterprise plans support multiple locations. Customers can earn stamps at any of your locations, and you get a unified dashboard to manage everything. Perfect for coffee shop chains."
    },
    {
      question: "What if a customer loses their phone?",
      answer: "No problem! If customers create an account, their stamp progress is safely stored in the cloud. They can access it from any device by logging in. Even without an account, we use browser storage to keep their progress."
    },
    {
      question: "Is there a setup fee or contract?",
      answer: "No setup fees, no contracts. Start with our free plan and upgrade anytime. You can cancel whenever you want with no penalties. We believe in earning your business every month."
    },
    {
      question: "How do I prevent customers from cheating the system?",
      answer: "Stamivo includes built-in fraud prevention. You can enable verification mode where staff must approve each stamp, set cooldown periods between scans, and track unusual patterns. We make it easy to reward honest customers while preventing abuse."
    },
    {
      question: "What kind of analytics do I get?",
      answer: "Track customer visits, popular rewards, peak times, repeat visit rates, and customer lifetime value. Professional plans include advanced segmentation and marketing insights to help you grow your business strategically."
    },
    {
      question: "Can I offer different rewards for different customers?",
      answer: "Absolutely! Professional and Enterprise plans let you create multiple loyalty programs, offer special rewards for VIP customers, and run limited-time promotions. Personalization is key to building loyalty."
    },
    {
      question: "How quickly can I get started?",
      answer: "You can be up and running in under 10 minutes! Our simple onboarding wizard guides you through setting up your shop, creating your loyalty program, and generating your QR code. Start rewarding customers today."
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-soft-orange/5 to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-soft-orange/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about Stamivo
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white/80 backdrop-blur border-2 hover:border-primary/30 rounded-2xl px-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Still have questions?
              </p>
              <a 
                href="#" 
                className="text-primary font-semibold text-lg hover:underline inline-flex items-center gap-2"
              >
                Contact our support team →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
