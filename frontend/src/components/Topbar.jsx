import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ST';

  return (
    <header className="h-16 bg-white dark:bg-[#211114] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="relative text-slate-500 hover:text-[#b81430] transition-colors p-2 rounded-lg hover:bg-[#b81430]/5">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#b81430] rounded-full border-2 border-white"></span>
        </button>
        <button className="text-slate-500 hover:text-[#b81430] transition-colors p-2 rounded-lg hover:bg-[#b81430]/5">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/profile')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold group-hover:text-[#b81430] transition-colors">{user?.name || 'Staff User'}</p>
            <p className="text-[10px] text-slate-500 font-medium">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#b81430]/20 flex items-center justify-center text-[#b81430] font-bold text-sm ring-2 ring-transparent group-hover:ring-[#b81430] transition-all">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
