import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/inventory', icon: 'package_2', label: 'Inventory' },
  { to: '/orders', icon: 'shopping_cart', label: 'Orders' },
  { to: '/reports', icon: 'description', label: 'Reports' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-[#211114] border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-[#b81430] p-2 rounded-lg">
            <span className="material-symbols-outlined text-white">inventory_2</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#b81430] tracking-tight">CIT-U</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Inventory Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#b81430]/10 text-[#b81430]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer group"
          onClick={() => navigate('/profile')}>
          <div className="h-10 w-10 rounded-full bg-[#b81430]/20 flex items-center justify-center text-[#b81430] font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate group-hover:text-[#b81430] transition-colors">{user?.name || 'Staff User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role || 'Staff'}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="text-slate-400 hover:text-[#b81430] transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
