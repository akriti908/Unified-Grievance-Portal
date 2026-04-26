import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const LegalModal = ({ isOpen, onClose, title }: LegalModalProps) => {
  const text = title === "Privacy Policy" 
    ? "We collect information you provide directly to us when you create an account or lodge a grievance, including your name, email, and contact details. Our AI systems process your grievance content to categorize and route them to appropriate departments. This processing is automated to improve efficiency. Your data is shared only with relevant government departments and authorized personnel; we do not sell your personal data to third parties. We use enterprise-grade security to protect your information, but users should avoid sharing unnecessary sensitive details. By using this portal, you consent to this data processing and storage in accordance with our security protocols."
    : "By accessing the Unified Grievance Portal (UGP), you agree to these terms and all applicable laws. You are responsible for providing accurate and truthful information; falsification of grievances may lead to account suspension or legal action. The UGP uses AI for initial processing, and while we strive for accuracy, automated categorizations are subject to human review. You may not use the portal to harass officials, submit spam, or attempt to breach security. Automated bots are strictly prohibited. We reserve the right to modify these terms at any time, and continued use of the platform constitutes acceptance of those changes.";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="font-bold text-[#1F2937]">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                {text}
              </p>
              <button 
                onClick={onClose}
                className="w-full mt-8 bg-[#1E40AF] text-white py-3 rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
