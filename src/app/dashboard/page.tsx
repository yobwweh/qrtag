"use client";

import React, { useEffect, useState } from "react";
import { TagService } from "@/features/tags/services/tag.service";
import { Tag } from "@/features/tags/models/tag.model";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";

export default function DashboardPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "assigned" | "free">("all");

  useEffect(() => {
    async function load() {
      const data = await TagService.getAllTags();
      setTags(data);
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
    if (filter === "assigned") return tag.isAssigned;
    if (filter === "free") return !tag.isAssigned;
    return true;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Chargement...</p>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#F7F8FA]">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">QRTAG PRO</h1>
                <p className="text-xs text-gray-500">Logistics Manager v2.4</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserMenu />
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* TITRE & STATS */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Vue d'Ensemble de l'Inventaire
              <span className="ml-3 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {tags.length} ÉLÉMENTS
              </span>
            </h2>
            <p className="text-gray-600">Gérez les niveaux de stock et suivez les emplacements en temps réel.</p>
          </div>

          {/* FILTRES */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter("assigned")}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === "assigned" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
            >
              En Stock
            </button>
            <button
              onClick={() => setFilter("free")}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${filter === "free" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
            >
              Disponibles
            </button>
            <div className="ml-auto">
              <Link
                href="/admin"
                className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouvelle Entrée
              </Link>
            </div>
          </div>

          {/* LISTE DES TAGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTags.map((tag) => (
              <div key={tag.id} className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
                {/* HEADER CARTE */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold ${tag.isAssigned ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-500"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${tag.isAssigned ? "bg-blue-600" : "bg-gray-400"}`}></div>
                        {tag.id}
                      </div>
                      {tag.category && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {tag.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{tag.reference || "Tag Non Assigné"}</h3>
                    <p className="text-xs text-gray-500 mt-1">ID: {tag.id}</p>
                  </div>
                </div>

                {/* METADONNEES */}
                <div className="space-y-2 mb-4">
                  {Object.entries(tag.metadata).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold truncate max-w-[150px]">{value}</span>
                    </div>
                  ))}
                  {Object.keys(tag.metadata).length === 0 && (
                    <p className="text-xs text-gray-400 italic">Aucune métadonnée</p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/scan/${tag.id}`}
                    className="flex-1 text-center py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Modifier
                  </Link>
                  {tag.isAssigned && (
                    <button
                      onClick={(e) => handleResetTag(e, tag.id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Libérer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CARTE ADD NEW */}
          {filteredTags.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 font-medium">Aucun tag dans cette catégorie</p>
            </div>
          )}
        </div>

        {/* FOOTER STATUS */}
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Système En Ligne</span>
            </div>
            <span>Serveur: US-East-1 · Latence: 24ms</span>
          </div>
        </footer>
      </main>
    </ProtectedRoute>
  );
}