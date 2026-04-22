import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const sections = [
  {
    id: 'general', icon: 'tune', title: 'General Settings',
    fields: [
      { key: 'systemName', label: 'System Name', type: 'text', value: 'CIT-U Inventory System' },
      { key: 'adminEmail', label: 'Admin Email', type: 'email', value: 'admin@cit.edu' },
      { key: 'timezone', label: 'Timezone', type: 'select', options: ['Asia/Manila', 'UTC', 'Asia/Tokyo'], value: 'Asia/Manila' },
    ]
  },
  {
    id: 'notifications', icon: 'notifications', title: 'Notifications',
    toggles: [
      { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Receive alerts when item quantity falls below threshold', value: true },
      { key: 'newOrder', label: 'New Pre-order Notifications', desc: 'Notify staff when a student submits a new pre-order', value: true },
      { key: 'weeklyReport', label: 'Weekly Report Emails', desc: 'Receive weekly inventory summary via email', value: false },
      { key: 'auditReminders', label: 'Audit Reminders', desc: 'Reminders for scheduled quarterly audits', value: true },
    ]
  },
  {
    id: 'thresholds', icon: 'bar_chart', title: 'Stock Thresholds',
    fields: [
      { key: 'lowStockQty', label: 'Low Stock Warning (units)', type: 'number', value: '10' },
      { key: 'criticalQty', label: 'Critical Stock Alert (units)', type: 'number', value: '3' },
    ]
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState(() => {
    const t = {};
    sections.find(s => s.id === 'notifications')?.toggles.forEach(tg => { t[tg.key] = tg.value; });
    return t;
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f6f6] dark:bg-[#211114]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title="Settings" />
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="text-3xl font-black tracking-tight">System Settings</h3>
              <p className="text-slate-500 dark:text-slate-400">Configure your inventory system preferences</p>
            </div>

            {saved && (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="font-medium">Settings saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {sections.map(({ id, icon, title, fields, toggles: sectionToggles }) => (
                <div key={id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#b81430]/10 text-[#b81430] flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                    </div>
                    <h3 className="font-bold">{title}</h3>
                  </div>
                  <div className="p-6 space-y-5">
                    {fields?.map(({ key, label, type, options, value }) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{label}</label>
                        {type === 'select' ? (
                          <select defaultValue={value}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all text-slate-700 dark:text-slate-300">
                            {options.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={type} defaultValue={value}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b81430]/20 focus:border-[#b81430] transition-all" />
                        )}
                      </div>
                    ))}
                    {sectionToggles?.map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start justify-between gap-4 py-2">
                        <div>
                          <p className="font-semibold text-sm">{label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                        <button type="button" onClick={() => setToggles((t) => ({ ...t, [key]: !t[key] }))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggles[key] ? 'bg-[#b81430]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggles[key] ? 'translate-x-5' : 'translate-x-0'}`}></span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Danger Zone */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </div>
                  <h3 className="font-bold text-red-600">Danger Zone</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Clear All Inventory Data</p>
                      <p className="text-xs text-slate-500">This will permanently delete all inventory records.</p>
                    </div>
                    <button type="button" className="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">Clear Data</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Reset to Default Settings</p>
                      <p className="text-xs text-slate-500">Restore all settings to factory defaults.</p>
                    </div>
                    <button type="button" className="px-4 py-2 border border-red-300 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">Reset</button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-[#b81430] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#96102a] transition-colors shadow-lg shadow-[#b81430]/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">save</span>
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
