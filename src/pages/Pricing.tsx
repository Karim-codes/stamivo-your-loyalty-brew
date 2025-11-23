import { Coffee, Check, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "£15",
      period: "mo",
      description: "Perfect for small coffee shops just getting started",
      features: [
        "Unlimited stamps",
        "Custom rewards",
        "QR system",
        "Dashboard"
      ],
      color: "from-soft-orange to-accent",
      popular: false
    },
    {
      name: "Growth",
      price: "£29",
      period: "mo",
      description: "Ideal for growing coffee shops and cafés",
      features: [
        "Everything in Starter, plus:",
        "Detailed analytics",
        "Customer insights",
        "Email reminders (\"You're 1 stamp away!\")"
      ],
      color: "from-primary to-coffee-dark",
      popular: true
    },
    {
      name: "Add-Ons",
      price: "Custom",
      period: "",
      description: "Enhance your plan with additional features",
      features: [
        "Multi-branch support: +£10/mo",
        "Custom branded page: +£15/mo"
      ],
      color: "from-forest-green to-success",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How does Stamivo work?",
      answer: "Stamivo is a digital loyalty platform for coffee shops. Customers scan a QR code with their phone after each purchase to collect stamps. Once they complete their stamp card, they earn a reward. It's that simple!"
    },
    {
      question: "Do I need any special equipment?",
      answer: "No! All you need is a device to display your unique QR code (like a tablet, phone, or printed poster). Customers scan it with their own phones. No expensive hardware or card readers required."
    },
    {
      question: "How do customers access their stamp cards?",
      answer: "Customers can access their stamp cards through our mobile app or website. They don't need to download anything if they prefer using the web version. All their loyalty cards are stored in one convenient place."
    },
    {
      question: "Can I customize my loyalty program?",
      answer: "Absolutely! You can set how many stamps customers need to earn a reward, customize what rewards you offer, add your logo and branding, and even send personalized messages to your customers."
    },
    {
      question: "What if a customer loses their phone?",
      answer: "No worries! Since everything is stored in the cloud with their account, customers can simply log in from any device and all their stamps will be there. Unlike paper cards, they'll never lose their progress."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 14-day free trial on all paid plans. No credit card required to start. You can test all features and see how Stamivo works for your business before committing."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll have access until the end of your current billing period."
    },
    {
      question: "How do I prevent fraud or stamp abuse?",
      answer: "Stamivo has built-in security features including unique QR codes, rate limiting (to prevent rapid scanning), and verification systems. You can also manually review and manage stamps through your dashboard."
    },
    {
      question: "Do you offer support?",
      answer: "Yes! All plans include email support. Growth plan customers get priority support with faster response times. We also have comprehensive documentation and video tutorials to help you get started."
    },
    {
      question: "Can I use Stamivo for multiple locations?",
      answer: "Yes! With our Multi-branch support add-on (+£10/mo), you can manage multiple locations from one account. Each location can have its own loyalty program or share a unified program across all branches."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as direct debit for UK businesses. All payments are processed securely through our payment provider."
    },
    {
      question: "How quickly can I get started?",
      answer: "Most coffee shops are up and running within 10 minutes! Simply sign up, customize your loyalty program, and display your QR code. That's it – you're ready to start rewarding customers."
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
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
              <a
                href="/about"
                className="hidden md:inline-flex text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-beige via-background to-soft-orange/10 pt-32 pb-20 md:pt-40 md:pb-32">
        <ParticleBackground />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-soft-orange/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Simple, transparent<br />
              <span className="text-primary">pricing</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-cream-beige/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {plans.map((plan, index) => (
              <ScrollReveal key={plan.name} delay={index * 0.1}>
                <Card 
                  className={`relative hover:scale-105 transition-all duration-500 hover:shadow-2xl ${
                    plan.popular 
                      ? "border-4 border-primary shadow-xl" 
                      : "border-2 hover:border-primary/30"
                  } bg-white/90 backdrop-blur`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-primary to-coffee-dark text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                        {plan.period && (
                          <span className="text-muted-foreground">/{plan.period}</span>
                        )}
                      </div>
                    </div>

                    <Button 
                      className={`w-full mb-6 py-6 rounded-xl ${
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-coffee-dark hover:opacity-90" 
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.name === "Add-Ons" ? "Contact Sales" : "Get Started"}
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                All plans include a 14-day free trial. No credit card required.
              </p>
              <p className="text-sm text-muted-foreground">
                Need a custom plan? <a href="mailto:hello@stamivo.com" className="text-primary font-semibold hover:underline">Contact us</a>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-cream-beige/30 to-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Frequently asked questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Stamivo
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-white/80 backdrop-blur rounded-2xl border-2 border-border hover:border-primary/30 transition-colors px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="mt-16 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Still have questions?
              </p>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = 'mailto:hello@stamivo.com'}
              >
                Contact Support
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
