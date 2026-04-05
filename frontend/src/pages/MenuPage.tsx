import { useState, useEffect } from 'react';
import { useCartStore } from '../context/cartStore';
import Button from '../components/ui/Button';
import Card, { CardBody, CardFooter } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';
import type { MenuItem, Category } from '../types';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addItem);

  // Mock data - Phase 6 will replace with API call
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Burgers', sort_order: 1 },
        { id: 2, name: 'Pizza', sort_order: 2 },
        { id: 3, name: 'Salads', sort_order: 3 },
      ]);
      setItems([
        { id: 1, name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese', price: 8.99, category_id: 1, image_url: null, is_available: true },
        { id: 2, name: 'Cheeseburger', description: 'Double cheese, pickles, onions', price: 9.99, category_id: 1, image_url: null, is_available: true },
        { id: 3, name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil', price: 12.99, category_id: 2, image_url: null, is_available: true },
        { id: 4, name: 'Caesar Salad', description: 'Romaine, croutons, parmesan, Caesar dressing', price: 7.99, category_id: 3, image_url: null, is_available: true },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category_id === selectedCategory)
    : items;

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    toast.success(`${item.name} added to cart`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition ${!selectedCategory ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition ${selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="flex flex-col">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
            <CardBody className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="text-2xl font-bold text-primary-600">${item.price.toFixed(2)}</div>
            </CardBody>
            <CardFooter>
              <Button onClick={() => handleAddToCart(item)} fullWidth disabled={!item.is_available}>
                {item.is_available ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}