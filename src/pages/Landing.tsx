import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Coffee, Gift, Smartphone, Store } from "lucide-react";
import { UserTypeModal } from "@/components/UserTypeModal";
import mascotImage from "@/assets/coffee-mascot.png";

export default function Landing() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <img
            src={mascotImage}
            alt="Stamivo Coffee Mascot"
            className="w-64 h-64 mx-auto mb-8 object-contain animate-bounce-slow"
          />
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Earn free coffees,<br />one stamp at a time.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            ☕ For customers: Collect stamps, get rewards
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            🏪 For businesses: Build loyalty, grow sales
          </p>
          
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="text-2xl px-12 py-8 rounded-full shadow-lg hover:scale-110 transition-all duration-300 bg-primary hover:bg-primary/90"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-foreground">
          How it works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-8 rounded-3xl shadow-lg hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto">
              <Smartphone className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-card-foreground">1. Visit & Scan</h3>
            <p className="text-muted-foreground text-center text-lg">
              Visit your favorite coffee shop and scan their QR code
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-lg hover:scale-105 transition-all duration-300 md:mt-8">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 mx-auto">
              <Coffee className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-card-foreground">2. Collect Stamps</h3>
            <p className="text-muted-foreground text-center text-lg">
              Each visit earns you a digital stamp on your card
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-lg hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-6 mx-auto">
              <Gift className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-card-foreground">3. Get Rewards</h3>
            <p className="text-muted-foreground text-center text-lg">
              Complete your card and enjoy a free coffee or treat!
            </p>
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary/10 rounded-3xl p-12 max-w-3xl mx-auto border-2 border-primary/20">
          <Store className="w-16 h-16 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Own a coffee shop?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join Stamivo and turn one-time visitors into loyal regulars
          </p>
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            variant="default"
            className="text-xl px-10 py-6 rounded-full"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      <UserTypeModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}
