"use client";

import React, { useEffect, useState } from "react";
import { TagService } from "@/features/tags/services/tag.service";
import { Tag } from "@/features/tags/models/tag.model";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import { HistoryService } from "@/features/history/services/history.service";
import { ActivityLog } from "@/features/history/models/history.model";

export default function DashboardPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [history, setHistory] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "assigned" | "free">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const [tagsData, historyData] = await Promise.all([
        TagService.getAllTags(),
        HistoryService.getRecentActivity()
      ]);
      setTags(tagsData);
      setHistory(historyData);
      setLoading(false);
    }
    load();
  }, []);

  const handleResetTag = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm("Libérer ce tag ?")) return;

    const success = await TagService.resetTag(id);
    if (success) {
      setTags(prev => prev.map(t => t.id === id ? { ...t, isAssigned: false, metadata: {}, reference: "" } : t));
    }
  };

  const filteredTags = tags.filter(tag => {
    const statusMatch = filter === "all" || (filter === "assigned" ? tag.isAssigned : !tag.isAssigned);
    const categoryMatch = categoryFilter === "all" || tag.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: tags.length,
    assigned: tags.filter(t => t.isAssigned).length,
    free: tags.filter(t => !t.isAssigned).length,
    categories: Array.from(new Set(tags.filter(t => t.category).map(t => t.category))).filter(Boolean) as string[]
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Chargement des données...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#F7F8FA]">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-black text-gray-900 tracking-tighter">QRTAG <span className="text-blue-600 uppercase text-[10px] tracking-widest ml-1">Dashboard</span></h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">v2.4 Pro Edition</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserMenu />
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 py-10 pb-24">
          {/* TITRE & DESCRIPTION */}
          <div className="mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter uppercase">
              Inventaire Global
              <span className="ml-4 text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                {tags.length} TAGS TOTAL
              </span>
            </h2>
            <p className="text-gray-500 font-medium">Suivi en temps réel de vos actifs et flux de stock.</p>
          </div>

          {/* STATS WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard label="Total Actifs" value={stats.total} color="blue" />
            <StatCard label="En Stock" value={stats.assigned} color="green" />
            <StatCard label="Disponibles" value={stats.free} color="orange" />
          </div>

          {/* ACTIONS & FILTRES D'ÉTAT */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
              <button
                onClick={() => setFilter("all")}
                className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter("assigned")}
                className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === "assigned" ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
              >
                En Stock
              </button>
              <button
                onClick={() => setFilter("free")}
                className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filter === "free" ? "bg-orange-500 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"}`}
              >
                Dispos
              </button>
            </div>

            <Link
              href="/admin"
              className="px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle Entrée
            </Link>
          </div>

          {/* FILTRES DE CATÉGORIE (PILLS) */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-5 py-2 rounded-full font-black text-[10px] whitespace-nowrap uppercase tracking-widest transition-all border ${categoryFilter === "all" ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"}`}
            >
              Toutes Catégories
            </button>
            {stats.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-5 py-2 rounded-full font-black text-[10px] whitespace-nowrap uppercase tracking-widest transition-all border ${categoryFilter === cat ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTE DES TAGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${tag.isAssigned ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${tag.isAssigned ? "bg-blue-600 animate-pulse" : "bg-gray-400"}`}></div>
                        {tag.id}
                      </div>
                      {tag.category && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                          {tag.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase">{tag.reference || "Non Assigné"}</h3>
                    <p className="text-[10px] font-bold text-gray-300 mt-1 uppercase tracking-widest">Digital Twin Active</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                  {Object.entries(tag.metadata).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-400 font-bold uppercase tracking-tighter">{key.replace(/_/g, ' ')}</span>
                      <span className="text-gray-900 font-black truncate max-w-[130px] uppercase">{value}</span>
                    </div>
                  ))}
                  {Object.keys(tag.metadata).length === 0 && (
                    <p className="text-[10px] text-gray-400 italic">Aucune donnée technique</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/scan/${tag.id}`}
                    className="flex-1 text-center py-4 px-6 bg-gray-900 text-white rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200"
                  >
                    Manage Tag
                  </Link>
                  {tag.isAssigned && (
                    <button
                      onClick={(e) => handleResetTag(e, tag.id)}
                      className="px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl text-[10px] font-black transition-all border border-transparent hover:border-red-100"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTags.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">Base de données vide</p>
              <p className="text-gray-300 text-[10px] font-bold mt-2 uppercase tracking-widest">Filtres actifs ou aucun tag enregistré.</p>
            </div>
          )}

          {/* RÉCENTES ACTIVITÉS */}
          <div className="mt-20">
            <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-[2px] bg-blue-600"></span>
              Activités Récentes On-Site
            </h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
              {history.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {history.map((log) => (
                    <div key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${log.action === 'INJECTION' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {log.action.substring(0, 3)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 uppercase">{log.reference || log.tagId}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-900 uppercase">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{log.timestamp.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Aucun log d'activité pour le moment</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER STATUS */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full relative"></div>
              </div>
              <span className="text-green-600">Secure Link Established</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <span>Nodes: US-EAST-1</span>
              <span>Latency: 18ms</span>
              <span className="text-blue-500">Cloud Sync: ON</span>
            </div>
            <span>© 2026 QRTAG PRO SYSTEMS</span>
          </div>
        </footer>
      </main>
    </ProtectedRoute>
  );
}

const StatCard = ({ label, value, color }: { label: string, value: number, color: string }) => {
  const colors: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    green: "text-green-600 bg-green-50 border-green-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
  };

  return (
    <div className={`p-8 rounded-[2rem] border bg-white shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-300 flex flex-col gap-2 group cursor-default`}>
      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] group-hover:text-gray-400 transition-colors">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`text-5xl font-black tracking-tighter ${colors[color].split(' ')[0]}`}>{value}</span>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Unités</span>
      </div>
    </div>
  );
};