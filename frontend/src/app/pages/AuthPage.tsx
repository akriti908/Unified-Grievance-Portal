import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, AlertCircle, Phone, MapPin, Shield } from 'lucide-react';
import { LegalModal } from '../components/legal-modal';

const API = "http://localhost:5000";

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginInitial = location.pathname === '/login' || !location.pathname.includes('signup');
  const [isLogin, setIsLogin] = useState(isLoginInitial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [role, setRole] = useState('citizen');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [loginError, setLoginError] = useState('');

  React.useEffect(() => {
    if (location.pathname === '/terms') {
      setModalTitle("Terms of Service");
      setIsModalOpen(true);
    } else if (location.pathname === '/privacy') {
      setModalTitle("Privacy Policy");
      setIsModalOpen(true);
    }
  }, [location.pathname]);

  const openModal = (title: string) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');

  try {
    if (isLogin) {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message || "Login failed");
        return;
      }

      // ✅ STORE EVERYTHING PROPERLY
      localStorage.setItem('ugp_current_user', JSON.stringify(data));
      localStorage.setItem('role', data.role);
      localStorage.setItem('contact', data.phone);
      localStorage.setItem('ugp_user_name', data.name);

      navigate('/dashboard');

    } else {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          location: locationInput,
          role,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message || "Signup failed");
        return;
      }

      // ✅ STORE EVERYTHING PROPERLY
      localStorage.setItem('ugp_current_user', JSON.stringify(data));
      localStorage.setItem('role', data.role);
      localStorage.setItem('contact', data.phone);
      localStorage.setItem('ugp_user_name', data.name);

      navigate('/dashboard');
    }

  } catch (err) {
    setLoginError('Server error. Backend not running?');
  }
};

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 relative">
      <LegalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle} 
      />
      {/* Logo Link back to Home */}
      <Link to="/" className="text-3xl font-bold text-[#1E40AF] mb-8 hover:opacity-80 transition-opacity">
        UGP
      </Link>

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-[#E2E8F0] overflow-hidden"
      >
        <div className="p-8">
          <div className="flex mb-8 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => {
                setIsLogin(true);
                setLoginError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => {
                setIsLogin(false);
                setLoginError('');
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white text-[#1E40AF] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin 
                ? 'Access your grievance dashboard to track progress.' 
                : 'Join UGP to start lodging and tracking grievances efficiently.'}
            </p>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
            >
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="tel" 
                        required
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] outline-none transition-all"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        required
                        placeholder="City, State"
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] outline-none transition-all"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 ml-1">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        required
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] outline-none transition-all appearance-none cursor-pointer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="citizen">Citizen</option>
                        <option value="admin">Admin</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-[#1E40AF] hover:underline">Forgot password?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1E40AF] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e3a8a] transition-all shadow-lg shadow-blue-200 mt-6"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="bg-[#F8FAFC] p-6 text-center border-t border-[#E2E8F0]">
          <p className="text-xs text-gray-500 leading-relaxed">
            By continuing, you agree to our{' '}
            <button 
              onClick={() => openModal("Terms of Service")} 
              className="text-[#1E40AF] font-semibold hover:underline cursor-pointer"
            >
              Terms of Service
            </button> and{' '}
            <button 
              onClick={() => openModal("Privacy Policy")} 
              className="text-[#1E40AF] font-semibold hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>.
          </p>
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 max-w-md w-full flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100"
      >
        <AlertCircle size={20} className="text-[#1E40AF] shrink-0 mt-0.5" />
        <p className="text-xs text-[#1E40AF]/80 leading-relaxed">
          <strong>Note:</strong> This is a secure government portal. Unauthorized access or falsification of information is strictly prohibited under legal statutes.
        </p>
      </motion.div>
    </div>
  );
};