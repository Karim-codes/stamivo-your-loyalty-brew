import { Coffee, Heart, Users, Zap, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCoffeeIcon from "@/components/AnimatedCoffeeIcon";
import ParticleBackground from "@/components/ParticleBackground";
import Footer from "@/components/Footer";

// Import illustrations
import BaristaIllustration from "@/assets/Barista Illustration - Coffee Preparation.png";
import CoffeeBeans from "@/assets/Coffee Beans - Decorative UI Element.png";
import CoffeeCupIcon from "@/assets/Coffee Cup Icon - Standalone.png";

export default function About() {
  const team = [
    {
      role: "Founder & CEO",
      description: "Coffee enthusiast with a passion for building tools that help small businesses thrive.",
      icon: Coffee,
      color: "from-primary to-coffee-dark"
    },
    {
      role: "Lead Developer",
      description: "Full-stack wizard who turns coffee into code and ideas into reality.",
      icon: Zap,
      color: "from-soft-orange to-accent"
    },
    {
      role: "Designer",
      description: "Creates beautiful experiences that make loyalty programs feel delightful.",
      icon: Sparkles,
      color: "from-success to-forest-green"
    }
  ];

  const values = [
    {
      title: "Simple & Effective",
      description: "We believe loyalty programs shouldn't be complicated. One scan, one stamp, one happy customer.",
      icon: Target,
      color: "from-primary to-coffee-dark"
    },
    {
      title: "Built for Coffee Shops",
      description: "We're not a generic platform. Every feature is designed specifically for coffee shops and their customers.",
      icon: Coffee,
      color: "from-soft-orange to-accent"
    },
    {
      title: "Community First",
      description: "We listen to our users and build what they need. Your feedback shapes our roadmap.",
      icon: Users,
      color: "from-success to-forest-green"
    },
    {
      title: "Made with Love",
      description: "Every line of code, every pixel, every feature is crafted with care and attention to detail.",
      icon: Heart,
      color: "from-accent to-soft-orange"
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-beige via-background to-soft-orange/10 pt-32 pb-20 md:pt-40 md:pb-32">
        <ParticleBackground />
        
        {/* Organic Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-soft-orange/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Decorative Coffee Beans */}
        <img 
          src={CoffeeBeans} 
          alt="Coffee beans decoration" 
          className="absolute top-32 right-10 w-24 h-24 opacity-15 rotate-12 hidden lg:block"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in flex justify-center">
              <AnimatedCoffeeIcon size="lg" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              We're a small team with a<br />
              <span className="text-primary">big love for coffee</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Stamivo started with a simple idea: make loyalty programs as delightful as that first sip of morning coffee.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-cream-beige/30 overflow-hidden">
        {/* Decorative Coffee Cup */}
        <img 
          src={CoffeeCupIcon} 
          alt="Coffee cup decoration" 
          className="absolute bottom-20 left-10 w-32 h-32 opacity-15 rotate-[-20deg] hidden lg:block"
        />

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <div className="inline-block mb-4">
                    <span className="px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
                      OUR STORY
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                    Born from frustration,<br />
                    <span className="text-primary">built with passion</span>
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      We've all been there — carrying a wallet full of crumpled loyalty cards, forgetting them at home, or losing them just before getting that free coffee.
                    </p>
                    <p>
                      As regular coffee shop customers ourselves, we knew there had to be a better way. So we built it.
                    </p>
                    <p>
                      Stamivo isn't backed by venture capital or run by a massive corporation. We're a small, dedicated team of coffee lovers who believe that great software should be simple, beautiful, and actually solve real problems.
                    </p>
                    <p className="font-semibold text-foreground">
                      Today, we're proud to help over 500 coffee shops build lasting relationships with their customers — one stamp at a time.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-soft-orange/20 rounded-full blur-3xl scale-110" />
                  <img 
                    src={BaristaIllustration} 
                    alt="Barista preparing coffee with care" 
                    className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-3xl"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-cream-beige/30 to-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-soft-orange/10 text-soft-orange rounded-full text-sm font-semibold tracking-wide">
                  WHAT WE BELIEVE
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Our values
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl bg-white/90 backdrop-blur border-2 hover:border-primary/30">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-soft-orange/5 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-soft-orange/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
                  MEET THE TEAM
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Small team,<br />
                <span className="text-primary">big hearts</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're a close-knit group of makers, dreamers, and coffee addicts
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <ScrollReveal key={member.role} delay={index * 0.1}>
                <Card className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl bg-white/90 backdrop-blur border-2 hover:border-primary/30">
                  <CardContent className="p-8 text-center">
                    <div className={`w-24 h-24 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                      <member.icon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {member.role}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground mb-4">
                ☕ We're always brewing up new ideas
              </p>
              <p className="text-sm text-muted-foreground">
                Want to join us? We're always looking for talented people who love coffee as much as we do.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-soft-orange/10 to-primary/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-96 h-96 bg-soft-orange/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedCoffeeIcon size="md" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
                Join our growing<br />
                <span className="text-primary">coffee community</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Whether you're a coffee shop owner or a coffee lover, we'd love to have you on board.
              </p>
            
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/"
                  className="inline-flex items-center justify-center text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  Get Started Today
                </a>
                <a
                  href="mailto:hello@stamivo.com"
                  className="inline-flex items-center justify-center text-xl px-12 py-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 hover:border-primary/50 bg-white/80 backdrop-blur font-semibold"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
