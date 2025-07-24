import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Story</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/3 bg-gray-200 flex items-center justify-center p-8">
              <div className="h-48 w-48 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Founder Photo</span>
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Meet Our Founder</h2>
              <p className="text-gray-700 mb-4">
                My name is John "Ammo" Thompson, a proud Army veteran with over a decade of service. During my time in the military, I learned the importance of reliability, precision, and trust—values that I've brought to The Ammo Guys.
              </p>
              <p className="text-gray-700 mb-6">
                After returning to civilian life, I noticed a gap in the market for high-quality ammunition from a company that truly understands the needs of responsible gun owners. That's why I founded The Ammo Guys—to provide premium ammunition with the same level of excellence and integrity that I demanded during my service.
              </p>
              <div className="flex items-center">
                <div className="h-px bg-gray-300 flex-1"></div>
                <span className="px-4 text-gray-500 font-medium">John "Ammo" Thompson</span>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-lg text-gray-700 mb-6">
              At The Ammo Guys, we're committed to providing our customers with:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  <strong>Premium Quality:</strong> Every round we sell meets the highest industry standards for reliability and performance.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  <strong>Veteran Values:</strong> We operate with the same integrity, discipline, and commitment to excellence that we learned in the military.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  <strong>Community Focus:</strong> We're proud to support veteran organizations and responsible gun ownership initiatives.
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  <strong>Exceptional Service:</strong> Your satisfaction is our top priority. We're here to answer your questions and ensure you get exactly what you need.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-primary text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Our Commitment to Veterans</h2>
          <p className="mb-6">
            As a veteran-owned business, we're committed to giving back to those who've served. A portion of every sale goes to organizations that support veterans' mental health and transition to civilian life.
          </p>
          <p>
            We're also proud to offer special discounts to active military, veterans, and first responders. Thank you for your service!
          </p>
        </div>
      </div>
    </main>
  );
}
