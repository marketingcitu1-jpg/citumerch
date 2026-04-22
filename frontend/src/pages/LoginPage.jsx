import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) navigate('/dashboard');
    else setError(result.message);
  };

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#211114] font-[Lexend] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#b81430]/10 px-6 py-4 lg:px-20 bg-white dark:bg-[#211114]/50 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center bg-[#b81430] rounded-lg text-white">
            <span className="material-symbols-outlined text-xl">inventory_2</span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">CIT-U Inventory</h2>
        </Link>
        <div className="flex items-center gap-6">
          <a className="hidden md:block text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-[#b81430] transition-colors" href="#">Help Center</a>
          <a className="hidden md:block text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-[#b81430] transition-colors" href="#">System Status</a>
          <button className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#b81430] text-white text-sm font-bold transition-all hover:bg-[#96102a] active:scale-95 shadow-sm">
            Contact Support
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[1000px] flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-[#b81430]/5">
          {/* Left panel */}
          <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12 bg-[#b81430]">
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-900 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl inline-flex mb-6">
                <span className="material-symbols-outlined text-white text-3xl">verified_user</span>
              </div>
              <h1 className="text-white text-4xl font-bold leading-tight mb-4">Centralized Staff Portal</h1>
              <p className="text-white/80 text-lg leading-relaxed mb-8">Securely manage university assets, track inventory movements, and generate reports from a single dashboard.</p>
              <div className="flex flex-col gap-4 border-t border-white/20 pt-8">
                {['Multi-factor Authentication Ready', 'End-to-End Asset Tracking', 'Real-time Inventory Analytics'].map((f) => (
                  <div key={f} className="flex items-center gap-3 text-white/90">
                    <span className="material-symbols-outlined text-white/60">check_circle</span>
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">Sign In</h2>
              <p className="text-slate-500 dark:text-slate-400">Welcome back! Please enter your details.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-400">
                <span className="material-symbols-outlined text-xl">error</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">University Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-xl">alternate_email</span>
                  </div>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. j.doe@cit.edu"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold">Password</label>
                  <a className="text-[#b81430] text-xs font-semibold hover:underline" href="#">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-xl">lock</span>
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'} required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3.5 pl-12 pr-12 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#b81430] transition-colors">
                    <span className="material-symbols-outlined text-xl">{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember" type="checkbox" checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-[#b81430] focus:ring-[#b81430]" />
                <label htmlFor="remember" className="ml-2 block text-sm text-slate-600 dark:text-slate-400">Remember me for 30 days</label>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#b81430] hover:bg-[#96102a] text-white font-bold py-4 rounded-lg shadow-lg shadow-[#b81430]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? (
                  <><span className="animate-spin material-symbols-outlined text-lg">progress_activity</span><span>Signing in...</span></>
                ) : (
                  <><span>Sign In</span><span className="material-symbols-outlined text-lg">arrow_forward</span></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#b81430] font-semibold hover:underline">Request Access</Link>
            </p>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-8 opacity-60 hover:opacity-100 transition-all duration-500">
                {[['security', 'SSL Secure'], ['shield_locked', '256-Bit Encryption'], ['verified', 'Trust Site']].map(([icon, label]) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 px-6 text-center text-slate-500 text-xs">
        <p>© 2024 Cebu Institute of Technology - University. All rights reserved.</p>
        <p className="mt-2 flex items-center justify-center gap-4">
          <a className="hover:text-[#b81430] transition-colors underline underline-offset-4 decoration-[#b81430]/20" href="#">Privacy Policy</a>
          <span className="size-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
          <a className="hover:text-[#b81430] transition-colors underline underline-offset-4 decoration-[#b81430]/20" href="#">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
