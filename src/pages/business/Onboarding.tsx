import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import OnboardingStep4 from "./OnboardingStep4";
import OnboardingStep5 from "./OnboardingStep5";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    businessType: "",
    businessSize: "",
    dailyCustomers: 50,
    hasLoyalty: "",
    // Step 2
    shopName: "",
    shopAddress: "",
    shopLogo: "",
    openingHours: "",
    coffeeTypes: [] as string[],
    rewardType: "",
    // Step 3
    stampsRequired: 5,
    rewardDescription: "",
    multipleScans: false,
    autoVerify: true,
    publicShop: true,
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Stamivo</h1>
            <span className="text-muted-foreground">
              Step {currentStep} of 5
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <OnboardingStep1
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <OnboardingStep2
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <OnboardingStep3
              formData={formData}
              updateFormData={updateFormData}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <OnboardingStep4
              formData={formData}
              onNext={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 5 && (
            <OnboardingStep5
              onSignUp={() => {
                // In a real app, this would handle signup
                // For now, just navigate to a placeholder
                navigate("/business/dashboard");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
