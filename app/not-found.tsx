'use client';

import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-4xl shadow-2xl p-8 text-center border border-slate-100">
        <div className="bg-slate-50 w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-6">
          <Search className="text-slate-300 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Page not found</h2>
        <p className="text-slate-500 font-medium mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link
          href="/"
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

