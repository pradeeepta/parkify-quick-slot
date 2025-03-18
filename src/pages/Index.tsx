
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Clock, Shield, User, Settings } from 'lucide-react';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl page-animation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary/10 text-primary border-primary/20">
                Smart Parking Solution
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Find and book parking slots <span className="text-primary">effortlessly</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                A modern solution for managing parking spaces with intuitive booking, real-time availability, and seamless user experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-md">
                  <Link to="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-md">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl opacity-30 blur-3xl"></div>
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg overflow-hidden p-1">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1590674899484-13d6c4f74ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                    alt="Parking garage"
                    className="w-full h-64 md:h-80 object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 md:px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Smart Features for Smart Parking
            </h2>
            <p className="text-muted-foreground">
              Our system combines elegant design with powerful functionality to make parking management simple.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white border rounded-lg p-6 transition-all hover:shadow-md hover:-translate-y-1 duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">
              Our simple 3-step process makes parking hassle-free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative"
              >
                <div className="bg-white border rounded-lg p-6 h-full flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-6 text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="max-w-3xl mx-auto text-center text-white space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to transform your parking experience?
              </h2>
              <p className="text-blue-100 text-lg">
                Join thousands of users who have simplified their parking management
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-4">
                <Link to="/register">
                  Get Started For Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-semibold text-lg">Parkify</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Parkify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: 'Real-Time Availability',
    description: 'See available slots instantly and book them with a single click.',
    icon: Clock
  },
  {
    title: 'Secure Authentication',
    description: 'Strong user authentication system keeps your account safe and secure.',
    icon: Shield
  },
  {
    title: 'User-Friendly Management',
    description: 'Easy-to-use interface for managing your bookings and parking history.',
    icon: User
  },
  {
    title: 'Admin Controls',
    description: 'Comprehensive tools for administrators to manage all aspects of the system.',
    icon: Settings
  },
  {
    title: 'Fair Penalty System',
    description: 'Transparent penalty system ensures everyone follows the rules.',
    icon: Check
  },
  {
    title: 'Smart Notifications',
    description: 'Get notified when your booking is about to expire to avoid penalties.',
    icon: Clock
  }
];

const steps = [
  {
    title: 'Find a Slot',
    description: 'Browse available parking slots in real-time on our intuitive dashboard.'
  },
  {
    title: 'Book Your Spot',
    description: 'Select your desired time slot and confirm your booking with just a few clicks.'
  },
  {
    title: 'Park & Release',
    description: 'Park your vehicle during your booked time and remember to release the slot when done.'
  }
];

export default Index;
