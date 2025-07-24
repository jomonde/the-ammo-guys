'use client';

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real app, you would send this data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'There was an error sending your message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12">
          Have questions? We're here to help. Fill out the form below or reach out directly.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            
            {submitStatus && (
              <div 
                className={`p-4 mb-6 rounded-md ${
                  submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Product Questions">Product Questions</option>
                  <option value="Subscription Help">Subscription Help</option>
                  <option value="Wholesale">Wholesale Inquiries</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <EnvelopeIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Email Us</h3>
                    <a href="mailto:info@theammoguys.com" className="text-primary hover:underline">
                      info@theammoguys.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <PhoneIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Call Us</h3>
                    <a href="tel:+18005551234" className="text-primary hover:underline">
                      (800) 555-1234
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9am-5pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Visit Us</h3>
                    <p className="text-gray-700">
                      123 Patriot Way<br />
                      Libertyville, TX 12345
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      *Showroom by appointment only
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Stay up to date with the latest products, special offers, and news from The Ammo Guys.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-primary focus:border-primary"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
