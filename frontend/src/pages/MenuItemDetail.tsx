import { useState, useEffect } from 'react';  // ADDED useEffect
import { useParams, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Heart, Clock, Leaf, Flame, Star } from 'lucide-react';
import { itemsService } from '../services/api';   // ADDED (replaces menuItems import)

export function MenuItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // REPLACED: const item = menuItems.find((i) => i.id === id);
  const [item, setItem] = useState(null);        // ADDED
  const [loading, setLoading] = useState(true);  // ADDED

  useEffect(() => {                               // ADDED
    if (id) {
      itemsService.getItem(parseInt(id)).then(data => {
        setItem(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const itemIsFavorite = item ? isFavorite(item.id) : false;

  // ADDED loading and not‑found checks
  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!item) return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Item not found</h2>
      <Button onClick={() => navigate('/menu')}>Back to Menu</Button>
    </div>
  );

  const calculatePrice = () => {
    let price = item.price;
    item.options?.forEach((option) => {
      const selectedValueId = selectedOptions[option.id];
      const selectedValue = option.values.find((v) => v.id === selectedValueId);
      if (selectedValue) {
        price += selectedValue.priceModifier;
      }
    });
    return price * quantity;
  };

  const handleAddToCart = () => {
    if (item.options && item.options.length > 0) {
      const allOptionsSelected = item.options.every((option) => selectedOptions[option.id]);
      if (!allOptionsSelected) {
        toast.error('Please select all options');
        return;
      }
    }

    addItem(item, quantity, {});   // CHANGED: was addItem(item, quantity, selectedOptions)
    toast.success(`Added ${quantity} ${item.name}${quantity > 1 ? 's' : ''} to cart!`);
    navigate('/menu');
  };

  const handleToggleFavorite = () => {
    if (item) {
      toggleFavorite(item.id);
      toast.success(itemIsFavorite ? 'Removed from favorites' : 'Added to favorites!');
    }
  };

  const nutritionalInfo = {
    calories: '450',
    protein: '25g',
    carbs: '35g',
    fat: '18g',
  };

  const allergens = ['Dairy', 'Gluten', 'Eggs'];
  const prepTime = '10-15 min';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/menu')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Menu
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${itemIsFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#074af2] text-white">{item.category}</Badge>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Nutritional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#074af2]">{nutritionalInfo.calories}</p>
                    <p className="text-sm text-gray-600">Calories</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#074af2]">{nutritionalInfo.protein}</p>
                    <p className="text-sm text-gray-600">Protein</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#074af2]">{nutritionalInfo.carbs}</p>
                    <p className="text-sm text-gray-600">Carbs</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#074af2]">{nutritionalInfo.fat}</p>
                    <p className="text-sm text-gray-600">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Additional Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">Prep Time: {prepTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-sm">Allergens: {allergens.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Made with locally sourced ingredients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">4.8 rating (127 reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <div className="sticky top-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
            <p className="text-gray-600 mb-6">{item.description}</p>

            <div className="mb-6">
              <p className="text-3xl font-bold text-[#074af2]">${calculatePrice().toFixed(2)}</p>
              {quantity > 1 && (
                <p className="text-sm text-gray-600">
                  ${item.price.toFixed(2)} each
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {item.options && item.options.length > 0 && (
              <div className="space-y-6 mb-6">
                <h3 className="font-bold text-lg">Customize Your Order</h3>
                {item.options.map((option) => (
                  <div key={option.id} className="space-y-3">
                    <Label className="text-base font-medium">{option.name}</Label>
                    <RadioGroup
                      value={selectedOptions[option.id] || ''}
                      onValueChange={(value) =>
                        setSelectedOptions({ ...selectedOptions, [option.id]: value })
                      }
                    >
                      {option.values.map((value) => (
                        <div key={value.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={value.id} id={value.id} />
                          <Label htmlFor={value.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{value.name}</span>
                            {value.priceModifier > 0 && (
                              <span className="text-sm text-gray-600 ml-2">
                                +${value.priceModifier.toFixed(2)}
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-6" />

            <div className="space-y-4">
              <Label className="text-base font-medium">Quantity</Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full mt-6 h-12 text-lg"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${calculatePrice().toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}