import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    role: user?.role || '',
    employeeId: user?.employeeId || '',
  });
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try { await api.put('/auth/profile', form); } catch (_) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPass.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwForm.newPass !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPass });
      setPwSuccess(true);
      setPwForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6] dark:bg-[#211114]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="My Profile" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-[#b81430] to-[#7c0d20] relative">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                </div>
              </div>
              <div className="px-8 pb-6">
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center bg-[#b81430]/10 text-[#b81430] text-2xl font-black">
                    {initials}
                  </div>
                  <button onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors font-medium">
                    <span className="material-symbols-outlined text-base">logout</span>
                    Sign Out
                  </button>
                </div>
                <h2 className="text-2xl font-black">{user?.name || 'Staff User'}</h2>
                <p className="text-slate-500 text-sm">{user?.role || 'Staff'} · {user?.department || 'CIT-U'}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {[user?.email, user?.employeeId].filter(Boolean).map((info) => (
                    <span key={info} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">{info}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              {[['profile', 'person', 'Edit Profile'], ['password', 'lock', 'Change Password']].map(([key, icon, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === key ? 'bg-white dark:bg-slate-900 text-[#b81430] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <span className="material-symbols-outlined text-base">{icon}</span>{label}
                </button>
              ))}
            </div>

            {/* Edit Profile */}
            {tab === 'profile' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                {saved && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-medium text-sm">Profile updated successfully!</span>
                  </div>
                )}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[['name', 'Full Name', 'text', 'Juan Dela Cruz'], ['email', 'University Email', 'email', 'j.delacruz@cit.edu'], ['department', 'Department', 'text', 'e.g. CCS'], ['role', 'Role / Position', 'text', 'e.g. Station Manager'], ['employeeId', 'Employee ID', 'text', 'EMP-00123']].map(([f, label, type, ph]) => (
                      <div key={f} className={f === 'name' || f === 'email' ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{label}</label>
                        <input type={type} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} placeholder={ph}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-[#b81430] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#96102a] transition-colors shadow-lg shadow-[#b81430]/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">save</span>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password */}
            {tab === 'password' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                {pwError && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                    <span className="material-symbols-outlined">error</span>
                    <span className="font-medium text-sm">{pwError}</span>
                  </div>
                )}
                {pwSuccess && (
                  <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-medium text-sm">Password changed successfully!</span>
                  </div>
                )}
                <form onSubmit={handleChangePassword} className="space-y-5">
                  {[['current', 'Current Password', 'Enter your current password'], ['newPass', 'New Password', 'Enter a new password'], ['confirm', 'Confirm New Password', 'Re-enter your new password']].map(([f, label, ph]) => (
                    <div key={f}>
                      <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{label}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                        </div>
                        <input type={showPw ? 'text' : 'password'} value={pwForm[f]} onChange={(e) => setPwForm({ ...pwForm, [f]: e.target.value })} placeholder={ph} required
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-11 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                        {f === 'current' && (
                          <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#b81430] transition-colors">
                            <span className="material-symbols-outlined text-lg">{showPw ? 'visibility_off' : 'visibility'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="bg-[#b81430] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#96102a] transition-colors shadow-lg shadow-[#b81430]/20 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">lock_reset</span>
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
