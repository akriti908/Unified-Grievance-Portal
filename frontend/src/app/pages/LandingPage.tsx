import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe, MessageSquare, Shield, HelpCircle, Mail, Phone, MapPin, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const LandingPage = () => {
  const [language, setLanguage] = useState('English');
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937]">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-[#1E40AF]">UGP</div>
            <div className="text-xs text-gray-500 hidden sm:block">
              Unified Grievance Portal
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">
                <Globe size={18} />
                <span>{language}</span>
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block overflow-hidden">
                <button 
                  onClick={() => setLanguage('English')}
                  className="w-full text-left px-4 py-2 hover:bg-[#F1F5F9] transition-colors"
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('Hindi')}
                  className="w-full text-left px-4 py-2 hover:bg-[#F1F5F9] transition-colors"
                >
                  हिन्दी
                </button>
              </div>
            </div>
            <Link to="/login" className="text-gray-600 hover:text-[#1E40AF] font-medium">Login</Link>
            <Link to="/signup" className="bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1e3a8a] transition-colors shadow-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1764476751235-82addb009cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwb2ZmaWNlJTIwYnVpbGRpbmclMjBtb2Rlcm58ZW58MXx8fHwxNzcxNTUzMzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-6">
              AI-Powered <span className="text-[#1E40AF]">Grievance</span> Management System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Empowering citizens with efficient, transparent, and AI-driven resolution for a better community experience.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowLearnMore(true)}
                className="bg-[#1E40AF] text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:bg-[#1e3a8a] transition-all"
              >
                Learn More
              </button>
              <Link to="/signup" className="bg-white border-2 border-[#1E40AF] text-[#1E40AF] px-8 py-3 rounded-xl font-semibold text-lg hover:bg-[#1E40AF] hover:text-white transition-all">
                Get Started
              </Link>
            </div>
          </motion.div>
          {/* <div className="hidden md:block">
            <div className="bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-3xl h-[400px] flex items-center justify-center">
               <span className="text-gray-400 font-medium">Dashboard Preview Placeholder</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLearnMore(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#1E40AF] mb-2">Unified Grievance Portal</h2>
                  <p className="text-gray-600">Transforming Public Service Delivery</p>
                </div>
                <button 
                  onClick={() => setShowLearnMore(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">What is UGP?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The Unified Grievance Portal (UGP) is an advanced AI-powered platform designed to revolutionize how citizens interact with government services. Our system provides a seamless, transparent, and efficient mechanism for lodging, tracking, and resolving grievances across all government departments.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="text-[#1E40AF]" size={20} />
                      </div>
                      <h4 className="font-bold">AI-Powered Classification</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Our advanced AI automatically analyzes and categorizes your grievance, routing it to the appropriate department and officer for faster resolution.
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Clock className="text-[#10B981]" size={20} />
                      </div>
                      <h4 className="font-bold">Real-Time Tracking</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Track your grievance status in real-time with instant notifications for every update, ensuring complete transparency throughout the process.
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="text-purple-600" size={20} />
                      </div>
                      <h4 className="font-bold">Secure & Private</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your data is protected with bank-grade encryption and strict privacy protocols, ensuring your information remains confidential.
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Users className="text-[#F59E0B]" size={20} />
                      </div>
                      <h4 className="font-bold">Multi-Department Support</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Access all government departments through a single unified platform, eliminating the need to navigate multiple systems.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-[#1E40AF] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                      <div>
                        <h5 className="font-semibold mb-1">Register & Login</h5>
                        <p className="text-sm text-gray-600">Create your account with basic details and verify your identity through OTP.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-[#1E40AF] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                      <div>
                        <h5 className="font-semibold mb-1">Lodge Your Grievance</h5>
                        <p className="text-sm text-gray-600">Describe your issue in detail with supporting documents. Our AI will automatically categorize and assign priority.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-[#1E40AF] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                      <div>
                        <h5 className="font-semibold mb-1">Track Progress</h5>
                        <p className="text-sm text-gray-600">Monitor your grievance status through your personalized dashboard with real-time updates.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-[#10B981] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                      <div>
                        <h5 className="font-semibold mb-1">Get Resolution</h5>
                        <p className="text-sm text-gray-600">Receive timely resolution with detailed feedback. Rate your experience to help us improve.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#1E40AF] to-[#1e3a8a] p-6 rounded-xl text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={24} />
                    <h3 className="text-xl font-bold">Our Impact</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">50K+</div>
                      <div className="text-sm text-blue-100">Grievances Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">92%</div>
                      <div className="text-sm text-blue-100">Satisfaction Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">72hrs</div>
                      <div className="text-sm text-blue-100">Avg. Resolution Time</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Link 
                    to="/signup" 
                    className="bg-[#1E40AF] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1e3a8a] transition-colors"
                    onClick={() => setShowLearnMore(false)}
                  >
                    Get Started Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* About Us Section */}
      <section className="py-24 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">About UGP</h2>
            <div className="w-20 h-1 bg-[#1E40AF] mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#1E40AF] mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Secure & Private</h3>
              <p className="text-gray-600">Your data is protected with enterprise-grade encryption and strict privacy policies.</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-[#10B981] mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Driven Routing</h3>
              <p className="text-gray-600">Advanced AI automatically categorizes and routes your grievances to the right department.</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-[#F59E0B] mb-6">
                <HelpCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">Track the progress of your grievance in real-time with automatic status updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F8FAFC]" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to common questions about using UGP</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How do I lodge a grievance?", a: "Simply sign up, log in to your dashboard, click on 'Lodge Grievance', describe your issue with supporting documents, and submit. You'll receive a unique tracking ID instantly." },
              { q: "How long does it take to get a resolution?", a: "Standard resolution time is 3-5 working days depending on the priority level." },
              { q: "Can I track my status?", a: "Yes, every grievance is assigned a unique tracking ID visible in your dashboard." },
              { q: "Is this service available 24/7?", a: "The AI system accepts grievances 24/7, though human intervention follows office hours." }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
                <button className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <span className="font-semibold">{item.q}</span>
                  <ChevronDown size={20} className="text-gray-400" />
                </button>
                <div className="p-6 pt-0 text-gray-600 border-t border-gray-50 bg-gray-50/30">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#1E40AF] rounded-[2rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                <p className="text-blue-100 mb-8 text-lg">Have a specific question or need technical support? We're here to help.</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Phone size={20} /></div>
                    <span>+1 (234) 567-890</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Mail size={20} /></div>
                    <span>support@ugp.gov.in</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><MapPin size={20} /></div>
                    <span>123 Governance Plaza, New Delhi</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <form className="space-y-4">
                  <input type="text" placeholder="Your Name" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  <input type="email" placeholder="Your Email" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50" />
                  <textarea rows={4} placeholder="How can we help?" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"></textarea>
                  <button className="w-full bg-white text-[#1E40AF] font-bold py-3 rounded-lg hover:bg-blue-50 transition-colors" type="button">Send Message</button>
                </form>
              </div>
            </div>
            {/* Background design elements */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="text-[#1E40AF] font-bold text-xl">UGP</div>
            <div className="text-xs text-gray-500">Unified Grievance Portal</div>
          </div>
          <div className="flex gap-8 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-[#1E40AF]">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#1E40AF]">Terms of Service</Link>
          </div>
          <div className="text-gray-400 text-sm">
            © 2026 UGP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};