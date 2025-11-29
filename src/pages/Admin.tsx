import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  CreditCard,
  Users,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from 'lucide-react';

import ProjectsManager from '@/components/admin/ProjectsManager';
import RequestsViewer from '@/components/admin/RequestsViewer';
import TransactionsViewer from '@/components/admin/TransactionsViewer';
import UserManagement from '@/components/admin/UserManagement';

const ADMIN_TAB_KEY = 'adminActiveTab';
const ADMIN_COLLAPSED_KEY = 'adminSidebarCollapsed';

const Admin = () => {

  const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem(ADMIN_TAB_KEY);
        return savedTab || 'projects';
    });
  
  const [collapsed, setCollapsed] = useState(() => {
        const savedCollapsed = localStorage.getItem(ADMIN_COLLAPSED_KEY);
        return savedCollapsed === 'true'; 
    });

  useEffect(() => {
        localStorage.setItem(ADMIN_TAB_KEY, activeTab);
    }, [activeTab]);

  useEffect(() => {
        // boolean को string ('true' or 'false') के रूप में सेव करें
        localStorage.setItem(ADMIN_COLLAPSED_KEY, String(collapsed));
    }, [collapsed]);

    
  const menu = [
    { id: 'projects', label: 'Projects', icon: Package },
    { id: 'requests', label: 'Custom Requests', icon: FileText },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col text-black bg-white">

      {/* SIDEBAR */}
      <aside
        className={`
          h-full fixed top-0 left-0
          bg-black/3 backdrop-blur-xl border-r border-black/10 
          flex flex-col justify-between
          transition-all duration-300
          ${collapsed ? 'w-13' : 'w-64'}
        `}
      >

        {/* TOP SECTION */}
        <div>
          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 bg-black text-white p-1 rounded-full shadow-md"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Logo/Header */}
          <div className="flex items-center gap-3 px-4 py-6">
            <LayoutDashboard className="h-7 w-7 text-black" />
            {!collapsed && (
              <h2 className="font-bold text-xl whitespace-nowrap">Admin Dashboard</h2>
            )}
          </div>

          {/* MENU */}
          <nav className="flex flex-col gap-2 px-2">
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-base transition-all 
                  ${activeTab === item.id
                    ? 'bg-black text-white shadow-md '
                    : 'hover:bg-black/5 text-black '
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* BOTTOM PROFILE SECTION */}
        <div className="px-3 pb-6">
          <button
            // 🟢 1. Changed div to button and added 'group' class
            // 🟢 2. Changed hover:bg-black to a full Tailwind shade (hover:bg-gray-900) for clarity
            className="
        flex items-center gap-3 px-3 py-2 rounded-lg group hover:bg-gray-900 hover:text-white w-full text-left
        transition-colors duration-200 
    "
          >
            {/* 🟢 3. User Icon: Default color is black (inherited or implied), changed to white on hover */}
            <User className="h-5 w-5 text-black group-hover:text-white transition-colors duration-200" />

            {!collapsed && (
              <div className="flex flex-col leading-tight">

                {/* 🟢 4. Name: Default is black, changed to white on hover */}
                <span className="font-medium text-black group-hover:text-white transition-colors duration-200">
                  Admin
                </span>

                {/* 🟢 5. Email: Default is black/60, changed to white on hover */}
                <span className="text-xs text-black/60 group-hover:text-white transition-colors duration-200">
                  admin@projectnexus
                </span>

              </div>
            )}
          </button>

          <button
            className="
        flex items-center gap-3 px-3 py-2 mt-3 rounded-lg group   // 🟢 1. ADD 'group' class to the button
        hover:bg-red-700 w-full text-left
        transition-colors duration-200
    "
          >
            {/* 🟢 2. Use group-hover:text-white on the ICON */}
            <LogOut className="h-5 w-5 text-red-500 group-hover:text-white transition-colors duration-200" />

            {!collapsed &&
              // 🟢 3. Use group-hover:text-white on the SPAN
              <span className="text-red-600 group-hover:text-white transition-colors duration-200">Logout</span>
            }
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} p-10 bg-white`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="h-7 w-7 text-black" />
            Admin <span className="text-black/50">Dashboard</span>
          </h1>
          <p className="text-black/40">
            Manage projects, view requests, and track transactions
          </p>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'requests' && <RequestsViewer />}
          {activeTab === 'transactions' && <TransactionsViewer />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
