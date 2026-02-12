"use client";

import React, { useEffect, useState } from "react";
import { TagService } from "@/features/tags/services/tag.service";
import { Tag } from "@/features/tags/models/tag.model";
import Link from "next/link";

export default function DashboardPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await TagService.getAllTags();
      setTags(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleResetTag = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Empêche la navigation vers /scan/[id]
    if (!confirm("Libérer ce tag ?")) return;

    const success = await TagService.resetTag(id);
    if (success) {
      setTags(prev => prev.map(t => t.id === id ? { ...t, isAssigned: false, metadata: {}, reference: "" } : t));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 italic font-black text-slate-300">CHARGEMENT...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            {/* BOUTON RETOUR ACCUEIL */}
            <Link href="/" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-all">
              <span className="text-slate-600 font-bold">←</span>
            </Link>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 font-medium text-sm">Gestion de l'inventaire</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/scan" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8-1a1 1 0 011 1v3a1 1 0 01-1 1h3a1 1 0 011-1V4a1 1 0 01-1-1h-3a1 1 0 01-1 1zm-9 7a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm8 1a1 1 0 011-1h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2z" clipRule="evenodd" />
              </svg>
              SCANNER
            </Link>
            <Link href="/admin" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all">
              + TAGS
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <div key={tag.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-widest">{tag.id}</span>
                <div className={`h-2 w-2 rounded-full ${tag.isAssigned ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-200'}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-4 truncate">{tag.reference || "Tag libre"}</h3>
              <div className="flex-1 space-y-2 mb-6">
                {Object.entries(tag.metadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black text-blue-600 uppercase mb-0.5">{key}</span>
                    <span className="text-sm font-semibold text-slate-700 truncate">{value || "—"}</span>
                  </div>
                ))}
              </div>
              <Link href={`/scan/${tag.id}`} className="w-full text-center py-3 bg-slate-100 text-slate-900 rounded-xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all">
                MODIFIER
              </Link>
              {tag.isAssigned && (
                <button
                  onClick={(e) => handleResetTag(e, tag.id)}
                  className="mt-2 w-full text-center py-2 text-red-400 text-xs font-bold hover:text-red-600 transition-colors"
                >
                  LIBÉRER
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}