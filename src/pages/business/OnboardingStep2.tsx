import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(formData.shopLogo || "");
  
  const canProceed = formData.shopName && formData.shopAddress;

  const toggleCoffeeType = (type: string) => {
    const current = formData.coffeeTypes || [];
    if (current.includes(type)) {
      updateFormData({ coffeeTypes: current.filter((t) => t !== type) });
    } else {
      updateFormData({ coffeeTypes: [...current, type] });
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      updateFormData({ shopLogo: result });
      toast({
        title: "Logo uploaded",
        description: "Your shop logo has been uploaded successfully",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeLogo = () => {
    setLogoPreview("");
    updateFormData({ shopLogo: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <Label className="text-lg font-medium">Shop logo (optional)</Label>
          {logoPreview ? (
            <div className="relative border-2 border-border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <img 
                    src={logoPreview} 
                    alt="Shop logo preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Logo uploaded</p>
                  <p className="text-sm text-muted-foreground">Your shop logo is ready</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeLogo}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary hover:bg-accent/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
              <div className="flex flex-col items-center">
                {isDragging ? (
                  <ImageIcon className="w-12 h-12 mb-4 text-primary animate-bounce" />
                ) : (
                  <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                )}
                <p className="text-muted-foreground font-medium mb-1">
                  {isDragging ? "Drop your image here" : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
          )}
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
