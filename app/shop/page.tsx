import ProductCard from '@/components/products/ProductCard';

const products = [
  {
    id: 1,
    name: '9mm FMJ',
    description: '115 grain Full Metal Jacket',
    price: 16.99,
    image: '/images/9mm-fmj.jpg',
    caliber: '9mm',
    inStock: true,
  },
  {
    id: 2,
    name: '5.56 NATO',
    description: '55 grain FMJ',
    price: 9.99,
    image: '/images/556-fmj.jpg',
    caliber: '5.56/.223',
    inStock: true,
  },
  {
    id: 3,
    name: '.22LR',
    description: '40 grain Lead Round Nose',
    price: 4.99,
    image: '/images/22lr.jpg',
    caliber: '.22LR',
    inStock: true,
  },
  {
    id: 4,
    name: '9mm JHP',
    description: '124 grain Jacketed Hollow Point',
    price: 22.99,
    image: '/images/9mm-jhp.jpg',
    caliber: '9mm',
    inStock: true,
  },
  {
    id: 5,
    name: '.223 Remington',
    description: '62 grain FMJ',
    price: 10.99,
    image: '/images/223-rem.jpg',
    caliber: '5.56/.223',
    inStock: true,
  },
  {
    id: 6,
    name: '.22LR HP',
    description: '38 grain Hollow Point',
    price: 5.99,
    image: '/images/22lr-hp.jpg',
    caliber: '.22LR',
    inStock: false,
  },
];

export default function ShopPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shop Ammunition</h1>
      
      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filter by Caliber</h2>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded-full">All</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">9mm</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">5.56/.223</button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">.22LR</button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
