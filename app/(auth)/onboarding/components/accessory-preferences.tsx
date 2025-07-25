'use client';

import { Checkbox } from '../../../../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '../../../../lib/supabase/client';
import { Skeleton } from '../../../../components/ui/skeleton';

import { Product } from './caliber-selection';

interface AccessoryPreferencesProps {
  selectedAccessories: string[];
  onUpdateAccessories: (accessories: string[]) => void;
}

export function AccessoryPreferences({ selectedAccessories, onUpdateAccessories }: AccessoryPreferencesProps) {
  const supabase = createClient();

  const { data: accessories = [], isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['accessories'],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, category, image_url, price, stock, created_at, updated_at')
        .neq('category', 'ammunition')
        .order('category')
        .order('name');

      if (error) {
        console.error('Error fetching accessories:', error);
        throw error;
      }
      return data || [];
    },
  });

  const toggleAccessory = (accessoryId: string) => {
    if (selectedAccessories.includes(accessoryId)) {
      onUpdateAccessories(selectedAccessories.filter(id => id !== accessoryId));
    } else {
      onUpdateAccessories([...selectedAccessories, accessoryId]);
    }
  };

  // Group accessories by category with type safety
  const accessoriesByCategory = (accessories as Product[]).reduce<Record<string, Product[]>>((acc, accessory) => {
    if (!accessory.category) return acc;
    
    if (!acc[accessory.category]) {
      acc[accessory.category] = [];
    }
    acc[accessory.category].push(accessory);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center space-x-3 p-4 border rounded-lg">
                  <Skeleton className="h-5 w-5 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accessory Preferences</CardTitle>
          <CardDescription>
            Select any accessories you'd like to include in your shipments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(accessoriesByCategory).map(([category, categoryAccessories]) => (
            // Skip empty categories or non-array values
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-medium capitalize">{category || 'Uncategorized'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryAccessories.map((accessory) => (
                  <div
                    key={accessory.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${
                      selectedAccessories.includes(accessory.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleAccessory(accessory.id)}
                  >
                    <Checkbox
                      id={`accessory-${accessory.id}`}
                      checked={selectedAccessories.includes(accessory.id)}
                      onCheckedChange={() => toggleAccessory(accessory.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`accessory-${accessory.id}`}
                        className="font-medium leading-none cursor-pointer"
                      >
                        {accessory.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {accessory.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {accessories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No accessories available at the moment.
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAccessories.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Selected Accessories</h3>
          <div className="space-y-2">
            {selectedAccessories.map((accessoryId) => {
              const accessory = accessories.find(a => a.id === accessoryId);
              if (!accessory) return null;
              
              return (
                <div key={accessoryId} className="flex justify-between items-center p-2 hover:bg-muted/30 rounded">
                  <span>{accessory.name}</span>
                  <span className="text-sm text-muted-foreground capitalize">{accessory.category}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
