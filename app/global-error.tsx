'use client';

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 antialiased`}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-4xl shadow-2xl p-8 text-center border border-slate-100">
            <div className="bg-red-50 w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">A critical error occurred</h2>
            <p className="text-slate-500 font-medium mb-8">
              The application encountered an unexpected issue. We apologize for the inconvenience.
            </p>
            <button
              onClick={() => reset()}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

