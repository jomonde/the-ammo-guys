'use client';

import { Slider } from '../../../../components/ui/slider';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip';

type BudgetSetupProps = {
  monthlyBudget: number;
  onBudgetChange: (budget: number) => void;
};

export function BudgetSetup({ monthlyBudget, onBudgetChange }: BudgetSetupProps) {
  const BUDGET_RANGES = [
    { min: 25, max: 100, label: 'Casual Shooter' },
    { min: 100, max: 250, label: 'Regular Shooter' },
    { min: 250, max: 500, label: 'Enthusiast' },
    { min: 500, max: 1000, label: 'Dedicated Marksman' },
  ];

  const getBudgetRangeLabel = (budget: number) => {
    const range = BUDGET_RANGES.find(
      (range) => budget >= range.min && budget <= range.max
    );
    return range ? range.label : 'Custom';
  };

  const handleSliderChange = (value: number[]) => {
    onBudgetChange(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onBudgetChange(Math.min(Math.max(value, 25), 1000));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Your Monthly Budget</CardTitle>
          <CardDescription>
            How much would you like to spend on ammo each month?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="monthly-budget">Monthly Budget</Label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">${monthlyBudget}</span>
                <span className="text-sm text-muted-foreground">
                  /month • {getBudgetRangeLabel(monthlyBudget)}
                </span>
              </div>
            </div>
            
            <div className="px-2">
              <Slider
                id="monthly-budget"
                min={25}
                max={1000}
                step={5}
                value={[monthlyBudget]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>$25</span>
                <span>$1,000+</span>
              </div>
            </div>
            
            <div className="pt-2">
              <Label htmlFor="custom-amount" className="text-sm">
                Or enter a custom amount:
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="25"
                  max="10000"
                  step="5"
                  value={monthlyBudget}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Budget Range</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Budget Range Info</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choose a range that matches your shooting habits</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm font-medium">Monthly Cost</span>
            </div>
            
            <div className="space-y-2">
              {BUDGET_RANGES.map((range) => (
                <div
                  key={range.label}
                  className={`flex items-center justify-between p-3 rounded-md border ${
                    monthlyBudget >= range.min && monthlyBudget <= range.max
                      ? 'border-primary bg-primary/5'
                      : 'border-muted'
                  }`}
                  onClick={() => onBudgetChange(range.min)}
                >
                  <div>
                    <p className="font-medium">{range.label}</p>
                    <p className="text-sm text-muted-foreground">
                      ${range.min} - ${range.max}/month
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      ${range.min} - ${range.max}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(range.min / 0.5)} - {Math.floor(range.max / 0.5)} rounds
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Budget Estimate</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Monthly Budget:</span>
            <span className="font-medium">${monthlyBudget}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Rounds/Month:</span>
            <span className="font-medium">~{Math.floor(monthlyBudget / 0.5)} rounds</span>
          </div>
          <div className="flex justify-between pt-2 mt-2 border-t border-muted-foreground/20">
            <span className="font-medium">Yearly Total:</span>
            <span className="font-bold">${(monthlyBudget * 12).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
