import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Gift, Smartphone, Store, Zap, Clock, TrendingUp, Settings, HeadphonesIcon, Star } from "lucide-react";
import { UserTypeModal } from "@/components/UserTypeModal";
import CoffeeCup3D from "@/components/CoffeeCup3D";

export default function Landing() {
  const [showModal, setShowModal] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background">
      {/* Hero Section with 3D Animation */}
      <section className="container mx-auto px-4 py-12 md:py-20 text-center">
        <div className="max-w-6xl mx-auto">
          {/* 3D Coffee Cup */}
          <div className="mb-8 animate-fade-in">
            <CoffeeCup3D />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in leading-tight">
            Collect stamps. Earn free coffee.<br />
            <span className="text-primary">Join the loyalty revolution.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Stamivo makes loyalty simple for customers and effortless for coffee shops.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setShowModal(true)}
              size="lg"
              className="text-xl px-12 py-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
            <Button
              onClick={scrollToHowItWorks}
              size="lg"
              variant="outline"
              className="text-xl px-12 py-8 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 md:py-32">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          How it works
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Three simple steps to start earning free coffee
        </p>
        
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 hover:border-primary/50">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:animate-bounce">
                <Smartphone className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Scan & Collect</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Scan the shop's QR code after ordering your drink. Every scan earns you a stamp.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 hover:border-accent/50 md:mt-8">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-accent to-caramel rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:animate-bounce">
                <Coffee className="w-12 h-12 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Track Your Progress</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Watch your digital stamp card fill up with fun animations and celebrate each milestone.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 hover:border-success/50">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-success to-accent rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:animate-bounce">
                <Gift className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-card-foreground">Redeem Your Reward</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Get your free drink or reward once your card is complete. It's that simple!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For Coffee Shops Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              For Coffee Shops —<br />
              <span className="text-primary">More Loyalty, Zero Hassle</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build customer loyalty and grow your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Easy Digital Stamps</h3>
                <p className="text-muted-foreground">
                  Quick QR scans replace old paper cards. Simple for you and your customers.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Cleaner Counter</h3>
                <p className="text-muted-foreground">
                  No more lost or damaged paper cards cluttering your space.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Faster Repeat Customers</h3>
                <p className="text-muted-foreground">
                  Digital rewards keep customers coming back more often.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Customizable Rewards</h3>
                <p className="text-muted-foreground">
                  Set your own stamp requirements, rewards, and redemption rules.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Simple Dashboard</h3>
                <p className="text-muted-foreground">
                  Track customer visits, popular rewards, and loyalty trends at a glance.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-4">
                  <HeadphonesIcon className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-card-foreground">24/7 Support</h3>
                <p className="text-muted-foreground">
                  We're always here to help you make the most of Stamivo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
          Loved by coffee shops & customers
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          See what our community has to say
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "Stamivo has transformed how we reward our regulars. No more lost cards, and customers love the digital experience!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-card-foreground">The Daily Grind</p>
                  <p className="text-sm text-muted-foreground">Seattle, WA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "I finally have all my coffee rewards in one place! The animations are so satisfying when you complete a card."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-accent">SJ</span>
                </div>
                <div>
                  <p className="font-bold text-card-foreground">Sarah Johnson</p>
                  <p className="text-sm text-muted-foreground">Coffee Enthusiast</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "Setup took less than 10 minutes. Our customers are already asking about it and engagement is through the roof!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-bold text-card-foreground">Bean There Café</p>
                  <p className="text-sm text-muted-foreground">Portland, OR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mobile App Preview Section */}
      <section className="bg-gradient-to-br from-accent/5 to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Your rewards,<br />
                <span className="text-primary">always in your pocket</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Track all your stamp cards, scan QR codes, and redeem rewards from one beautiful mobile experience.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground text-lg">Real-time stamp tracking with fun animations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground text-lg">Quick QR scanner built right in</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground text-lg">Celebrate rewards with delightful popups</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] p-8 shadow-2xl">
                <div className="bg-card rounded-[2.5rem] p-6 shadow-xl">
                  <div className="space-y-6">
                    {/* Mockup Header */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-card-foreground mb-2">My Stamp Cards</h3>
                      <p className="text-muted-foreground">3 active rewards</p>
                    </div>
                    
                    {/* Mockup Cards */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 border-2 border-primary/20">
                        <p className="font-bold text-card-foreground mb-2">The Daily Grind</p>
                        <div className="flex gap-2 mb-2">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-8 h-8 rounded-lg ${
                                i < 6 ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">6/8 stamps • 2 more for free coffee!</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-accent/10 to-success/10 rounded-2xl p-4 border-2 border-accent/20">
                        <p className="font-bold text-card-foreground mb-2">Bean There Café</p>
                        <div className="flex gap-2 mb-2">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-lg ${
                                i < 10 ? "bg-accent" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-success font-bold">🎉 Reward ready!</p>
                      </div>
                    </div>
                    
                    {/* Mockup CTA */}
                    <Button className="w-full py-6 text-lg rounded-xl">
                      <Smartphone className="mr-2" />
                      Scan QR Code
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Ready to unlock<br />
            <span className="text-primary">your free coffees?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of coffee lovers and shop owners already using Stamivo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setShowModal(true)}
              size="lg"
              className="text-2xl px-16 py-8 rounded-full shadow-xl hover:scale-110 transition-all duration-300 bg-primary hover:bg-primary/90"
            >
              Get Started Free
            </Button>
            <Button
              onClick={() => setShowModal(true)}
              size="lg"
              variant="outline"
              className="text-2xl px-16 py-8 rounded-full shadow-xl hover:scale-110 transition-all duration-300"
            >
              For Coffee Shops
            </Button>
          </div>
        </div>
      </section>

      <UserTypeModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
