import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, User, LogOut } from 'lucide-react';

export const Navbar = () => {
  const currentUser = localStorage.getItem('ugp_current_user');
  let parsedUser = null;

try {
  parsedUser = currentUser ? JSON.parse(currentUser) : null;
} catch (err) {
  console.error("Invalid JSON in localStorage");
  parsedUser = null;
}

  const userName = parsedUser?.name || localStorage.getItem('ugp_user_name') || 'Guest User';
  const userRole = parsedUser?.role || 'citizen';
  const Initials = (userName || "User").toString().trim().split(' ').filter((n: string) => n.length > 0).map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  return (
    <nav className="h-16 bg-white border-b border-[#E2E8F0] fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-2xl font-bold text-[#1E40AF]">UGP</Link>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search grievances..." 
            className="bg-[#F8FAFC] border-none rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-[#1E40AF]/20 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-gray-500">
              {userRole === 'admin' ? 'Admin account' : 'Citizen account'}
            </p>
          </div>
          <div className="w-10 h-10 bg-[#1E40AF]/10 text-[#1E40AF] rounded-full flex items-center justify-center font-bold">
            {Initials}
          </div>
        </div>
        <Link 
          to="/" 
          onClick={() => localStorage.removeItem('ugp_user_name')}
          className="p-2 text-gray-500 hover:text-[#EF4444] transition-colors"
        >
          <LogOut size={20} />
        </Link>
      </div>
    </nav>
  );
};
