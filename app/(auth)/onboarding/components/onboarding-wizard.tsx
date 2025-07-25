'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Progress } from '../../../../components/ui/progress';
import { CaliberSelection } from './caliber-selection';
import { BudgetSetup } from './budget-setup';
import { AccessoryPreferences } from './accessory-preferences';
import { ReviewAndConfirm } from './review-confirm';

const STEPS = [
  { id: 'caliber', title: 'Select Calibers' },
  { id: 'budget', title: 'Set Budget' },
  { id: 'accessories', title: 'Accessory Preferences' },
  { id: 'review', title: 'Review & Confirm' },
];

export interface CaliberPreference {
  id: string;
  name: string;
  selected: boolean;
  monthlyAmount: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FormData {
  calibers: CaliberPreference[];
  monthlyBudget: number;
  accessories: string[];
  shippingAddress: ShippingAddress;
}

export function OnboardingWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    calibers: [],
    monthlyBudget: 100,
    accessories: [],
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep === STEPS.length - 1) {
      await handleSubmit();
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Save the user's preferences and complete onboarding
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = useCallback(<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ): void => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Helper function to update nested shipping address fields
  const updateShippingAddress = useCallback((address: ShippingAddress): void => {
    setFormData((prev: FormData) => ({
      ...prev,
      shippingAddress: address,
    }));
  }, []);

  const renderStep = () => {
    const step = STEPS[currentStep];
    if (!step) return null;

    switch (step.id) {
      case 'caliber':
        return (
          <CaliberSelection
            selectedCalibers={formData.calibers}
            onUpdateCalibers={(calibers) => updateFormData('calibers', calibers)}
          />
        );
      case 'budget':
        return (
          <BudgetSetup
            monthlyBudget={formData.monthlyBudget}
            onBudgetChange={(budget) => updateFormData('monthlyBudget', budget)}
          />
        );
      case 'accessories':
        return (
          <AccessoryPreferences
            selectedAccessories={formData.accessories}
            onUpdateAccessories={(accessories) => updateFormData('accessories', accessories)}
          />
        );
      case 'review':
        return (
          <ReviewAndConfirm
            formData={formData}
            onUpdateShippingAddress={(address) => updateFormData('shippingAddress', address)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium">Step {currentStep + 1} of {STEPS.length}</h2>
        <p className="text-sm text-gray-500">{STEPS[currentStep].title}</p>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>
            {currentStep === 0 && 'Select the calibers you want to stockpile'}
            {currentStep === 1 && 'Set your monthly budget for ammo purchases'}
            {currentStep === 2 && 'Choose any additional accessories you\'re interested in'}
            {currentStep === 3 && 'Review your selections and complete setup'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && formData.calibers.length === 0) ||
              (currentStep === 1 && formData.monthlyBudget <= 0) ||
              isSubmitting
            }
          >
            {isSubmitting ? (
              'Saving...'
            ) : currentStep === STEPS.length - 1 ? (
              'Complete Setup'
            ) : (
              'Next'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
