import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import api from '../api/axios';

const TABS = ['All', 'Pending', 'Paid', 'Claimed'];
const mockOrders = [
  { id: 1, name: 'Marcus Sterling', email: 'm.sterling@cit.edu', studentId: '#STU-29845', items: ['Textbook Set (3)', 'Lab Coat'], date: 'Oct 24, 2023', status: 'PENDING' },
  { id: 2, name: 'Elena Rodriguez', email: 'e.rodriguez@cit.edu', studentId: '#STU-31209', items: ['Engineering Kit'], date: 'Oct 25, 2023', status: 'PENDING' },
  { id: 3, name: 'David Chen', email: 'd.chen@cit.edu', studentId: '#STU-27551', items: ['Business Admin Set', 'Laptop Sleeve'], date: 'Oct 25, 2023', status: 'PAID' },
  { id: 4, name: 'Sofia Reyes', email: 's.reyes@cit.edu', studentId: '#STU-33012', items: ['CIT-U Uniform Set'], date: 'Oct 26, 2023', status: 'CLAIMED' },
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(mockOrders);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => setOrders(mockOrders));
  }, []);

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === 'All' || o.status === activeTab.toUpperCase();
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.studentId.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleClaim = async (id) => {
    try {
      await api.put(`/orders/${id}/claim`);
    } catch (_) {}
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'CLAIMED' } : o));
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    CLAIMED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === 'All' ? orders.length : orders.filter((o) => o.status === t.toUpperCase()).length;
    return acc;
  }, {});

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6] dark:bg-[#211114]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Fulfillment Dashboard" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Title row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h3 className="text-3xl font-black tracking-tight">Student Pre-orders</h3>
                <p className="text-slate-500 dark:text-slate-400">Manage and fulfill on-campus pickup reservations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all shadow-sm text-sm"
                    placeholder="Search by name, ID..." type="text" />
                </div>
                <button className="bg-[#b81430] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#96102a] transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-[#b81430]/20">
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Reservation
                </button>
              </div>
            </div>

            {/* Table card */}
            <div className="bg-white dark:bg-[#211114] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
                {TABS.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-4 text-sm font-semibold relative transition-colors ${activeTab === tab ? 'text-[#b81430] border-b-2 border-[#b81430]' : 'text-slate-400 hover:text-slate-600'}`}>
                    {tab}
                    {counts[tab] > 0 && (
                      <span className={`ml-2 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab ? 'bg-[#b81430]/10 text-[#b81430]' : 'bg-slate-100 text-slate-500'}`}>{counts[tab]}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      {['Student', 'ID Number', 'Items Reserved', 'Date Reserved', 'Status', 'Actions'].map((h) => (
                        <th key={h} className={`px-6 py-4 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
                        No orders found
                      </td></tr>
                    ) : filtered.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#b81430]/10 text-[#b81430] flex items-center justify-center font-bold text-sm">
                              {o.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold">{o.name}</p>
                              <p className="text-xs text-slate-500">{o.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">{o.studentId}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {o.items.map((item) => (
                              <span key={item} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">{item}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{o.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[o.status]}`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-slate-400 hover:text-[#b81430] transition-colors rounded-lg hover:bg-[#b81430]/5">
                              <span className="material-symbols-outlined">info</span>
                            </button>
                            {o.status !== 'CLAIMED' && (
                              <button onClick={() => handleClaim(o.id)}
                                className="bg-[#b81430] text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#96102a] transition-all shadow-sm">
                                Mark as Claimed
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filtered.length}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{orders.length}</span> results</p>
                <div className="flex gap-2">
                  <button disabled className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm disabled:opacity-50">Previous</button>
                  <button className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm hover:border-[#b81430] transition-colors">Next</button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'pending_actions', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600', label: 'Total Pending', value: `${counts.Pending} Orders` },
                { icon: 'check_circle', color: 'bg-green-50 dark:bg-green-900/20 text-green-600', label: 'Claimed Today', value: `${counts.Claimed} Students` },
                { icon: 'inventory', color: 'bg-[#b81430]/10 text-[#b81430]', label: 'Stock Levels', value: '94% Healthy' },
              ].map(({ icon, color, label, value }) => (
                <div key={label} className="bg-white dark:bg-[#211114] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
