import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const mockItems = [
  { id: 1, icon: 'devices', name: 'Dell Latitude 5420', category: 'IT Equipment', qty: 12, price: 45000, status: 'IN_STOCK', location: 'IT Lab A', added: '2023-10-20' },
  { id: 2, icon: 'chair', name: 'Ergonomic Office Chair', category: 'Furniture', qty: 45, price: 3200, status: 'IN_STOCK', location: 'Warehouse A', added: '2023-10-21' },
  { id: 3, icon: 'sanitizer', name: 'Hand Sanitizer (1L)', category: 'Consumables', qty: 3, price: 280, status: 'LOW_STOCK', location: 'Storage Room B', added: '2023-10-22' },
  { id: 4, icon: 'print', name: 'HP LaserJet Pro M404n', category: 'IT Equipment', qty: 7, price: 18500, status: 'IN_STOCK', location: 'Admin Office', added: '2023-10-23' },
  { id: 5, icon: 'content_copy', name: 'A4 Copy Paper (80gsm)', category: 'Office Supplies', qty: 8, price: 350, status: 'LOW_STOCK', location: 'Warehouse B, Shelf 4', added: '2023-10-24' },
];

const statusStyle = {
  IN_STOCK: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  LOW_STOCK: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  OUT_OF_STOCK: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};
const statusLabel = { IN_STOCK: 'In Stock', LOW_STOCK: 'Low Stock', OUT_OF_STOCK: 'Out of Stock' };
const CATEGORIES = ['All Categories', 'IT Equipment', 'Furniture', 'Consumables', 'Office Supplies'];

export default function OrdersPage() {
  const { user } = useAuth();
  const [items, setItems] = useState(mockItems);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', qty: '', price: '', location: '', status: 'IN_STOCK' });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const transformedItems = data.map((item) => ({
          id: item.id,
          icon: 'inventory_2',
          name: item.name,
          category: item.category || 'Uncategorized',
          qty: item.quantity,
          price: item.price,
          status: item.quantity > 50 ? 'IN_STOCK' : item.quantity > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
          location: item.description || 'Unknown',
          added: new Date(item.created_at).toISOString().split('T')[0],
        }));

        setItems(transformedItems);
      } catch (err) {
        console.log('[v0] Items fetch error:', err);
        setItems(mockItems);
      }
    };

    if (user) fetchItems();
  }, [user]);

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All Categories' || i.category === category;
    return matchSearch && matchCategory;
  });

  const openAdd = () => { setEditItem(null); setForm({ name: '', category: '', qty: '', price: '', location: '', status: 'IN_STOCK' }); setShowModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, category: item.category, qty: item.qty, price: item.price, location: item.location, status: item.status }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { qty: Number(form.qty), price: Number(form.price), name: form.name, category: form.category, description: form.location, user_id: user?.id };
    
    if (editItem) {
      try {
        const { error } = await supabase
          .from('inventory_items')
          .update(payload)
          .eq('id', editItem.id);

        if (error) throw error;
        setItems((prev) => prev.map((i) => i.id === editItem.id ? { ...i, ...form } : i));
      } catch (err) {
        console.log('[v0] Update error:', err);
      }
    } else {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;

        const newItem = {
          id: data.id,
          icon: 'inventory_2',
          ...form,
          qty: Number(form.qty),
          price: Number(form.price),
          added: new Date().toISOString().split('T')[0],
        };
        setItems((prev) => [newItem, ...prev]);
      } catch (err) {
        console.log('[v0] Create error:', err);
      }
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.log('[v0] Delete error:', err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6] dark:bg-[#211114]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Inventory Items" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." type="text"
                    className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all w-64" />
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all text-slate-700 dark:text-slate-300">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={openAdd} className="bg-[#b81430] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#96102a] transition-all flex items-center gap-2 shadow-lg shadow-[#b81430]/20 whitespace-nowrap">
                <span className="material-symbols-outlined text-sm">add</span>Add New Item
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {['Item Name', 'Category', 'Qty', 'Unit Price', 'Location', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-xs font-bold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-base">{item.icon}</span>
                          </div>
                          <span className="font-semibold text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{item.category}</td>
                      <td className="px-5 py-4 text-sm font-bold">{item.qty}</td>
                      <td className="px-5 py-4 text-sm">₱{Number(item.price).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{item.location}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle[item.status]}`}>{statusLabel[item.status]}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-[#b81430] transition-colors rounded hover:bg-[#b81430]/5">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                  <span className="material-symbols-outlined text-5xl block mb-3">search_off</span>
                  <p className="font-medium">No items match your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editItem ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[['name', 'Item Name', 'text', 'e.g. Dell Latitude 5420'], ['location', 'Location', 'text', 'e.g. Warehouse A']].map(([f, label, type, ph]) => (
                <div key={f}>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">{label}</label>
                  <input type={type} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} placeholder={ph} required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Quantity</label>
                  <input type="number" min="0" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Unit Price (₱)</label>
                  <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all text-slate-700 dark:text-slate-300">
                    <option value="">Select</option>
                    {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all text-slate-700 dark:text-slate-300">
                    <option value="IN_STOCK">In Stock</option>
                    <option value="LOW_STOCK">Low Stock</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-[#b81430] text-white font-bold py-3 rounded-xl hover:bg-[#96102a] transition-colors shadow-lg shadow-[#b81430]/20">
                  {editItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
