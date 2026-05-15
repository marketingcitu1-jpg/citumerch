import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { supabase } from '../lib/supabase';

const mockStats = { totalItems: 12482, lowStock: 24, pendingOrders: 156 };
const mockAlerts = [
  { id: 1, name: 'A4 Copy Paper (80gsm)', badge: 'Critical Stock', badgeColor: 'bg-red-600 text-white', remaining: '8 reams', location: 'Warehouse B, Shelf 4', action: 'Restock', actionClass: 'bg-[#b81430]', icon: 'content_copy' },
  { id: 2, name: 'HP LaserJet 85A Black', badge: 'Expiring Soon', badgeColor: 'bg-yellow-400 text-slate-900', remaining: 'Expires in 12 days', location: 'IT Lab Storage', action: 'Update Batch', actionClass: 'bg-slate-800 dark:bg-slate-700', icon: 'print' },
];
const mockActivity = [
  { initials: 'RG', name: 'Ricardo Gomez', action: 'Approved Purchase Request', ref: '#PO-2401', time: '2 hours ago', statusColor: 'bg-green-500', statusIcon: 'check' },
  { initials: 'MS', name: 'Maria Santos', action: 'Received delivery for', ref: 'Kitchen Supplies', time: '4 hours ago', statusColor: 'bg-blue-500', statusIcon: 'local_shipping' },
  { initials: 'LT', name: 'Luis Tan', action: 'Modified item', ref: 'Projector X-200', time: 'Yesterday', statusColor: 'bg-yellow-400', statusIcon: 'edit' },
];
const mockItems = [
  { id: 1, icon: 'devices', name: 'Dell Latitude 5420', category: 'IT Equipment', qty: 12, price: '₱45,000.00', status: 'In Stock', statusClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 2, icon: 'chair', name: 'Ergonomic Office Chair', category: 'Furniture', qty: 45, price: '₱3,200.00', status: 'In Stock', statusClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 3, icon: 'sanitizer', name: 'Hand Sanitizer (1L)', category: 'Consumables', qty: 3, price: '₱280.00', status: 'Low Stock', statusClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, ordersRes] = await Promise.all([
          supabase.from('inventory_items').select('*'),
          supabase.from('orders').select('*').eq('status', 'pending'),
        ]);

        if (itemsRes.error) throw itemsRes.error;
        if (ordersRes.error) throw ordersRes.error;

        const lowStockItems = itemsRes.data.filter(item => item.quantity < 50).length;
        setStats({
          totalItems: itemsRes.data.length,
          lowStock: lowStockItems,
          pendingOrders: ordersRes.data.length,
        });
      } catch (err) {
        console.log('[v0] Stats fetch error:', err);
        setStats(mockStats);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6] dark:bg-[#211114]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Inventory Dashboard" />
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'inventory', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20', label: 'Total Items', value: stats.totalItems?.toLocaleString(), sub: { icon: 'trending_up', text: '+4.2%', class: 'text-green-600' } },
              { icon: 'warning', color: 'bg-red-50 text-red-600 dark:bg-red-900/20', label: 'Low Stock Items', value: stats.lowStock, sub: { icon: 'priority_high', text: 'Critical', class: 'text-red-600' } },
              { icon: 'pending_actions', color: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20', label: 'Pending Orders', value: stats.pendingOrders, sub: { icon: 'history', text: 'Updated 5m ago', class: 'text-slate-500' } },
            ].map(({ icon, color, label, value, sub }) => (
              <div key={label} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{label}</p>
                  <h3 className="text-2xl font-bold">{value}</h3>
                  <p className={`text-xs font-bold flex items-center gap-0.5 ${sub.class}`}>
                    <span className="material-symbols-outlined text-sm">{sub.icon}</span>{sub.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Critical Alerts */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b81430]">error</span>Critical Alerts
                </h2>
                <button className="text-[#b81430] text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAlerts.map((a) => (
                  <div key={a.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col hover:shadow-lg transition-shadow">
                    <div className="h-28 w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden relative flex items-center justify-center">
                      <span className={`absolute top-2 left-2 ${a.badgeColor} px-2 py-0.5 rounded text-[10px] font-bold uppercase`}>{a.badge}</span>
                      <span className="material-symbols-outlined text-slate-400 text-5xl">{a.icon}</span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold">{a.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">Remaining: <span className="text-red-600 font-bold">{a.remaining}</span></p>
                      <p className="text-xs text-slate-500">{a.location}</p>
                      <div className="mt-4 flex gap-2">
                        <button className={`flex-1 ${a.actionClass} text-white text-xs font-bold py-2 rounded-lg hover:opacity-90 transition-opacity`}>{a.action}</button>
                        <button className="px-3 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-[#b81430] transition-colors">
                          <span className="material-symbols-outlined text-sm">more_horiz</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Staff Activity</h2>
                <button className="text-[#b81430] text-sm font-semibold hover:underline">History</button>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 space-y-5">
                  {mockActivity.map(({ initials, name, action, ref, time, statusColor, statusIcon }) => (
                    <div key={name} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-[#b81430]/10 text-[#b81430] flex items-center justify-center font-bold text-xs">{initials}</div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${statusColor} border-2 border-white dark:border-slate-900 flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-white text-[8px]">{statusIcon}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{name}</p>
                        <p className="text-xs text-slate-500">{action} <span className="text-[#b81430] font-medium">{ref}</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-t border-slate-100 dark:border-slate-800 text-center">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Announcements</p>
                  <p className="text-xs mt-2 text-slate-600 dark:text-slate-400">Quarterly inventory audit scheduled for July 15th. All staff must be present.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recently Added Items</h2>
              <div className="flex gap-2">
                {[['filter_list', 'Filter'], ['download', 'Export']].map(([icon, label]) => (
                  <button key={label} className="bg-white dark:bg-slate-900 px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors">
                    <span className="material-symbols-outlined text-sm text-slate-400">{icon}</span>{label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {['Item Name', 'Category', 'Quantity', 'Unit Price', 'Status', ''].map((h) => (
                      <th key={h} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockItems.map(({ id, icon, name, category, qty, price, status, statusClass }) => (
                    <tr key={id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-base">{icon}</span>
                          </div>
                          <span className="font-medium">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{category}</td>
                      <td className="px-6 py-4 text-sm font-bold">{qty} units</td>
                      <td className="px-6 py-4 text-sm">{price}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full ${statusClass} text-[10px] font-bold uppercase tracking-wider`}>{status}</span></td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-[#b81430] transition-colors"><span className="material-symbols-outlined">edit</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">Showing 3 of 1,240 items</p>
                <div className="flex gap-1">
                  <button disabled className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 disabled:opacity-50">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded bg-[#b81430] text-white flex items-center justify-center text-xs font-bold">1</button>
                  <button className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold hover:border-[#b81430] transition-colors">2</button>
                  <button className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
