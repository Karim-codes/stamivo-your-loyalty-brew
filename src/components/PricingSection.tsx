import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function PricingSection() {
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

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-cream-beige/30 to-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-soft-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <p className="text-sm text-muted-foreground">
              Need a custom plan? <a href="#" className="text-primary font-semibold hover:underline">Contact us</a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
