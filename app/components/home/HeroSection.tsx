import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 to-primary-dark text-white py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-repeat opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-accent text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
            The Smart Way to Stockpile Ammo
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Build Your Ammo Stockpile<br />
            <span className="text-accent">The Smart Way</span>
          </h1>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Never be caught off guard again. Our smart stockpile system helps you build and maintain your ammo supply
            with automatic shipments based on your needs and budget.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-accent hover:bg-accent/90 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:scale-105"
            >
              Start Your Stockpile
            </Link>
            <Link 
              href="#how-it-works" 
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-lg px-8 py-4 rounded-lg border border-white/20 transition-all hover:shadow-lg"
            >
              How It Works
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-4xl mx-auto pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">1. Set</div>
              <p className="text-sm text-gray-300">Choose your calibers and set your targets</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">2. Save</div>
              <p className="text-sm text-gray-300">Build your stockpile with automatic shipments</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">3. Shoot</div>
              <p className="text-sm text-gray-300">Always have what you need, when you need it</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
