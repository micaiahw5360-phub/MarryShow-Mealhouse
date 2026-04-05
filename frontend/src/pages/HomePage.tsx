import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl p-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to MarryShow Mealhouse</h1>
        <p className="text-lg md:text-xl mb-6">Fresh, delicious meals for students and staff. Order ahead and pay with your wallet.</p>
        <Link to="/menu">
          <Button size="lg" variant="secondary">Order Now →</Button>
        </Link>
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Burgers', 'Pizza', 'Salads', 'Beverages'].map((cat) => (
            <Card key={cat} hoverable className="text-center p-4">
              <div className="text-3xl mb-2">🍔</div>
              <h3 className="font-semibold">{cat}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* Daily Special */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Today's Special</h2>
        <Card hoverable className="flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/3 bg-gray-200 flex items-center justify-center p-6">
            <span className="text-6xl">🌮</span>
          </div>
          <CardBody className="md:w-2/3">
            <h3 className="text-xl font-bold mb-2">Loaded Tacos</h3>
            <p className="text-gray-600 mb-4">Three soft tacos with seasoned beef, lettuce, cheese, and salsa.</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary-600">$12.99</span>
              <Link to="/menu">
                <Button size="sm">View Menu</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}