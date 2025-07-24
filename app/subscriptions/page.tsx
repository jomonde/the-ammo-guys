import { CheckCircleIcon } from '@heroicons/react/24/solid';

const benefits = [
  'Never run out of ammunition',
  'Save up to 20% on every order',
  'Free shipping on all subscription orders',
  'Easily modify or cancel anytime',
  'Priority customer support',
];

const subscriptionTiers = [
  {
    name: 'Basic',
    boxes: '1-5',
    discount: '10%',
    price: 'Save 10%',
    popular: false,
  },
  {
    name: 'Pro',
    boxes: '6-10',
    discount: '15%',
    price: 'Save 15%',
    popular: true,
  },
  {
    name: 'Elite',
    boxes: '11+',
    discount: '20%',
    price: 'Save 20%',
    popular: false,
  },
];

export default function SubscriptionsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Ammo Subscription Plans</h1>
        <p className="text-xl text-gray-600 mb-8">
          Never run out of ammo and save money with our subscription service. Choose your plan and get
          your ammunition delivered on your schedule.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Why Subscribe?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              tier.popular ? 'ring-2 ring-primary' : ''
            }`}
          >
            {tier.popular && (
              <div className="bg-primary text-white text-center py-1 text-sm font-semibold">
                MOST POPULAR
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className="text-gray-600 mb-4">
                {tier.boxes} {tier.boxes === '1-5' ? 'box' : 'boxes'} per shipment
              </p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.discount}</span>
                <span className="text-gray-600"> discount</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>{tier.boxes} boxes per shipment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>{tier.discount} off every order</span>
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span>Free shipping</span>
                </li>
              </ul>
              <a
                href="/shop"
                className={`block w-full text-center py-3 px-4 rounded-md font-medium ${
                  tier.popular
                    ? 'bg-primary hover:bg-primary-dark text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Choose {tier.name}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Choose Your Ammo</h3>
            <p className="text-gray-600">Select from our premium selection of ammunition.</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">Set Your Schedule</h3>
            <p className="text-gray-600">Choose how often you want your ammo delivered.</p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Save & Shoot</h3>
            <p className="text-gray-600">Enjoy your ammo and the savings that come with it.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
