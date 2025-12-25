import Link from 'next/link';
import { Users, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-4xl w-full px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-float">
            <ShieldCheck className="w-4 h-4" />
            <span>Advanced Admin Dashboard v2.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
            Manage Customers <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-blue-500">
              With Precision.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The ultimate CRM for tracking customer details, locations, and engagement. 
            Smart duplicate detection and interactive map integration included.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass p-8 rounded-3xl card-hover">
            <div className="bg-primary-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-200">
              <Users className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Manual Control</h3>
            <p className="text-slate-500">Add, edit, and organize customer data with a seamless administrative interface.</p>
          </div>
          <div className="glass p-8 rounded-3xl card-hover">
            <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <MapPin className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Tracking</h3>
            <p className="text-slate-500">Pinpoint customer locations on an interactive map for better geographical insights.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login" 
            className="group w-full sm:w-auto py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/register" 
            className="w-full sm:w-auto py-4 px-8 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:border-primary-200 hover:bg-slate-50 transition-all text-center"
          >
            Create Account
          </Link>
        </div>
        
        <p className="mt-12 text-center text-slate-400 text-sm font-medium">
          Trusted by over 500+ Indian businesses.
        </p>
      </div>
    </main>
  );
}

