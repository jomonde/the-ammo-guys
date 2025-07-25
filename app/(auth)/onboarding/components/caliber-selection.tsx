'use client';

// Using relative imports to avoid module resolution issues
import { Checkbox } from '../../../../components/ui/checkbox';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CaliberPreference {
  id: string;
  name: string;
  selected: boolean;
  monthlyAmount: number;
}

interface CaliberSelectionProps {
  selectedCalibers: CaliberPreference[];
  onUpdateCalibers: (calibers: CaliberPreference[]) => void;
}

export function CaliberSelection({ selectedCalibers, onUpdateCalibers }: CaliberSelectionProps) {
  const supabase = createClient();

  const { data: calibers = [], isLoading } = useQuery({
    queryKey: ['calibers'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'ammunition')
        .order('name');

      if (error) throw error;
      return (data as Product[]) || [];
    },
  });

  const handleCaliberToggle = (caliber: Product, checked: boolean) => {
    if (checked) {
      // Add caliber to selected calibers if not already selected
      if (!selectedCalibers.some(c => c.id === caliber.id)) {
        onUpdateCalibers([
          ...selectedCalibers,
          { 
            id: caliber.id, 
            name: caliber.name, 
            selected: true, 
            monthlyAmount: 0 
          },
        ]);
      }
    } else {
      // Remove caliber from selected calibers
      onUpdateCalibers(selectedCalibers.filter((c) => c.id !== caliber.id));
    }
  };

  const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>, caliberId: string) => {
    const amount = parseFloat(e.target.value) || 0;
    onUpdateCalibers(
      selectedCalibers.map((caliber) =>
        caliber.id === caliberId
          ? { ...caliber, monthlyAmount: amount }
          : caliber
      )
    );
  };

  if (isLoading) {
    return <div>Loading calibers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(calibers) && calibers.map((caliber) => {
          const isSelected = selectedCalibers.some((c) => c.id === caliber.id);
          const monthlyAmount = selectedCalibers.find((c) => c.id === caliber.id)?.monthlyAmount || 0;
          
          return (
            <Card
              key={caliber.id}
              className={`cursor-pointer transition-colors ${
                isSelected ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => handleCaliberToggle(caliber, !isSelected)}
            >
              <CardHeader className="p-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`caliber-${caliber.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCaliberToggle(caliber, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label htmlFor={`caliber-${caliber.id}`} className="text-lg font-medium">
                    {caliber.name}
                  </Label>
                </div>
                {caliber.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {caliber.description}
                  </p>
                )}
              </CardHeader>
              {isSelected && (
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <Label htmlFor={`amount-${caliber.id}`} className="text-sm">
                      Monthly budget (${monthlyAmount.toFixed(2)})
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={monthlyAmount}
                        onChange={(e) => handleMonthlyAmountChange(e, caliber.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-24"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      
      {selectedCalibers.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Selected Calibers</h3>
          <ul className="space-y-2">
            {selectedCalibers.map((caliber) => (
              <li key={caliber.id} className="flex justify-between items-center">
                <span>{caliber.name}</span>
                <span className="font-medium">${caliber.monthlyAmount.toFixed(2)}/month</span>
              </li>
            ))}
            <li className="flex justify-between items-center pt-2 mt-2 border-t border-muted-foreground/20">
              <span className="font-medium">Total Monthly Budget:</span>
              <span className="font-bold">
                ${selectedCalibers.reduce((sum, caliber) => sum + (caliber.monthlyAmount || 0), 0).toFixed(2)}
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
