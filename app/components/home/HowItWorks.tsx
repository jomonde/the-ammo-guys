import { CheckCircle2, Target, Zap, BarChart2, Shield } from 'lucide-react';

const features = [
  {
    icon: <Target className="h-8 w-8 text-accent" />,
    title: "Set Your Targets",
    description: "Choose your preferred calibers and set your target quantities for each. We'll help you build your stockpile methodically."
  },
  {
    icon: <Zap className="h-8 w-8 text-accent" />,
    title: "Automatic Shipments",
    description: "Based on your budget and preferences, we'll automatically ship ammo to help you reach your stockpile goals."
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-accent" />,
    title: "Track & Manage",
    description: "Monitor your stockpile levels, track your progress, and adjust your targets as needed through our easy-to-use dashboard."
  },
  {
    icon: <Shield className="h-8 w-8 text-accent" />,
    title: "Stay Prepared",
    description: "Never worry about ammo shortages or price spikes again. Your stockpile ensures you're always ready to train and protect."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How The Stockpile Model Works</h2>
          <p className="text-lg text-gray-600">
            Our innovative approach to ammunition management ensures you always have what you need, when you need it.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Stockpile Model?</h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Traditional ammo buying is reactive. Our stockpile model is proactive, ensuring you're always prepared without overpaying or hoarding.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                "No more panic buying",
                "Better prices through consistent purchasing",
                "Always have what you need for training"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
