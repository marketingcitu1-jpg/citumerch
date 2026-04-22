import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const summaryData = [
  { label: 'Total Inventory Value', value: '₱4,382,640', icon: 'payments', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20', change: '+8.2%', up: true },
  { label: 'Items Processed (Month)', value: '1,240', icon: 'inventory', color: 'bg-green-50 text-green-600 dark:bg-green-900/20', change: '+4.2%', up: true },
  { label: 'Low Stock Alerts', value: '24', icon: 'warning', color: 'bg-red-50 text-red-600 dark:bg-red-900/20', change: '-3 from last month', up: false },
  { label: 'Orders Fulfilled', value: '386', icon: 'check_circle', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20', change: '+12.5%', up: true },
];

const categoryData = [
  { name: 'IT Equipment', count: 342, value: '₱2,104,000', percentage: 48 },
  { name: 'Furniture', count: 210, value: '₱672,000', percentage: 28 },
  { name: 'Consumables', count: 890, value: '₱248,920', percentage: 18 },
  { name: 'Office Supplies', count: 1200, value: '₱180,000', percentage: 12 },
];

const recentActivity = [
  { icon: 'add_circle', text: 'Added 12 Dell Latitude 5420 units', time: '2h ago', color: 'text-green-600' },
  { icon: 'warning', text: 'Low stock alert: A4 Copy Paper (8 reams)', time: '4h ago', color: 'text-red-600' },
  { icon: 'local_shipping', text: 'Received delivery: Kitchen Supplies', time: '6h ago', color: 'text-blue-600' },
  { icon: 'edit', text: 'Updated: Projector X-200 description', time: 'Yesterday', color: 'text-yellow-600' },
  { icon: 'check_circle', text: '128 student pre-orders marked as Claimed', time: 'Yesterday', color: 'text-green-600' },
];

export default function ReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6] dark:bg-[#211114]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Reports & Analytics" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black tracking-tight">System Reports</h3>
                <p className="text-slate-500 dark:text-slate-400">Analytics overview for the current period</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-base">calendar_today</span>
                  This Month
                </button>
                <button className="flex items-center gap-2 bg-[#b81430] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#96102a] transition-colors shadow-lg shadow-[#b81430]/20">
                  <span className="material-symbols-outlined text-base">download</span>
                  Export PDF
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {summaryData.map(({ label, value, icon, color, change, up }) => (
                <div key={label} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-xl">{icon}</span>
                    </div>
                    <span className={`text-xs font-bold flex items-center gap-0.5 ${up ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="material-symbols-outlined text-sm">{up ? 'trending_up' : 'trending_down'}</span>
                      {change}
                    </span>
                  </div>
                  <p className="text-2xl font-black mb-1">{value}</p>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Category Breakdown */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Inventory by Category</h3>
                  <button className="text-[#b81430] text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-5">
                  {categoryData.map(({ name, count, value, percentage }) => (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{name}</p>
                          <p className="text-xs text-slate-500">{count} items · {value}</p>
                        </div>
                        <span className="text-sm font-black">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#b81430] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Recent Activity</h3>
                  <button className="text-[#b81430] text-sm font-semibold hover:underline">All Logs</button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map(({ icon, text, time, color }) => (
                    <div key={text} className="flex gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${color}`}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-lg">Top Items by Value</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-sm">download</span>
                  Export CSV
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    {['Item', 'Category', 'Quantity', 'Unit Price', 'Total Value'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    { name: 'Dell Latitude 5420', cat: 'IT Equipment', qty: 12, price: 45000 },
                    { name: 'Ergonomic Office Chair', cat: 'Furniture', qty: 45, price: 3200 },
                    { name: 'HP LaserJet Pro M404n', cat: 'IT Equipment', qty: 7, price: 18500 },
                  ].map(({ name, cat, qty, price }) => (
                    <tr key={name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold">{name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{cat}</td>
                      <td className="px-6 py-4 text-sm font-bold">{qty}</td>
                      <td className="px-6 py-4 text-sm">₱{price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-black text-[#b81430]">₱{(qty * price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
