'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Plus, Trash2, MapPin, Phone, Hash, Search, LayoutDashboard, Settings, Bell, ArrowRight, Edit3, MinusCircle, RotateCcw, X, ShieldCheck, Sun, Moon, Sparkles, Users, ShieldAlert } from 'lucide-react';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  address: string;
  count: number;
  createdAt: string;
  addedBy?: string;
}

interface AdminRecord {
  _id: string;
  name: string;
  phone: string;
  adminID: string;
  role: string;
  createdAt: string;
  customerCount?: number;
}

export default function Dashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'customers' | 'settings' | 'admins'>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark' | 'glass'>('glass');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [lastDeleted, setLastDeleted] = useState<Customer | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const [popSms, setPopSms] = useState<{ show: boolean, message: string, type: 'info' | 'warning' }>({ show: false, message: '', type: 'info' });
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const storedTheme = localStorage.getItem('site-theme') as any;
    if (storedTheme) setTheme(storedTheme);
    
    if (!storedAdmin) {
      router.push('/login');
    } else {
      const adminData = JSON.parse(storedAdmin);
      setAdmin(adminData);
      fetchCustomers();
      if (adminData.role === 'superadmin') {
        fetchAdmins();
      }
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'glass') => {
    setTheme(newTheme);
    localStorage.setItem('site-theme', newTheme);
  };

  const fetchCustomers = async () => {
    try {
      const storedAdmin = localStorage.getItem('admin');
      if (!storedAdmin) return;
      const adminData = JSON.parse(storedAdmin);
      
      const res = await fetch(`/api/customers?adminID=${adminData.adminID}&role=${adminData.role}`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admins');
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingCustomer ? '/api/customers' : '/api/customers';
      const method = editingCustomer ? 'PATCH' : 'POST';
      const body = editingCustomer 
        ? { id: editingCustomer._id, ...formData }
        : { ...formData, addedBy: admin.adminID };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ name: '', phone: '', address: '' });
        setEditingCustomer(null);
        fetchCustomers();

        // Trigger pop notification if visits > 3
        if (data.customer && data.customer.count > 3) {
          setPopSms({
            show: true,
            message: `POP SMS: Customer ${data.customer.name} has exceeded 3 visits! (Current: ${data.customer.count})`,
            type: 'warning'
          });
          setTimeout(() => setPopSms(prev => ({ ...prev, show: false })), 6000);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecrement = async (id: string) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'decrement' }),
      });
      if (res.ok) fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (customer: Customer) => {
    try {
      const res = await fetch(`/api/customers?id=${customer._id}`, { method: 'DELETE' });
      if (res.ok) {
        setLastDeleted(customer);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 5000);
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!lastDeleted) return;
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lastDeleted.name,
          phone: lastDeleted.phone,
          address: lastDeleted.address,
        }),
      });
      if (res.ok) {
        setShowUndo(false);
        setLastDeleted(null);
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', address: '' });
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addedThisMonth = customers.filter(c => {
    const createdDate = new Date(c.createdAt);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length;

  if (!admin) return null;

  const themeClasses = {
    light: 'bg-white text-slate-900',
    dark: 'bg-slate-950 text-slate-100',
    glass: 'bg-[#f8fafc] text-slate-900'
  };

  const cardClasses = {
    light: 'bg-white border-slate-200 shadow-sm',
    dark: 'bg-slate-900 border-white/5 shadow-none text-white',
    glass: 'bg-white border-slate-100 shadow-sm'
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${themeClasses[theme]}`}>
      {/* Sidebar */}
      <aside className={`hidden lg:flex w-72 flex-col fixed inset-y-0 shadow-2xl z-50 ${
        theme === 'dark' ? 'bg-slate-900 border-r border-white/5' : 'bg-slate-900'
      }`}>
        <div className="p-8 flex items-center space-x-3">
          <div className="bg-primary-500 p-2.5 rounded-xl shadow-lg shadow-primary-500/20">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-black text-xl tracking-tight">CRM Cloud</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3 font-bold transition-all border ${
              currentView === 'dashboard' 
                ? 'bg-primary-600/10 text-primary-400 border-primary-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setCurrentView('customers')}
            className={`w-full px-4 py-3 rounded-xl flex items-center justify-between font-bold transition-all border ${
              currentView === 'customers' 
                ? 'bg-primary-600/10 text-primary-400 border-primary-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5" />
              <span>Customers</span>
            </div>
            {addedThisMonth > 0 && (
              <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded-md border border-green-500/30">
                +{addedThisMonth}
              </span>
            )}
          </button>
          {admin.role === 'superadmin' && (
            <button 
              onClick={() => setCurrentView('admins')}
              className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3 font-bold transition-all border ${
                currentView === 'admins' 
                  ? 'bg-primary-600/10 text-primary-400 border-primary-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Admins List</span>
            </button>
          )}
          <button 
            onClick={() => setCurrentView('settings')}
            className={`w-full px-4 py-3 rounded-xl flex items-center space-x-3 font-bold transition-all border ${
              currentView === 'settings' 
                ? 'bg-primary-600/10 text-primary-400 border-primary-600/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-linear-to-tr from-primary-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg relative group">
              {admin.name.charAt(0)}
              {admin.role === 'superadmin' && (
                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 border-2 border-slate-900" title="Superadmin">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-white text-sm font-bold truncate">{admin.name}</p>
                {admin.role === 'superadmin' && <Sparkles className="w-3 h-3 text-amber-400" />}
              </div>
              <p className="text-slate-500 text-xs font-mono truncate">{admin.adminID}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Header */}
        <header className={`backdrop-blur-md border-b sticky top-0 z-40 px-4 md:px-8 h-20 flex items-center justify-between transition-colors duration-500 ${
          theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-100'
        }`}>
          <div className="relative max-w-md w-full hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className={`w-full pl-10 pr-4 py-2.5 border-none rounded-2xl focus:ring-2 focus:ring-primary-500/10 outline-none text-sm font-medium transition-colors ${
                theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
            </button>
            <div className={`h-8 w-px hidden md:block ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}></div>
            <div className="flex items-center space-x-3 ml-2">
              <p className={`text-sm font-bold hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{admin.name}</p>
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center lg:hidden" onClick={handleLogout}>
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {currentView === 'dashboard' ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Form Section */}
              <div className="xl:col-span-4 space-y-8">
                <div className={`glass rounded-4xl p-8 shadow-xl border relative transition-all duration-500 ${
                   theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-white/50 border-white/50'
                }`}>
                  {editingCustomer && (
                    <button 
                      onClick={cancelEdit}
                      className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {editingCustomer ? 'Update Details' : 'Register Customer'}
                    </h2>
                    <div className={`p-2 rounded-xl ${editingCustomer ? 'bg-orange-50 text-orange-600' : 'bg-primary-50 text-primary-600'}`}>
                      {editingCustomer ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all font-medium ${
                          theme === 'dark' ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-50 text-slate-900'
                        }`}
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all font-medium ${
                          theme === 'dark' ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-50 text-slate-900'
                        }`}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Customer Address</label>
                      <textarea
                        required
                        rows={3}
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all font-medium resize-none ${
                          theme === 'dark' ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-50 text-slate-900'
                        }`}
                        placeholder="Enter full address here..."
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitting}
                      className={`w-full py-4 rounded-2xl font-black transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.98] ${
                        editingCustomer 
                          ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-200' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200'
                      }`}
                    >
                      <span>{submitting ? 'Processing...' : (editingCustomer ? 'Update Customer' : 'Add Customer')}</span>
                      {!submitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                    
                    {editingCustomer && (
                      <button 
                        type="button"
                        onClick={cancelEdit}
                        className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-all text-sm"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* List Section (Brief) */}
              <div className="xl:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <p className="text-slate-500 font-medium">Tracking <span className="text-primary-600">{customers.length}</span> total</p>
                    <div className={`h-4 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                    <p className="text-slate-500 font-medium">
                      <span className="text-green-600 font-bold">{addedThisMonth}</span> added this month
                    </p>
                  </div>
                </div>
                  <button 
                    onClick={() => setCurrentView('customers')}
                    className={`px-6 py-2 rounded-2xl text-sm font-bold border shadow-sm transition-all flex items-center space-x-2 ${
                      theme === 'dark' ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                    }`}
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-48 rounded-4xl border animate-pulse ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}></div>
                    ))}
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className={`rounded-4xl p-20 text-center border-2 border-dashed ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                    <div className="bg-slate-50 w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-6">
                      <Search className="text-slate-300 w-10 h-10" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No customers found</h3>
                    <p className="text-slate-500 font-medium">Start by adding your first customer on the left.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCustomers.slice(0, 4).map((customer) => (
                      <div key={customer._id} className={`rounded-4xl p-6 border shadow-sm hover:shadow-xl transition-all group relative card-hover overflow-hidden ${cardClasses[theme]}`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:bg-primary-100 transition-colors opacity-10"></div>
                        
                        <div className="relative">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl border border-slate-100 shadow-inner">
                                {customer.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className={`font-black text-lg truncate max-w-[150px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{customer.name}</h3>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">Verified Customer</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={() => startEdit(customer)}
                                className="text-slate-400 hover:text-blue-500 p-2 rounded-xl transition-all hover:bg-blue-50/10"
                                title="Edit Customer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(customer)}
                                className="text-slate-400 hover:text-red-500 p-2 rounded-xl transition-all hover:bg-red-50/10"
                                title="Delete Customer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className={`flex items-center text-sm px-4 py-3 rounded-2xl font-medium ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                              <Phone className="w-4 h-4 mr-3 text-slate-400" />
                              {customer.phone}
                            </div>
                            <div className={`flex items-start text-sm px-4 py-3 rounded-2xl font-medium min-h-[80px] ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                              <MapPin className="w-4 h-4 mr-3 text-slate-400 mt-1 shrink-0" />
                              <span className="leading-relaxed truncate line-clamp-2">
                                {customer.address}
                              </span>
                            </div>
                          </div>

                          <div className={`mt-6 flex items-center justify-between pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                            <div className="flex items-center space-x-2 text-primary-600">
                              <Hash className="w-4 h-4" />
                              <span className="text-sm font-black tracking-tight">{customer.count} Visits Recorded</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : currentView === 'customers' ? (
            /* Full Customers View */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className={`text-3xl font-black tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Customer Directory</h2>
                  <div className="flex items-center space-x-4">
                    <p className="text-slate-500 font-medium">Managing <span className="text-primary-600 font-bold">{customers.length}</span> active records</p>
                    <div className={`h-4 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                    <p className="text-slate-500 font-medium">
                      <span className="text-green-600 font-bold">{addedThisMonth}</span> joined this month
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="relative group flex-1 md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search directory..."
                      className={`w-full pl-10 pr-4 py-3 border rounded-2xl focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none text-sm font-medium shadow-sm transition-all ${
                        theme === 'dark' ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-900'
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add New</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className={`rounded-4xl border p-8 shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-16 rounded-2xl animate-pulse ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}></div>
                    ))}
                  </div>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className={`rounded-4xl p-20 text-center border-2 border-dashed ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="bg-slate-50 w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-6">
                    <Search className="text-slate-300 w-10 h-10" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No records found</h3>
                  <p className="text-slate-500 font-medium">Adjust your search or add a new customer to the database.</p>
                </div>
              ) : (
                <div className={`rounded-4xl border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                          <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                          <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Address</th>
                          {admin.role === 'superadmin' && <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Added By</th>}
                          <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Engagement</th>
                          <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                        {filteredCustomers.map((customer) => (
                          <tr key={customer._id} className="hover:bg-primary-500/5 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center space-x-4">
                                <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center font-bold text-primary-600 border border-primary-100">
                                  {customer.name.charAt(0)}
                                </div>
                                <div>
                                  <p className={`font-bold truncate max-w-[150px] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{customer.name}</p>
                                  <p className="text-xs text-slate-400 font-medium tracking-tight">ID: {customer._id.slice(-6).toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className={`flex items-center font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                                {customer.phone}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className={`flex items-start text-sm max-w-[250px] font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 mt-1 shrink-0" />
                                <span className="line-clamp-1">{customer.address}</span>
                              </div>
                            </td>
                            {admin.role === 'superadmin' && (
                              <td className="px-8 py-5">
                                <span className="text-xs font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200">
                                  {customer.addedBy || 'N/A'}
                                </span>
                              </td>
                            )}
                            <td className="px-8 py-5">
                              <div className="flex items-center">
                                <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                                  customer.count > 5 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                  {customer.count} Visits
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => startEdit(customer)}
                                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50/10 rounded-xl transition-all"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDecrement(customer._id)}
                                  className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50/10 rounded-xl transition-all"
                                  title="Remove Visit"
                                >
                                  <MinusCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(customer)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/10 rounded-xl transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : currentView === 'admins' ? (
            /* Admins View (Superadmin only) */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className={`text-3xl font-black tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Administrative Team</h2>
                <p className="text-slate-500 font-medium">Full access to system administrators and their metrics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-4xl border ${cardClasses[theme]}`}>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Admins</p>
                  <p className="text-4xl font-black text-primary-600">{admins.length}</p>
                </div>
                <div className={`p-6 rounded-4xl border ${cardClasses[theme]}`}>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Customers</p>
                  <p className="text-4xl font-black text-blue-600">{customers.length}</p>
                </div>
                <div className={`p-6 rounded-4xl border ${cardClasses[theme]}`}>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">System Health</p>
                  <p className="text-4xl font-black text-green-600">Optimal</p>
                </div>
              </div>

              <div className={`rounded-4xl border shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Admin Name</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Customers Added</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Admin ID</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                      {admins.map((adminRec) => (
                        <tr key={adminRec._id} className="hover:bg-primary-500/5 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-4">
                              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                                {adminRec.name.charAt(0)}
                              </div>
                              <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{adminRec.name}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full border border-green-100 shadow-sm animate-in zoom-in duration-500">
                              <Users className="w-3.5 h-3.5" />
                              <span className="text-sm font-black tracking-tight">{adminRec.customerCount || 0}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className={`flex items-center font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                              <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                              {adminRec.phone}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <code className="text-xs font-black bg-primary-50 text-primary-600 px-2 py-1 rounded-lg border border-primary-100 uppercase tracking-tighter">
                              {adminRec.adminID}
                            </code>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <p className="text-sm font-medium text-slate-400 italic">
                              {new Date(adminRec.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Settings View */
            <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className={`text-3xl font-black tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>System Settings</h2>
                <p className="text-slate-500 font-medium">Customize your administrative workspace experience</p>
              </div>

              <div className={`rounded-4xl border p-8 shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Personalization</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 block">Select Site Theme</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => handleThemeChange('glass')}
                        className={`p-6 rounded-4xl border-2 transition-all text-left group relative overflow-hidden ${
                          theme === 'glass' 
                            ? 'border-primary-500 bg-primary-50/10' 
                            : theme === 'dark' ? 'border-white/5 bg-slate-800 hover:border-white/20' : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-4 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Modern Glass</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Clean, transparent design with soft shadows (Default)</p>
                        {theme === 'glass' && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>}
                      </button>

                      <button 
                        onClick={() => handleThemeChange('light')}
                        className={`p-6 rounded-4xl border-2 transition-all text-left group relative overflow-hidden ${
                          theme === 'light' 
                            ? 'border-primary-500 bg-primary-50/10' 
                            : theme === 'dark' ? 'border-white/5 bg-slate-800 hover:border-white/20' : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-4 flex items-center justify-center border border-slate-100">
                          <Sun className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>High Contrast</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Maximum readability with bright whites and sharp text</p>
                        {theme === 'light' && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>}
                      </button>

                      <button 
                        onClick={() => handleThemeChange('dark')}
                        className={`p-6 rounded-4xl border-2 transition-all text-left group relative overflow-hidden ${
                          theme === 'dark' 
                            ? 'border-primary-500 bg-slate-900' 
                            : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                        }`}
                      >
                        <div className="w-12 h-12 bg-slate-800 rounded-xl shadow-sm mb-4 flex items-center justify-center">
                          <Moon className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Deep Space</p>
                        <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Dark mode optimized for low-light environments</p>
                        {theme === 'dark' && <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full"></div>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-4xl border p-8 shadow-sm opacity-50 cursor-not-allowed ${theme === 'dark' ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center space-x-4 mb-4">
                   <div className="bg-slate-100 text-slate-400 p-3 rounded-2xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security & Privacy</h3>
                </div>
                <p className="text-sm font-medium text-slate-400 ml-14">More administrative settings coming soon in v3.0</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Undo Toast */}
      {showUndo && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 animate-in slide-in-from-bottom duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-6">
            <span className="text-sm font-bold">Customer data removed.</span>
            <button 
              onClick={handleUndo}
              className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-black text-sm uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Undo Deletion</span>
            </button>
          </div>
        </div>
      )}

      {/* Pop SMS Alert */}
      {popSms.show && (
        <div className="fixed top-24 right-8 z-100 animate-in slide-in-from-right duration-500 max-w-sm">
          <div className="bg-amber-600 text-white p-5 rounded-3xl shadow-[0_20px_50px_rgba(217,119,6,0.3)] border-2 border-amber-400/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-200"></div>
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-1 opacity-80">Pop SMS Notification</h4>
                <p className="font-bold text-sm leading-relaxed">{popSms.message}</p>
              </div>
              <button 
                onClick={() => setPopSms(prev => ({ ...prev, show: false }))}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Progress bar for auto-dismiss */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-[shrink_6s_linear_forwards]"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add custom animation for progress bar
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `;
  document.head.appendChild(style);
}
