import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Smartphone, Star, TrendingUp, Zap, BarChart3, ArrowRight } from "lucide-react";
import { UserTypeModal } from "@/components/UserTypeModal";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedCoffeeIcon from "@/components/AnimatedCoffeeIcon";
import ScrollReveal from "@/components/ScrollReveal";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

// Import illustrations
import BaristaIllustration from "@/assets/barista-illustration.png";
import WomanWithPhone from "@/assets/woman-with-phone.png";
import CoffeeCupIcon from "@/assets/coffee-cup-icon.png";
import CoffeeBeans from "@/assets/coffee-beans.png";
import WoodenTray from "@/assets/wooden-tray.png";

export default function Landing() {
  const [showModal, setShowModal] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <Coffee className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl md:text-2xl font-bold text-primary">Stamivo</span>
            </button>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={scrollToHowItWorks}
                className="hidden md:inline-flex hover:text-primary transition-colors"
              >
                How It Works
              </Button>
              <a
                href="/pricing"
                className="hidden md:inline-flex text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Pricing
              </a>
              <a
                href="/about"
                className="hidden md:inline-flex text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                About
              </a>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/auth'}
                className="hidden sm:inline-flex hover:text-primary transition-colors"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Premium 3D Animation */}
      <section className="relative bg-gradient-to-br from-cream-beige via-background to-soft-orange/10 pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Particle Background */}
        <ParticleBackground />
        
        {/* Organic Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-soft-orange/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="text-center md:text-left order-2 md:order-1">
                {/* Animated Coffee Icon with Steam */}
                <div className="mb-8 animate-fade-in flex justify-center md:justify-start">
                  <AnimatedCoffeeIcon size="lg" />
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                  Your new digital stamp card —<br />
                  <span className="text-primary">earn free coffee effortlessly.</span>
                </h1>
                
                <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl leading-relaxed">
                  Stamivo helps coffee shops grow loyal customers with one simple scan.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center mb-8">
                  <Button
                    onClick={() => setShowModal(true)}
                    size="lg"
                    className="group text-xl px-12 py-8 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90"
                  >
                    Get Started
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={scrollToHowItWorks}
                    size="lg"
                    variant="outline"
                    className="text-xl px-12 py-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/50"
                  >
                    How It Works
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  ☕ Join 500+ coffee shops already using Stamivo
                </p>
              </div>
              
              {/* Right side - Barista Illustration */}
              <div className="order-1 md:order-2 relative">
                <div className="relative animate-fade-in">
                  {/* Decorative background circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-soft-orange/20 rounded-full blur-3xl scale-110" />
                  <img 
                    src={WomanWithPhone} 
                    alt="Barista preparing coffee" 
                    className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating coffee beans decoration */}
                  <img 
                    src={CoffeeBeans} 
                    alt="Coffee beans" 
                    className="absolute -bottom-8 -left-8 w-24 h-24 opacity-60 animate-bounce"
                    style={{ animationDuration: '3s' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story-Driven How It Works */}
      <section id="how-it-works" className="relative py-20 md:py-32 bg-gradient-to-b from-background to-cream-beige/30 overflow-hidden">
        {/* Decorative Coffee Beans */}
        <img 
          src={CoffeeBeans} 
          alt="Coffee beans decoration" 
          className="absolute top-40 left-10 w-24 h-24 opacity-15 rotate-12 hidden lg:block"
        />
        <img 
          src={CoffeeCupIcon} 
          alt="Coffee cup decoration" 
          className="absolute bottom-40 right-10 w-28 h-28 opacity-15 rotate-[-20deg] hidden lg:block"
        />
        
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                How it works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to transform one-time visitors into loyal regulars
              </p>
            </div>
          </ScrollReveal>
          
          <div className="max-w-6xl mx-auto">
            {/* Step 1 */}
            <ScrollReveal delay={0.1}>
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-primary/5 to-soft-orange/10 rounded-[3rem] p-8 md:p-12 relative">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    1
                  </div>
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl">
                    <div className="flex items-center justify-center gap-8">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-coffee-dark rounded-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Coffee className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-6xl">→</div>
                      <div className="w-24 h-24 bg-gradient-to-br from-soft-orange to-accent rounded-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Smartphone className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Order & Scan
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Order your favorite drink, then scan the shop's QR code. 
                  Every purchase earns you a digital stamp — no paper cards to carry or lose.
                </p>
              </div>
            </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={0.2}>
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2">
                <div className="bg-gradient-to-br from-soft-orange/5 to-accent/10 rounded-[3rem] p-8 md:p-12 relative">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-soft-orange rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    2
                  </div>
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-10 h-10 rounded-xl transition-all duration-500 ${
                              i < 5 
                                ? "bg-gradient-to-br from-primary to-coffee-dark shadow-lg scale-110" 
                                : "bg-muted scale-95"
                            }`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-primary">5/8 stamps collected!</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Collect Stamps
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Watch your digital stamp card fill up with delightful animations. 
                  Track your progress across all your favorite coffee shops in one place.
                </p>
              </div>
            </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={0.3}>
              <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-gradient-to-br from-success/5 to-primary/10 rounded-[3rem] p-8 md:p-12 relative">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-success rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    3
                  </div>
                  <div className="bg-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                    <div className="text-center">
                      <div className="text-6xl mb-2 animate-bounce">🎉</div>
                      <p className="text-2xl font-bold text-success mb-2">Reward Unlocked!</p>
                      <p className="text-muted-foreground">Free Coffee ☕</p>
                    </div>
                    {/* Confetti effect */}
                    <div className="absolute top-0 left-1/4 text-2xl animate-bounce">✨</div>
                    <div className="absolute top-2 right-1/4 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</div>
                    <div className="absolute bottom-2 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌟</div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  Get Rewards
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Complete your stamp card and celebrate with a free drink or treat! 
                  Redeem instantly with a tap — it's that satisfying.
                </p>
              </div>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why Coffee Shops Love Us - Redesigned */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Creative background with waves */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-beige/40 via-background to-soft-orange/10" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,60 1200,50 L1200,120 L0,120 Z" fill="hsl(var(--soft-orange) / 0.1)" />
        </svg>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide">
                  FOR COFFEE SHOPS
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Why coffee shops<br />
                <span className="text-primary">love Stamivo</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Everything you need to build customer loyalty and grow your business
              </p>
            </div>
          </ScrollReveal>

          {/* Barista Hero Image */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-xl mx-auto mb-16">
              <div className="relative">
                {/* Decorative background */}
                <div className="absolute inset-0 bg-gradient-to-br from-coffee-dark/20 to-primary/20 rounded-full blur-3xl scale-110" />
                <img 
                  src={BaristaIllustration} 
                  alt="Barista preparing coffee with passion" 
                  className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-3xl"
                />
                {/* Floating coffee cup decoration */}
                <img 
                  src={CoffeeCupIcon} 
                  alt="Coffee cup" 
                  className="absolute -top-6 -right-6 w-16 h-16 opacity-40 rotate-12 animate-bounce hidden md:block"
                  style={{ animationDuration: '2.5s' }}
                />
              </div>
            </div>
          </ScrollReveal>

          <div className="max-w-7xl mx-auto">
            {/* First Row - Alternating Large Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ScrollReveal delay={0.1}>
                <div className="group relative bg-gradient-to-br from-primary/5 to-soft-orange/10 rounded-3xl p-8 md:p-10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-6 transition-transform">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                      Digital loyalty that actually works
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Seamless experience on web and mobile app. Your customers can track stamps anywhere, anytime.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="group relative bg-gradient-to-br from-soft-orange/10 to-accent/10 rounded-3xl p-8 md:p-10 border-2 border-soft-orange/30 hover:border-soft-orange/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-soft-orange/10 rounded-full blur-2xl group-hover:bg-soft-orange/20 transition-all" />
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-soft-orange to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg -rotate-3 group-hover:-rotate-6 transition-transform">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                      Turn visitors into regulars
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Reward loyalty automatically. Watch first-time customers become your biggest fans.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Second Row - Three Compact Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <ScrollReveal delay={0.3}>
                <div className="group relative bg-white/60 backdrop-blur rounded-3xl p-6 md:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-success to-forest-green rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Coffee className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground">
                    Customize everything
                  </h4>
                  <p className="text-muted-foreground">
                    Your stamps, your rewards, your brand. Make it uniquely yours.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="group relative bg-white/60 backdrop-blur rounded-3xl p-6 md:p-8 border-2 border-soft-orange/20 hover:border-soft-orange/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-soft-orange rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground">
                    Insights at a glance
                  </h4>
                  <p className="text-muted-foreground">
                    Track visits, rewards, and trends with a beautiful dashboard.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.5}>
                <div className="group relative bg-white/60 backdrop-blur rounded-3xl p-6 md:p-8 border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent to-soft-orange rounded-xl mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-foreground">
                    Ready in minutes
                  </h4>
                  <p className="text-muted-foreground">
                    Simple setup wizard gets you rewarding customers today.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Paper Cards vs Stamivo Comparison */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-0 w-64 h-64 bg-soft-orange/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-semibold tracking-wide">
                  THE OLD WAY vs THE NEW WAY
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                Paper cards vs <span className="text-primary">Stamivo</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See why coffee shops are ditching paper for digital
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Paper Cards Column */}
              <ScrollReveal delay={0.1}>
                <div className="relative bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl p-8 md:p-10 border-2 border-muted backdrop-blur">
                  {/* Torn paper effect on top */}
                  <div className="absolute -top-3 left-0 right-0 h-6 bg-muted/50" style={{
                    clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)"
                  }} />
                  
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-2xl mb-4 opacity-50">
                      <Coffee className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-muted-foreground mb-2">Paper Cards</h3>
                    <p className="text-sm text-muted-foreground/70">The traditional approach</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Cards get lost or damaged",
                      "Takes up counter space",
                      "No customer data or insights",
                      "Easy to forge or cheat",
                      "Customers forget to bring them",
                      "Expensive to print and replace",
                      "No way to track effectiveness"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                          <span className="text-destructive text-lg font-bold leading-none">×</span>
                        </div>
                        <p className="text-muted-foreground line-through">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Stamivo Column */}
              <ScrollReveal delay={0.2}>
                <div className="relative bg-gradient-to-br from-primary/10 via-soft-orange/10 to-accent/10 rounded-3xl p-8 md:p-10 border-2 border-primary/30 shadow-2xl backdrop-blur">
                  {/* Shine effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
                  
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-soft-orange rounded-2xl mb-4 shadow-lg">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Stamivo</h3>
                    <p className="text-sm text-primary font-semibold">The modern solution</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Always accessible on phone or web",
                      "Zero physical clutter",
                      "Rich customer insights & analytics",
                      "Secure digital verification",
                      "Always in their pocket",
                      "One-time setup, infinite use",
                      "Track ROI and engagement"
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4 text-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <p className="text-foreground font-medium">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Call to action badge */}
                  <div className="mt-8 pt-8 border-t border-primary/20">
                    <div className="text-center">
                      <p className="text-sm text-primary font-semibold mb-2">✨ Make the switch today</p>
                      <p className="text-xs text-muted-foreground">Join hundreds of coffee shops already using Stamivo</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Bottom stat callout */}
            <ScrollReveal delay={0.3}>
              <div className="mt-12 text-center">
                <div className="inline-block bg-gradient-to-r from-primary/10 via-soft-orange/10 to-primary/10 rounded-2xl px-8 py-4 border border-primary/20">
                  <p className="text-lg font-semibold text-foreground">
                    <span className="text-primary text-2xl">90%</span> of customers prefer digital loyalty over paper cards
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product Showcase with Device Mockups */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-cream-beige/30 relative overflow-hidden">
        {/* Decorative Coffee Cup */}
        <img 
          src={CoffeeCupIcon} 
          alt="Coffee cup decoration" 
          className="absolute top-20 right-10 w-32 h-32 opacity-20 rotate-12 hidden lg:block"
        />
        
        <div className="container mx-auto px-4">
          {/* Hero Image with Woman Holding Phone */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto mb-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                    Your rewards,<br />
                    <span className="text-primary">always in your pocket</span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    Beautiful, intuitive interface designed for coffee lovers. Track all your loyalty cards in one place.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Mobile & Web</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-sm font-medium">Easy to Use</span>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 relative">
                  <div className="relative">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-soft-orange/30 to-primary/30 rounded-full blur-3xl scale-110" />
                    <img 
                      src={WoodenTray} 
                      alt="Woman using Stamivo app on phone" 
                      className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-soft-orange/5 via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-soft-orange/10 rounded-full blur-3xl" />
        </div>
        
        {/* Decorative Wooden Tray */}
        <img 
          src={WoodenTray} 
          alt="Wooden tray decoration" 
          className="absolute bottom-10 left-10 w-48 h-48 opacity-15 rotate-[-15deg] hidden xl:block"
        />
        
        {/* Decorative Coffee Beans */}
        <img 
          src={CoffeeBeans} 
          alt="Coffee beans decoration" 
          className="absolute top-20 right-20 w-32 h-32 opacity-20 rotate-45 hidden xl:block"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Loved by coffee shops<br />
                <span className="text-primary">& customers</span>
              </h2>
              <p className="text-xl text-muted-foreground">Real stories from our community</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Stamivo has transformed how we reward our regulars. Customer engagement is up 40% and they love not carrying paper cards!",
                name: "Maria Chen",
                role: "Owner, The Daily Grind",
                location: "Seattle, WA",
                avatar: "MC",
                color: "from-primary to-coffee-dark"
              },
              {
                quote: "Finally, all my coffee rewards in one place! The animations are so satisfying when you complete a card. Best loyalty app I've used.",
                name: "James Porter",
                role: "Coffee Enthusiast",
                location: "Portland, OR",
                avatar: "JP",
                color: "from-soft-orange to-accent"
              },
              {
                quote: "Setup took less than 10 minutes. Our customers are already asking about it and our repeat visit rate is through the roof!",
                name: "Sofia Martinez",
                role: "Manager, Bean There Café",
                location: "San Francisco, CA",
                avatar: "SM",
                color: "from-success to-forest-green"
              }
            ].map((testimonial, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <Card 
                  className="group hover:scale-105 transition-all duration-500 hover:shadow-2xl bg-white/90 backdrop-blur border-2 hover:border-primary/30"
                >
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-soft-orange text-soft-orange" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-card-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* How to Get Started Timeline */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background via-cream-beige/20 to-background relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-soft-orange/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-6">
                <p className="text-sm font-bold text-primary uppercase tracking-wide">Get Started in Minutes</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                From setup to first scan in<br />
                <span className="text-primary">3 simple steps</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Launch your digital loyalty program faster than brewing a cup of coffee
              </p>
            </div>
          </ScrollReveal>

          {/* Timeline - Horizontal on desktop, vertical on mobile */}
          <div className="max-w-6xl mx-auto">
            {/* Desktop Timeline */}
            <div className="hidden md:block relative">
              {/* Connecting line */}
              <div className="absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-primary/20 via-soft-orange/30 to-primary/20 rounded-full">
                <div className="h-full bg-gradient-to-r from-primary via-soft-orange to-primary rounded-full animate-pulse" style={{ width: '0%', animation: 'expandWidth 2s ease-out forwards' }} />
              </div>

              <div className="grid grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    step: "01",
                    title: "Create Your Shop",
                    description: "Set up your coffee shop profile with logo, hours, and location in under 5 minutes",
                    icon: Coffee,
                    delay: 0.1,
                    color: "from-primary to-coffee-dark"
                  },
                  {
                    step: "02",
                    title: "Customize Your Program",
                    description: "Design your stamp card, set rewards, and choose how many stamps customers need",
                    icon: Star,
                    delay: 0.3,
                    color: "from-soft-orange to-primary"
                  },
                  {
                    step: "03",
                    title: "Start Scanning",
                    description: "Share your unique QR code and watch customer loyalty grow automatically",
                    icon: Zap,
                    delay: 0.5,
                    color: "from-success to-forest-green"
                  }
                ].map((item) => (
                  <ScrollReveal key={item.step} delay={item.delay}>
                    <div className="group text-center">
                      {/* Step circle with icon */}
                      <div className="relative mx-auto w-32 h-32 mb-6">
                        {/* Outer ring with gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500`} />
                        
                        {/* Inner circle */}
                        <div className="absolute inset-2 bg-white rounded-full shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-500">
                          <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}>
                            <item.icon className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Step number badge */}
                        <div className={`absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {item.step}
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Mobile Timeline - Vertical */}
            <div className="md:hidden space-y-8">
              {[
                {
                  step: "01",
                  title: "Create Your Shop",
                  description: "Set up your coffee shop profile with logo, hours, and location in under 5 minutes",
                  icon: Coffee,
                  delay: 0.1,
                  color: "from-primary to-coffee-dark"
                },
                {
                  step: "02",
                  title: "Customize Your Program",
                  description: "Design your stamp card, set rewards, and choose how many stamps customers need",
                  icon: Star,
                  delay: 0.2,
                  color: "from-soft-orange to-primary"
                },
                {
                  step: "03",
                  title: "Start Scanning",
                  description: "Share your unique QR code and watch customer loyalty grow automatically",
                  icon: Zap,
                  delay: 0.3,
                  color: "from-success to-forest-green"
                }
              ].map((item, index, array) => (
                <ScrollReveal key={item.step} delay={item.delay}>
                  <div className="relative">
                    {/* Connecting line for mobile */}
                    {index < array.length - 1 && (
                      <div className="absolute left-8 top-24 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-soft-orange/30 to-primary/30 rounded-full translate-y-8" />
                    )}

                    <div className="flex gap-6 relative z-10">
                      {/* Icon circle */}
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16">
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-full opacity-20`} />
                          <div className="absolute inset-1 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                            {item.step}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Bottom CTA */}
            <ScrollReveal delay={0.6}>
              <div className="mt-16 text-center">
                <div className="inline-block bg-gradient-to-r from-primary/10 via-soft-orange/10 to-primary/10 rounded-2xl px-8 py-6 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <p className="text-lg font-semibold text-foreground mb-2">
                    ⏱️ Average setup time: <span className="text-primary text-xl">7 minutes</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Most shops go live the same day they sign up
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA - Premium & Confident */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-soft-orange/10 to-primary/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-96 h-96 bg-soft-orange/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <AnimatedCoffeeIcon size="md" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
                Start building loyalty<br />
                <span className="text-primary">today.</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of coffee lovers and shop owners already using Stamivo. 
                It's free to get started, and setup takes less than 10 minutes.
              </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setShowModal(true)}
                size="lg"
                className="group text-2xl px-16 py-10 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 bg-primary hover:bg-primary/90"
              >
                Create Free Shop Account
                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                onClick={() => setShowModal(true)}
                size="lg"
                variant="outline"
                className="text-2xl px-16 py-10 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 hover:border-primary/50 bg-white/80 backdrop-blur"
              >
                Try as a Customer
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              ✓ No credit card required  •  ✓ Free forever plan available  •  ✓ Cancel anytime
            </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <UserTypeModal open={showModal} onOpenChange={setShowModal} />
      
      <Footer />
    </div>
  );
}
