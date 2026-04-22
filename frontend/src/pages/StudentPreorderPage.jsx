import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = ['IT Equipment', 'Furniture', 'Consumables', 'Office Supplies', 'Books & Learning Materials', 'Uniforms & Apparel'];
const mockItems = [
  { id: 1, icon: 'menu_book', name: 'Engineering Textbook Set A', category: 'Books & Learning Materials', price: 1200, available: true },
  { id: 2, icon: 'science', name: 'Chemistry Lab Kit (Basic)', category: 'IT Equipment', price: 850, available: true },
  { id: 3, icon: 'checkroom', name: 'CIT-U Uniform Set (Male)', category: 'Uniforms & Apparel', price: 650, available: true },
  { id: 4, icon: 'checkroom', name: 'CIT-U Uniform Set (Female)', category: 'Uniforms & Apparel', price: 650, available: true },
  { id: 5, icon: 'laptop_mac', name: 'Laptop Sleeve (15")', category: 'IT Equipment', price: 350, available: false },
  { id: 6, icon: 'sanitizer', name: 'Hygiene Kit Bundle', category: 'Consumables', price: 280, available: true },
];

export default function StudentPreorderPage() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ studentName: '', studentId: '', email: '', course: '', year: '' });
  const [step, setStep] = useState('browse'); // browse | checkout | success
  const [submitted, setSubmitted] = useState(false);

  const filteredItems = mockItems.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCart = (item) => {
    setCart((c) => c.find((ci) => ci.id === item.id) ? c.filter((ci) => ci.id !== item.id) : [...c, item]);
  };
  const isInCart = (id) => cart.some((i) => i.id === id);
  const total = cart.reduce((s, i) => s + i.price, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, items: cart.map((i) => i.name), totalAmount: total };
    try { await api.post('/orders/student', payload); } catch (_) {}
    setSubmitted(true);
    setStep('success');
  };

  if (step === 'success') return (
    <div className="min-h-screen bg-[#f8f6f6] flex flex-col items-center justify-center p-8 font-[Lexend]">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-black mb-3">Pre-order Submitted!</h2>
        <p className="text-slate-500 mb-2">Thank you, <strong>{form.studentName}</strong>.</p>
        <p className="text-slate-500 text-sm mb-8">Your reservation has been received. You'll receive a confirmation at <strong>{form.email}</strong>. Please pick up your items at the designated station.</p>
        <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left space-y-2">
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-sm"><span className="text-slate-700">{i.name}</span><span className="font-bold">₱{i.price.toLocaleString()}</span></div>
          ))}
          <div className="border-t border-slate-200 pt-2 flex justify-between font-black"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
        </div>
        <Link to="/" className="block w-full bg-[#b81430] text-white font-bold py-3 rounded-xl hover:bg-[#96102a] transition-colors text-center">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f6f6] dark:bg-[#211114] font-[Lexend] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#211114]/80 backdrop-blur-md border-b border-[#b81430]/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b81430] text-white">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <div>
              <h2 className="text-lg font-bold leading-none">CIT-U</h2>
              <p className="text-xs text-slate-500 font-medium">Student Pre-order Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-[#b81430] transition-colors">Staff Login</Link>
            <button onClick={() => cart.length > 0 && setStep('checkout')}
              className="relative flex items-center gap-2 bg-[#b81430] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#96102a] transition-all shadow-lg shadow-[#b81430]/20">
              <span className="material-symbols-outlined text-lg">shopping_cart</span>
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center">{cart.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {step === 'browse' && (
          <>
            {/* Hero */}
            <div className="mb-10 text-center">
              <div className="inline-flex rounded-full bg-[#b81430]/10 px-4 py-1.5 text-sm font-semibold text-[#b81430] mb-4">
                Student Services Portal
              </div>
              <h1 className="text-4xl font-extrabold mb-4">Reserve Your <span className="text-[#b81430]">Academic Items</span></h1>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">Browse available items and add them to your reservation. Pick up at the campus inventory station during operating hours.</p>
            </div>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-10">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items by name or category..."
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredItems.map((item) => (
                <div key={item.id} className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm p-6 flex flex-col gap-4 transition-all hover:shadow-lg ${isInCart(item.id) ? 'border-[#b81430] ring-2 ring-[#b81430]/20' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isInCart(item.id) ? 'bg-[#b81430] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} transition-colors`}>
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    {!item.available && (
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 rounded-full px-2 py-1">Unavailable</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-black text-[#b81430]">₱{item.price.toLocaleString()}</p>
                    <button disabled={!item.available} onClick={() => toggleCart(item)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isInCart(item.id) ? 'bg-[#b81430] text-white hover:bg-[#96102a]' : 'border-2 border-slate-200 text-slate-600 hover:border-[#b81430] hover:text-[#b81430] disabled:opacity-40 disabled:cursor-not-allowed'}`}>
                      {isInCart(item.id) ? 'Remove' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating cart bar */}
            {cart.length > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
                <div className="bg-slate-900 text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
                  <div>
                    <p className="font-bold">{cart.length} item{cart.length > 1 ? 's' : ''} in cart</p>
                    <p className="text-sm text-slate-400">Total: ₱{total.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setStep('checkout')} className="bg-[#b81430] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#96102a] transition-colors flex items-center gap-2">
                    Proceed <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setStep('browse')} className="flex items-center gap-2 text-slate-500 hover:text-[#b81430] transition-colors mb-8 text-sm font-medium">
              <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Browse
            </button>
            <h2 className="text-3xl font-black mb-2">Complete Your Pre-order</h2>
            <p className="text-slate-500 mb-8">Fill in your student details to confirm the reservation.</p>

            {/* Order summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-[#b81430]">receipt_long</span>Order Summary</h3>
              <div className="space-y-3">
                {cart.map((i) => (
                  <div key={i.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#b81430]/10 text-[#b81430] flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">{i.icon}</span>
                      </div>
                      <span className="text-sm font-medium">{i.name}</span>
                    </div>
                    <span className="font-bold text-sm">₱{i.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-black">
                  <span>Total</span><span className="text-[#b81430]">₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Student Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h3 className="font-bold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-[#b81430]">person</span>Student Information</h3>
              <div className="grid grid-cols-2 gap-4">
                {[['studentName', 'Full Name', 'text', 'Juan Dela Cruz'], ['studentId', 'Student ID', 'text', 'e.g. 21-00123'], ['email', 'School Email', 'email', 'j.delacruz@cit.edu'], ['course', 'Course', 'text', 'e.g. BSCS']].map(([f, label, type, ph]) => (
                  <div key={f}>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">{label}</label>
                    <input type={type} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} placeholder={ph} required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Year Level</label>
                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all text-slate-700 dark:text-slate-300">
                  <option value="">Select year level</option>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-[#b81430] text-white font-bold py-4 rounded-xl hover:bg-[#96102a] transition-all shadow-lg shadow-[#b81430]/20 flex items-center justify-center gap-2 mt-4">
                <span className="material-symbols-outlined">check_circle</span>
                Confirm Pre-order
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
