import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OnboardingStep2Props {
  formData: {
    shopName: string;
    shopAddress: string;
    shopLogo: string;
    openingHours: string;
    coffeeTypes: string[];
    rewardType: string;
  };
  updateFormData: (data: Partial<OnboardingStep2Props["formData"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

const coffeeOptions = [
  "Espresso",
  "Cappuccino",
  "Latte",
  "Americano",
  "Flat White",
  "Mocha",
  "Cold Brew",
  "Pour Over",
];

export default function OnboardingStep2({
  formData,
  updateFormData,
  onNext,
  onBack,
}: OnboardingStep2Props) {
  const canProceed = formData.shopName && formData.shopAddress;

  const toggleCoffeeType = (type: string) => {
    const current = formData.coffeeTypes || [];
    if (current.includes(type)) {
      updateFormData({ coffeeTypes: current.filter((t) => t !== type) });
    } else {
      updateFormData({ coffeeTypes: [...current, type] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Create Your Shop</h2>
        <p className="text-muted-foreground text-lg">
          Let's set up your shop profile
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <div className="space-y-3">
          <Label htmlFor="shop-name" className="text-lg font-medium">
            Shop name
          </Label>
          <Input
            id="shop-name"
            value={formData.shopName}
            onChange={(e) => updateFormData({ shopName: e.target.value })}
            placeholder="e.g. Brew & Bean"
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="shop-address" className="text-lg font-medium">
            Shop address
          </Label>
          <Input
            id="shop-address"
            value={formData.shopAddress}
            onChange={(e) => updateFormData({ shopAddress: e.target.value })}
            placeholder="123 Coffee Street, City"
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lg font-medium">Shop logo</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="opening-hours" className="text-lg font-medium">
            Opening hours
          </Label>
          <Input
            id="opening-hours"
            value={formData.openingHours}
            onChange={(e) => updateFormData({ openingHours: e.target.value })}
            placeholder="e.g. Mon-Fri: 7am-6pm, Sat-Sun: 8am-5pm"
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium">Coffee types you serve</Label>
          <div className="flex flex-wrap gap-2">
            {coffeeOptions.map((type) => (
              <Badge
                key={type}
                variant={
                  formData.coffeeTypes?.includes(type) ? "default" : "outline"
                }
                className="cursor-pointer px-4 py-2 text-base hover:scale-105 transition-all"
                onClick={() => toggleCoffeeType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="reward-type" className="text-lg font-medium">
            Main reward type
          </Label>
          <Input
            id="reward-type"
            value={formData.rewardType}
            onChange={(e) => updateFormData({ rewardType: e.target.value })}
            placeholder="e.g. Free drink of choice"
            className="h-12 text-base"
          />
        </div>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg" className="px-8 text-lg">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
          className="px-8 text-lg"
        >
          Continue
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
