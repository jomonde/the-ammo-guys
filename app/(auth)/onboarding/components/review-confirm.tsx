'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { useState } from 'react';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FormData {
  calibers: Array<{ id: string; name: string; selected: boolean; monthlyAmount: number }>;
  monthlyBudget: number;
  accessories: string[];
  shippingAddress: Address;
}

type ReviewAndConfirmProps = {
  formData: FormData;
  onUpdateShippingAddress: (address: Address) => void;
};

export function ReviewAndConfirm({ formData, onUpdateShippingAddress }: ReviewAndConfirmProps) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState<Address>({...formData.shippingAddress});

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShippingAddress(address);
  };

  const handleSaveAddress = () => {
    onUpdateShippingAddress(address);
    setIsEditingAddress(false);
  };

  const totalMonthlyBudget = formData.calibers.reduce(
    (sum, caliber) => sum + (caliber.monthlyAmount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Selections</CardTitle>
          <CardDescription>
            Please review your information before completing your setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selected Calibers */}
          <div>
            <h3 className="font-medium mb-3">Selected Calibers</h3>
            <div className="border rounded-lg divide-y">
              {formData.calibers.map((caliber) => (
                <div key={caliber.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{caliber.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${caliber.monthlyAmount.toFixed(2)}/month
                    </p>
                  </div>
                  <span className="text-muted-foreground">
                    ~{Math.floor(caliber.monthlyAmount / 0.5)} rounds/month
                  </span>
                </div>
              ))}
              <div className="p-4 bg-muted/30 flex justify-between font-medium">
                <span>Total Monthly Budget:</span>
                <span>${totalMonthlyBudget.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Shipping Address</h3>
              {isEditingAddress ? (
                <div className="flex space-x-2">
                  <Button type="submit">
                    Save Address
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setAddress({...formData.shippingAddress});
                      setIsEditingAddress(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditingAddress(true)}
                >
                  Edit Address
                </Button>
              )}
            </div>

            {isEditingAddress ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleAddressChange}
                      disabled={!isEditingAddress}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      disabled
                    />
                  </div>
                </div>
              </form>
            ) : (
              <Card className="p-4">
                <div className="space-y-1">
                  <p className="font-medium">{address.street}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="pt-4 border-t">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1"
                required
              />
              <Label htmlFor="terms" className="text-sm leading-normal">
                I agree to the Terms of Service and Privacy Policy. I understand that my subscription will automatically 
                renew each month and that I can modify or cancel at any time.
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly Subscription</span>
            <span>${formData.monthlyBudget.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Tax</span>
            <span>${(formData.monthlyBudget * 0.08).toFixed(2)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-muted-foreground/20 flex justify-between font-medium">
            <span>First Month Total</span>
            <span>${(formData.monthlyBudget * 1.08).toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Subsequent months: ${formData.monthlyBudget.toFixed(2)}/month + tax
          </p>
        </div>
      </div>
    </div>
  );
}
