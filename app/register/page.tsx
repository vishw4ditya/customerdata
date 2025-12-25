'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck, Phone, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Copy } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [adminID, setAdminID] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setAdminID(data.adminID);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyAdminID = () => {
    if (adminID) {
      navigator.clipboard.writeText(adminID);
      alert('Admin ID copied to clipboard!');
    }
  };

  if (adminID) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-3xl -mr-48 -mt-48 opacity-40"></div>
        <div className="max-w-md w-full relative">
          <div className="glass rounded-4xl shadow-2xl p-8 md:p-10 border border-white/50 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-green-500 p-4 rounded-2xl shadow-xl shadow-green-200 animate-float">
                <CheckCircle2 className="text-white w-8 h-8" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-500 font-medium mb-8">Please save your unique Admin ID. You'll need it if you ever forget your password.</p>
            
            <div className="relative group mb-8">
              <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl font-mono text-2xl font-black text-primary-600 tracking-wider">
                {adminID}
              </div>
              <button 
                onClick={copyAdminID}
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-primary-600 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={() => router.push('/login')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-2"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl -ml-32 -mt-32 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -mr-32 -mb-32 opacity-50"></div>

      <div className="max-w-md w-full relative">
        <div className="glass rounded-4xl shadow-2xl p-8 md:p-10 border border-white/50">
          <div className="flex justify-center mb-8">
            <div className="bg-primary-600 p-4 rounded-2xl shadow-xl shadow-primary-200 animate-float">
              <UserPlus className="text-white w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Admin Sign Up</h2>
            <p className="text-slate-500 font-medium">Create your administrative credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Indian Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center space-x-2 group disabled:opacity-70"
            >
              <span>{loading ? 'Creating Account...' : 'Register Now'}</span>
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              Already an admin? <a href="/login" className="text-primary-600 font-bold hover:underline">Log in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
