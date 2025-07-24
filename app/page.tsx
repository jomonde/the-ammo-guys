import { HeroSection } from './components/home/HeroSection';
import { HowItWorks } from './components/home/HowItWorks';
import { ShopAndSubscribe } from './components/home/ShopAndSubscribe';
import { CallToAction } from './components/home/CallToAction';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      <HowItWorks />
      
      <ShopAndSubscribe />
      
      <CallToAction />
      
      {/* Trust Badge */}
      <div className="bg-white shadow-lg -mt-8 mx-auto max-w-md rounded-lg p-4 text-center z-10 relative -mb-8">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">🇺🇸</span>
          <span className="font-bold text-gray-800">Proudly Veteran Owned & Operated</span>
        </div>
      </div>
    </main>
  );
}
