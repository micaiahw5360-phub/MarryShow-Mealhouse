import { useState } from 'react';
import { useCartStore } from '../context/cartStore';
import { useCategories, useItems } from '../hooks/useMenuData';
import Button from '../components/ui/Button';
import Card, { CardBody, CardFooter } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const addToCart = useCartStore((state) => state.addItem);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: items, isLoading: itemsLoading, error } = useItems(selectedCategory || undefined);

  if (categoriesLoading || itemsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">Failed to load menu. Please try again later.</div>;
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg transition ${!selectedCategory ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition ${selectedCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
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