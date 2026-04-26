import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Star, CheckCircle, BarChart3, Settings, Users, Shield, FileText, AlertTriangle } from 'lucide-react';

export const Sidebar = () => {
  // Get user role from localStorage
  const currentUser = localStorage.getItem('ugp_current_user');
  const userRole = currentUser ? JSON.parse(currentUser).role : 'citizen';

  // Admin menu items
  const adminMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'All Grievances', icon: List, path: '/dashboard/all' },
    { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
  ];

  // Citizen menu items
  const citizenMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Lodge Grievance', icon: PlusCircle, path: '/dashboard/lodging' },
    { name: 'My Grievances', icon: List, path: '/dashboard/my-grievances' },
    { name: 'Track Status', icon: CheckCircle, path: '/dashboard/status' },
    { name: 'Pending Reviews', icon: Star, path: '/dashboard/pending-reviews' },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : citizenMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] h-screen fixed left-0 top-16 overflow-y-auto">
      <div className="p-4">
        {/* Role Badge */}
        <div className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2">
            <Shield size={16} className={userRole === 'admin' ? 'text-purple-600' : 'text-blue-600'} />
            <span className={`text-xs font-semibold uppercase tracking-wide ${userRole === 'admin' ? 'text-purple-700' : 'text-blue-700'}`}>
              {userRole === 'admin' ? 'Admin Portal' : 'Citizen Portal'}
            </span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-blue-50 text-[#1E40AF]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {userRole === 'admin' ? 'System' : 'Account'}
          </h4>
          {userRole === 'admin' && (
            <NavLink
              to="/dashboard/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all font-medium"
            >
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>
          )}
          <NavLink
            to="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 transition-all font-medium"
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};