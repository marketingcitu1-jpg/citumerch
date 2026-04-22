import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const departments = ['College of Computer Studies', 'College of Engineering', 'College of Business', 'College of Arts and Sciences', 'Administration', 'ICT Department', 'Other'];

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', department: '', role: '', employeeId: '',
    password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const up = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const nextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.firstName || !form.lastName || !form.email || !form.department || !form.role || !form.employeeId) {
        setError('Please fill in all fields.'); return;
      }
      if (!form.email.endsWith('@cit.edu')) {
        setError('Email must be a valid CIT-U email (@cit.edu).'); return;
      }
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters long.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    const result = await register({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      department: form.department,
      role: form.role,
      employeeId: form.employeeId,
      password: form.password,
    });
    if (result.success) navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    else setError(result.message);
  };

  const passwordStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#211114] font-[Lexend] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#b81430]/10 px-6 py-4 lg:px-20 bg-white dark:bg-[#211114]/50 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center bg-[#b81430] rounded-lg text-white">
            <span className="material-symbols-outlined text-xl">inventory_2</span>
          </div>
          <h2 className="text-lg font-bold">CIT-U Inventory</h2>
        </Link>
        <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-[#b81430] transition-colors">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Login
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[1000px] flex flex-col lg:flex-row bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-[#b81430]/5">
          {/* Left Panel */}
          <div className="hidden lg:flex lg:w-2/5 relative flex-col justify-between p-12 bg-[#b81430]">
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-slate-900 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl inline-flex mb-6">
                <span className="material-symbols-outlined text-white text-3xl">person_add</span>
              </div>
              <h1 className="text-white text-3xl font-bold leading-tight mb-4">Join the Portal</h1>
              <p className="text-white/80 text-base leading-relaxed mb-8">Create your staff account to access the CIT-U Inventory Management System.</p>
              {/* Step indicator */}
              <div className="flex flex-col gap-4 mt-8">
                {[{ n: 1, label: 'Personal Information' }, { n: 2, label: 'Security Setup' }].map(({ n, label }) => (
                  <div key={n} className={`flex items-center gap-3 ${step >= n ? 'text-white' : 'text-white/40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step > n ? 'bg-white text-[#b81430] border-white' : step === n ? 'border-white text-white' : 'border-white/30 text-white/40'}`}>
                      {step > n ? <span className="material-symbols-outlined text-base">check</span> : n}
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 border-t border-white/20 pt-6">
              <p className="text-white/60 text-xs">Already have an account?</p>
              <Link to="/login" className="text-white font-bold text-sm hover:underline">Sign In Instead →</Link>
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-xs font-bold text-[#b81430] uppercase tracking-widest mb-1">Step {step} of 2</p>
              <h2 className="text-2xl font-bold mb-1">{step === 1 ? 'Personal Information' : 'Create Your Password'}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{step === 1 ? 'Enter your university staff details.' : 'Set a strong password for your account.'}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-red-700 dark:text-red-400">
                <span className="material-symbols-outlined text-xl">error</span>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={nextStep} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[['firstName', 'First Name', 'person', 'e.g. Juan'], ['lastName', 'Last Name', 'person', 'e.g. Dela Cruz']].map(([field, label, icon, ph]) => (
                    <div key={field}>
                      <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{label}</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-lg">{icon}</span>
                        </div>
                        <input type="text" value={form[field]} onChange={(e) => up(field, e.target.value)} placeholder={ph} required
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">University Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-lg">alternate_email</span>
                    </div>
                    <input type="email" value={form.email} onChange={(e) => up('email', e.target.value)} placeholder="j.delacruz@cit.edu" required
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Department</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-lg">apartment</span>
                      </div>
                      <select value={form.department} onChange={(e) => up('department', e.target.value)} required
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all appearance-none text-slate-700 dark:text-slate-300">
                        <option value="">Select department</option>
                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Role / Position</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-lg">badge</span>
                      </div>
                      <input type="text" value={form.role} onChange={(e) => up('role', e.target.value)} placeholder="e.g. Station Manager" required
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Employee ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-lg">fingerprint</span>
                    </div>
                    <input type="text" value={form.employeeId} onChange={(e) => up('employeeId', e.target.value)} placeholder="e.g. EMP-00123" required
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#b81430] hover:bg-[#96102a] text-white font-bold py-4 rounded-lg shadow-lg shadow-[#b81430]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  ['password', 'Password', 'Create a strong password'],
                  ['confirmPassword', 'Confirm Password', 'Re-enter your password'],
                ].map(([field, label, ph]) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{label}</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 group-focus-within:text-[#b81430] transition-colors text-lg">lock</span>
                      </div>
                      <input type={showPass ? 'text' : 'password'} value={form[field]}
                        onChange={(e) => up(field, e.target.value)} placeholder={ph} required
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all placeholder:text-slate-400" />
                      {field === 'password' && (
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#b81430] transition-colors">
                          <span className="material-symbols-outlined text-lg">{showPass ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Password strength */}
                {form.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-slate-200'}`}></div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Password strength: <span className="font-bold">{strengthLabel[strength] || 'Very Weak'}</span></p>
                    <ul className="text-xs text-slate-400 space-y-1 mt-2">
                      {[['At least 8 characters', form.password.length >= 8], ['One uppercase letter', /[A-Z]/.test(form.password)], ['One number', /[0-9]/.test(form.password)], ['One special character', /[^A-Za-z0-9]/.test(form.password)]].map(([rule, ok]) => (
                        <li key={rule} className={`flex items-center gap-2 ${ok ? 'text-green-600' : ''}`}>
                          <span className="material-symbols-outlined text-sm">{ok ? 'check_circle' : 'radio_button_unchecked'}</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => { setStep(1); setError(''); }}
                    className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-[#b81430] hover:bg-[#96102a] text-white font-bold py-4 rounded-lg shadow-lg shadow-[#b81430]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70">
                    {loading ? <><span className="animate-spin material-symbols-outlined text-lg">progress_activity</span><span>Creating...</span></> : <><span>Create Account</span><span className="material-symbols-outlined text-lg">check</span></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 px-6 text-center text-slate-500 text-xs">
        <p>© 2024 Cebu Institute of Technology - University. All rights reserved.</p>
      </footer>
    </div>
  );
}
