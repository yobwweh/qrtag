"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 mb-6">
          <span className="text-white text-4xl font-black italic">Q</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">QRTAG PRO</h1>
        <p className="text-slate-500 font-medium max-w-xs mx-auto">
          Gestion intelligente d'inventaire par injection de données QR.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        <Link href="/dashboard" className="group p-6 bg-slate-900 rounded-[2rem] text-left transition-all hover:bg-slate-800 active:scale-95">
          <h2 className="text-white text-xl font-bold mb-1">Inventaire</h2>
          <p className="text-slate-400 text-sm">Voir et modifier vos tags existants.</p>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin" className="p-6 bg-blue-50 rounded-[2rem] text-left hover:bg-blue-100 transition-all">
            <h2 className="text-blue-900 text-lg font-bold">Générer</h2>
            <p className="text-blue-700/60 text-xs">25 nouveaux codes</p>
          </Link>
          
          <button className="p-6 bg-green-50 rounded-[2rem] text-left hover:bg-green-100 transition-all opacity-50 cursor-not-allowed">
            <h2 className="text-green-900 text-lg font-bold">Scan</h2>
            <p className="text-green-700/60 text-xs">Caméra (Bientôt)</p>
          </button>
        </div>
      </div>

      <footer className="mt-20 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
        Propulsé par Next.js & Supabase
      </footer>
    </main>
  );
}