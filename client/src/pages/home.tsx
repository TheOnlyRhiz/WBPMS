import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, UserCheck, Verified, MessageSquare, Shield, Eye, Star } from "lucide-react";
import { Helmet } from 'react-helmet';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Park Management System - Nigerian Transport Safety</title>
        <meta name="description" content="The Park Management System brings transparency and security to Nigerian motor parks through digital verification and management. Verify your driver before boarding." />
        <meta property="og:title" content="Park Management System - Nigerian Transport Safety" />
        <meta property="og:description" content="Ensure your safety by verifying drivers and vehicles before boarding at Nigerian motor parks." />
      </Helmet>

      <div className="relative">
        {/* Hero Section with Background Image */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
                Safe Nigerian 
                <span className="block text-yellow-400">Transport</span>
                <span className="block">Management</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Bringing transparency, security, and peace of mind to Nigerian motor parks through digital verification and professional management
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/verify">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Shield className="mr-2 h-5 w-5" />
                    Verify Vehicle Now
                  </Button>
                </Link>
                <Link href="/feedback">
                  <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Share Feedback
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">100+</div>
                  <div className="text-sm md:text-base text-gray-300">Verified Drivers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">50+</div>
                  <div className="text-sm md:text-base text-gray-300">Registered Vehicles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">500+</div>
                  <div className="text-sm md:text-base text-gray-300">Safe Journeys</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the difference with our comprehensive transport management solution
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <UserCheck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4 text-gray-900">Verified Drivers</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Every driver undergoes thorough verification with valid licenses, background checks, and professional training certification.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 2 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4 text-gray-900">Instant Verification</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Quick plate number lookup provides immediate access to driver credentials and vehicle safety records.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 3 */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4 text-gray-900">Quality Feedback</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Rate your experience and help maintain high service standards through our comprehensive feedback system.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Trust Indicators */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                  Trusted by Passengers Nationwide
                </h3>
                <p className="text-gray-600">
                  Join thousands of Nigerians who travel safely every day
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Safety Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">5★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
                  <div className="text-gray-600">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
              backgroundSize: "20px 20px"
            }}></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Ready to Experience Safe Travel?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Start your journey with confidence. Verify drivers, provide feedback, and contribute to safer transportation across Nigeria.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/verify">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-10 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Eye className="mr-2 h-5 w-5" />
                  Start Verification
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-10 py-4 text-lg rounded-full transition-all duration-300">
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
