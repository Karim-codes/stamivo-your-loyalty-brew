import { useState, useEffect } from "react";

export interface OnboardingFormData {
  // Step 1
  businessType: string;
  businessSize: string;
  dailyCustomers: number;
  hasLoyalty: string;
  // Step 2
  shopName: string;
  shopAddress: string;
  shopLogo: string;
  openingHours: string;
  coffeeTypes: string[];
  rewardType: string;
  // Step 3
  stampsRequired: number;
  rewardDescription: string;
  multipleScans: boolean;
  autoVerify: boolean;
  publicShop: boolean;
}

const STORAGE_KEY = "stamivo_onboarding_data";

const defaultFormData: OnboardingFormData = {
  businessType: "",
  businessSize: "",
  dailyCustomers: 50,
  hasLoyalty: "",
  shopName: "",
  shopAddress: "",
  shopLogo: "",
  openingHours: "",
  coffeeTypes: [],
  rewardType: "",
  stampsRequired: 5,
  rewardDescription: "",
  multipleScans: false,
  autoVerify: true,
  publicShop: true,
};

export function useOnboardingData() {
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultFormData, ...JSON.parse(stored) };
      } catch (e) {
        console.error("Failed to parse stored onboarding data:", e);
        return defaultFormData;
      }
    }
    return defaultFormData;
  });

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...data };
      // Save to localStorage whenever data changes
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearFormData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(defaultFormData);
  };

  const getFormData = () => {
    return formData;
  };

  return {
    formData,
    updateFormData,
    clearFormData,
    getFormData,
  };
}
