import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface OnboardingStep3Props {
  formData: {
    stampsRequired: number;
    rewardDescription: string;
    multipleScans: boolean;
    autoVerify: boolean;
    publicShop: boolean;
  };
  updateFormData: (data: Partial<OnboardingStep3Props["formData"]>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function OnboardingStep3({
  formData,
  updateFormData,
  onNext,
  onBack,
}: OnboardingStep3Props) {
  const canProceed = formData.rewardDescription;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Loyalty Program Setup</h2>
        <p className="text-muted-foreground text-lg">
          Define how your stamp system works
        </p>
      </div>

      <Card className="p-8 space-y-8">
        <div className="space-y-4">
          <Label className="text-lg font-medium">
            Number of stamps required
          </Label>
          <div className="pt-2">
            <Slider
              value={[formData.stampsRequired]}
              onValueChange={(value) =>
                updateFormData({ stampsRequired: value[0] })
              }
              max={10}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>3</span>
              <span className="font-bold text-foreground text-2xl">
                {formData.stampsRequired} stamps
              </span>
              <span>10</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="reward-desc" className="text-lg font-medium">
            Reward description
          </Label>
          <Input
            id="reward-desc"
            value={formData.rewardDescription}
            onChange={(e) =>
              updateFormData({ rewardDescription: e.target.value })
            }
            placeholder="e.g. Get a free coffee of your choice!"
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Allow multiple scans per visit
              </Label>
              <p className="text-sm text-muted-foreground">
                Customers can scan once per visit
              </p>
            </div>
            <Switch
              checked={formData.multipleScans}
              onCheckedChange={(checked) =>
                updateFormData({ multipleScans: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Auto-verify reward redemptions
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically approve when customers redeem
              </p>
            </div>
            <Switch
              checked={formData.autoVerify}
              onCheckedChange={(checked) =>
                updateFormData({ autoVerify: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                Show shop publicly on the app
              </Label>
              <p className="text-sm text-muted-foreground">
                Let customers discover your shop
              </p>
            </div>
            <Switch
              checked={formData.publicShop}
              onCheckedChange={(checked) =>
                updateFormData({ publicShop: checked })
              }
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-muted/50 border-2 border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground mb-4">
            Customer preview:
          </p>
          <div className="bg-card rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Your Coffee Shop</h3>
                <p className="text-sm text-muted-foreground">
                  Collect {formData.stampsRequired} stamps
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: formData.stampsRequired }).map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center"
                >
                  {i < 3 ? "☕" : ""}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">{formData.rewardDescription}</p>
          </div>
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
