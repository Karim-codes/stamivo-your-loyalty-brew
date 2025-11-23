import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

interface OnboardingStep4Props {
  formData: any;
  onNext: () => void;
  onBack: () => void;
}

export default function OnboardingStep4({
  formData,
  onNext,
  onBack,
}: OnboardingStep4Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Preview</h2>
        <p className="text-muted-foreground text-lg">
          Here's how everything looks
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shop Profile */}
        <Card className="p-6">
          <h3 className="font-bold text-xl mb-4">Your Shop Profile</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{formData.shopName || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium">{formData.shopAddress || "Not set"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business Type:</span>
              <span className="font-medium capitalize">
                {formData.businessType?.replace("-", " ") || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hours:</span>
              <span className="font-medium">{formData.openingHours || "Not set"}</span>
            </div>
          </div>
        </Card>

        {/* Loyalty Program */}
        <Card className="p-6">
          <h3 className="font-bold text-xl mb-4">Loyalty Program</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stamps needed:</span>
              <span className="font-medium">{formData.stampsRequired}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reward:</span>
              <span className="font-medium">{formData.rewardDescription || "Not set"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {formData.multipleScans && (
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-xs">Multiple scans</span>
                </div>
              )}
              {formData.autoVerify && (
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-xs">Auto-verify</span>
                </div>
              )}
              {formData.publicShop && (
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-xs">Public</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Customer View Preview */}
        <Card className="p-6 md:col-span-2">
          <h3 className="font-bold text-xl mb-4">Customer-Facing View</h3>
          <div className="bg-muted/30 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{formData.shopName || "Your Shop"}</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.shopAddress || "Your address"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.coffeeTypes?.join(", ") || "Coffee types"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: formData.stampsRequired || 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-lg"
                >
                  {i < 2 ? "☕" : ""}
                </div>
              ))}
            </div>
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-sm font-medium text-success">
                🎉 {formData.rewardDescription || "Your reward description"}
              </p>
            </div>
          </div>
        </Card>

        {/* QR Code Placeholder */}
        <Card className="p-6 md:col-span-2 text-center">
          <h3 className="font-bold text-xl mb-4">Your QR Code</h3>
          <div className="bg-muted/30 rounded-lg p-8 inline-block">
            <div className="w-48 h-48 bg-card border-4 border-foreground flex items-center justify-center">
              <p className="text-muted-foreground">QR Code Preview</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Customers will scan this to collect stamps
          </p>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline" size="lg" className="px-8 text-lg">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back
        </Button>
        <Button onClick={onNext} size="lg" className="px-8 text-lg">
          Looks good → Continue
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
