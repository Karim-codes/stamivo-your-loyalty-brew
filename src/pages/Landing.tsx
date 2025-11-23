import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Smartphone, Star, TrendingUp, Zap, BarChart3, ArrowRight } from "lucide-react";
import { UserTypeModal } from "@/components/UserTypeModal";
import ParticleBackground from "@/components/ParticleBackground";
import AnimatedCoffeeIcon from "@/components/AnimatedCoffeeIcon";
import ScrollReveal from "@/components/ScrollReveal";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

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
          <div className="max-w-6xl mx-auto text-center">
            {/* Animated Coffee Icon with Steam */}
            <div className="mb-8 animate-fade-in flex justify-center">
              <AnimatedCoffeeIcon size="lg" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your new digital stamp card —<br />
              <span className="text-primary">earn free coffee effortlessly.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Stamivo helps coffee shops grow loyal customers with one simple scan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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
        </div>
      </section>

      {/* Story-Driven How It Works */}
      <section id="how-it-works" className="relative py-20 md:py-32 bg-gradient-to-b from-background to-cream-beige/30">
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
            <div className="text-center mb-20">
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

      {/* Product Showcase with Device Mockups */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-cream-beige/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Your rewards,<br />
                <span className="text-primary">always in your pocket</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Beautiful, intuitive interface designed for coffee lovers
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Mockup 1: Stamp Card */}
            <ScrollReveal delay={0.1}>
              <div className="group hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-primary/10 to-soft-orange/10 rounded-[3rem] p-6 shadow-xl group-hover:shadow-2xl">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-card-foreground">The Daily Grind</p>
                      <p className="text-sm text-muted-foreground">Downtown Seattle</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl ${
                            i < 6 
                              ? "bg-gradient-to-br from-primary to-coffee-dark shadow-md" 
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-primary">6/8 stamps</p>
                      <p className="text-xs text-muted-foreground">2 more for free coffee! ☕</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">Track Progress</p>
            </div>
            </ScrollReveal>

            {/* Mockup 2: QR Scanner */}
            <ScrollReveal delay={0.2}>
              <div className="group hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-soft-orange/10 to-accent/10 rounded-[3rem] p-6 shadow-xl group-hover:shadow-2xl">
                <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] p-6 shadow-lg aspect-[9/16] flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-4 border-white rounded-2xl mb-4 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-xl"></div>
                    </div>
                  </div>
                  <p className="text-white font-bold text-lg mb-2">Scan QR Code</p>
                  <p className="text-gray-300 text-sm text-center">Align code within frame</p>
                </div>
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">Quick Scan</p>
            </div>
            </ScrollReveal>

            {/* Mockup 3: Reward Unlocked */}
            <ScrollReveal delay={0.3}>
              <div className="group hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-[3rem] p-6 shadow-xl group-hover:shadow-2xl">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="text-7xl animate-bounce">🎉</div>
                    <div>
                      <p className="text-2xl font-bold text-success mb-2">Congratulations!</p>
                      <p className="text-lg font-bold text-foreground">Card Complete</p>
                    </div>
                    <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl p-4">
                      <p className="text-sm text-muted-foreground mb-2">Your Reward</p>
                      <p className="text-xl font-bold text-primary">Free Coffee ☕</p>
                    </div>
                    <Button className="w-full bg-success hover:bg-success/90">
                      Redeem Now
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-center mt-4 font-semibold text-foreground">Celebrate Rewards</p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-soft-orange/5 via-background to-primary/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-soft-orange/10 rounded-full blur-3xl" />
        </div>
        
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

      {/* FAQ Section */}
      <FAQSection />

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
    </div>
  );
}
