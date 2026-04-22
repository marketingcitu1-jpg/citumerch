import { Link } from 'react-router-dom';

const features = [
  { icon: 'shield', title: 'Departmental Isolation', desc: 'Securely manage resources within specific departments without data overlap. Each unit maintains complete autonomy.' },
  { icon: 'analytics', title: 'Real-time Audits', desc: 'Instant tracking and automated reporting for every item. Generate comprehensive audit logs for compliance.' },
  { icon: 'notifications_active', title: 'Smart Notifications', desc: 'Intelligent alerts for low stock levels, maintenance schedules, and student pre-order fulfillment via SMS or Email.' },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f8f6f6] dark:bg-[#211114] text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#b81430]/10 bg-white/80 dark:bg-[#211114]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#b81430] text-white">
              <span className="material-symbols-outlined text-2xl">inventory_2</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              CIT-U <span className="text-[#b81430] text-sm font-medium">Inventory</span>
            </h2>
          </div>
          <nav className="hidden items-center gap-8 md:flex text-sm font-medium">
            <a href="#features" className="hover:text-[#b81430] transition-colors">Features</a>
            <a href="#" className="hover:text-[#b81430] transition-colors">Departments</a>
            <a href="#" className="hover:text-[#b81430] transition-colors">Support</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/student/preorder"
              className="hidden lg:flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#b81430]/10 transition-all border border-transparent hover:border-[#b81430]/20">
              Student Pre-order
            </Link>
            <Link to="/login"
              className="flex items-center justify-center rounded-lg bg-[#b81430] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#b81430]/20 hover:bg-[#96102a] transition-all">
              Staff Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 py-16 lg:px-10 lg:py-28">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#b81430]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#b81430]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 lg:flex-row">
            <div className="flex flex-1 flex-col gap-8 text-center lg:text-left">
              <div className="inline-flex w-fit self-center lg:self-start rounded-full bg-[#b81430]/10 px-4 py-1.5 text-sm font-semibold text-[#b81430]">
                Streamlining University Resources
              </div>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Modern Inventory Management for{' '}
                <span className="text-[#b81430]">CIT-U</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Efficiently track, manage, and audit campus assets across all departments with real-time analytics and automated workflows designed for excellence.
              </p>
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link to="/login"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#b81430] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#b81430]/30 transition-all hover:scale-[1.02] active:scale-95">
                  <span className="material-symbols-outlined">login</span>
                  Staff Login
                </Link>
                <Link to="/student/preorder"
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-8 py-4 text-base font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Student Pre-order
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 lg:justify-start">
                {[['12,482', 'Items Tracked'], ['15+', 'Departments'], ['99.9%', 'Accuracy']].map(([val, label]) => (
                  <div key={label} className="text-center lg:text-left">
                    <p className="text-2xl font-black text-[#b81430]">{val}</p>
                    <p className="text-xs text-slate-500 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative w-full flex-1 lg:max-w-xl">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl border-8 border-white dark:border-slate-800 shadow-2xl bg-gradient-to-br from-[#b81430]/20 to-slate-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-[#b81430] text-8xl mb-4 block">inventory_2</span>
                  <p className="text-slate-600 font-semibold text-lg">CIT-U Inventory System</p>
                  <p className="text-slate-400 text-sm mt-2">Smart Campus Resource Management</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-bold">99.9% Accuracy</p>
                  <p className="text-xs text-slate-500">Real-time tracking enabled</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 p-3 shadow-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b81430]/10 text-[#b81430]">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                </div>
                <div>
                  <p className="text-xs font-bold">+4.2% This Month</p>
                  <p className="text-[10px] text-slate-500">Items processed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-white dark:bg-[#211114]/50 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Powerful Features for Efficient Control</h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Custom-built modules to meet the unique requirements of various academic and administrative departments.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon, title, desc }) => (
                <div key={title} className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-8 transition-all hover:border-[#b81430]/20 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 shadow-sm hover:shadow-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#b81430]/10 text-[#b81430] transition-colors group-hover:bg-[#b81430] group-hover:text-white">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[#b81430] px-6 py-20 lg:px-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to optimize your department's inventory?
            </h2>
            <p className="max-w-2xl text-lg text-white/80">
              Join over 15+ university departments already using our system to reduce waste and improve resource availability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#b81430] shadow-xl hover:bg-slate-50 transition-colors">
                Request Access
              </Link>
              <button className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white hover:bg-white/20 transition-colors">
                Contact IT Helpdesk
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 text-slate-400 dark:bg-[#211114]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#b81430] text-white">
                  <span className="material-symbols-outlined text-xl">inventory_2</span>
                </div>
                <h2 className="text-lg font-bold text-white">CIT-U Inventory</h2>
              </div>
              <p className="text-sm leading-relaxed">A specialized resource planning tool for Cebu Institute of Technology - University.</p>
            </div>
            {[
              { title: 'Resources', links: ['User Manual', 'Audit Templates', 'System Status', 'Staff Directory'] },
              { title: 'Support', links: ['IT Service Desk', 'Report an Issue', 'Privacy Policy', 'Terms of Service'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h3 className="mb-6 font-bold text-white">{title}</h3>
                <ul className="flex flex-col gap-4 text-sm">
                  {links.map((l) => <li key={l}><a href="#" className="hover:text-[#b81430] transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="mb-6 font-bold text-white">Location</h3>
              <div className="rounded-lg overflow-hidden h-32 bg-slate-800 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <span className="material-symbols-outlined text-3xl">location_on</span>
                  <p className="text-xs mt-1">Cebu City</p>
                </div>
              </div>
              <p className="mt-4 text-xs">N. Bacalso Avenue, Cebu City, 6000</p>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-800 pt-8 text-center text-xs">
            <p>© 2024 Cebu Institute of Technology - University. All rights reserved. Managed by the ICT Department.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
