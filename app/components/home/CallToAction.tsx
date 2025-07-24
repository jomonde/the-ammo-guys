import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Your Stockpile?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of shooters who trust The Ammo Guys to keep them prepared.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="bg-white text-primary hover:bg-gray-100 font-semibold text-lg px-8 py-4 rounded-lg transition-all hover:shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              href="/demo" 
              className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all"
            >
              See How It Works
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-white/80">
            No credit card required to start. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
