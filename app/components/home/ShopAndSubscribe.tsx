import Link from 'next/link';
import { Package, Zap, Shield } from 'lucide-react';

export function ShopAndSubscribe() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">More Ways to Get Your Ammo</h2>
          <p className="text-lg text-gray-600">
            Whether you're building a stockpile or just need ammo now, we've got you covered.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Shop Now Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-primary p-6 text-white">
              <div className="flex items-center justify-center h-16 w-16 bg-white/20 rounded-full mx-auto mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Shop Now</h3>
              <p className="text-center text-primary-100">
                Need ammo right away? Shop our full selection.
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {[
                  "Wide selection of calibers",
                  "Competitive pricing",
                  "Fast shipping",
                  "No subscription required"
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/shop"
                className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse All Ammo
              </Link>
            </div>
          </div>
          
          {/* Subscribe & Save Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border-2 border-accent/20">
            <div className="bg-gradient-to-r from-accent to-accent/80 p-6 text-white">
              <div className="flex items-center justify-center h-16 w-16 bg-white/20 rounded-full mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Subscribe & Save</h3>
              <p className="text-center text-accent-100">
                Save up to 15% with a subscription.
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                {[
                  "Save on every order",
                  "Flexible delivery schedule",
                  "Pause or cancel anytime",
                  "Early access to sales"
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <div className="h-2 w-2 bg-accent rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link 
                href="/subscriptions"
                className="block w-full text-center bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Learn About Subscriptions
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-16 bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-sm border border-gray-100">
          <div className="text-center
          ">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose The Ammo Guys?</h3>
            <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
              Whether you're building a stockpile, subscribing for convenience, or just buying what you need now,
              we're committed to providing quality ammo, competitive prices, and exceptional service.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              {[
                { title: "Veteran Owned", desc: "Proudly serving the shooting community" },
                { title: "Quality Ammo", desc: "From top manufacturers you trust" },
                { title: "Fast Shipping", desc: "Quick delivery to your door" }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
