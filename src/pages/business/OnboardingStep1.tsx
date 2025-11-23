import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from "lucide-react";

interface OnboardingStep1Props {
  formData: {
    businessType: string;
    businessSize: string;
    dailyCustomers: number;
    hasLoyalty: string;
  };
  updateFormData: (data: Partial<OnboardingStep1Props["formData"]>) => void;
  onNext: () => void;
}

export default function OnboardingStep1({
  formData,
  updateFormData,
  onNext,
}: OnboardingStep1Props) {
  const canProceed = formData.businessType && formData.businessSize && formData.hasLoyalty;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Business Basics</h2>
        <p className="text-muted-foreground text-lg">
          Tell us a bit about your business
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <div className="space-y-3">
          <Label htmlFor="business-type" className="text-lg font-medium">
            Business type
          </Label>
          <Select
            value={formData.businessType}
            onValueChange={(value) => updateFormData({ businessType: value })}
          >
            <SelectTrigger id="business-type" className="h-12 text-base">
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coffee-shop">Coffee Shop</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="juice-bar">Juice Bar</SelectItem>
              <SelectItem value="cafe">Café</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="business-size" className="text-lg font-medium">
            Business size
          </Label>
          <Select
            value={formData.businessSize}
            onValueChange={(value) => updateFormData({ businessSize: value })}
          >
            <SelectTrigger id="business-size" className="h-12 text-base">
              <SelectValue placeholder="How many people work at your business?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo owner</SelectItem>
              <SelectItem value="small">{"<5 staff"}</SelectItem>
              <SelectItem value="medium">5–20 staff</SelectItem>
              <SelectItem value="large">20+ staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium">
            How many daily customers?
          </Label>
          <div className="pt-2">
            <Slider
              value={[formData.dailyCustomers]}
              onValueChange={(value) =>
                updateFormData({ dailyCustomers: value[0] })
              }
              max={500}
              min={10}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>10</span>
              <span className="font-semibold text-foreground text-lg">
                {formData.dailyCustomers} customers/day
              </span>
              <span>500+</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-medium">
            Does your shop currently use a loyalty scheme?
          </Label>
          <RadioGroup
            value={formData.hasLoyalty}
            onValueChange={(value) => updateFormData({ hasLoyalty: value })}
          >
            <div className="flex items-center space-x-3 bg-secondary/50 p-4 rounded-lg">
              <RadioGroupItem value="yes" id="loyalty-yes" />
              <Label htmlFor="loyalty-yes" className="cursor-pointer text-base font-normal flex-1">
                Yes, we have one
              </Label>
            </div>
            <div className="flex items-center space-x-3 bg-secondary/50 p-4 rounded-lg">
              <RadioGroupItem value="no" id="loyalty-no" />
              <Label htmlFor="loyalty-no" className="cursor-pointer text-base font-normal flex-1">
                No, this will be our first
              </Label>
            </div>
          </RadioGroup>
        </div>
      </Card>

      <div className="flex justify-end">
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
