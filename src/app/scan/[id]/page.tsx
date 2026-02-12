"use client";

import React, { use, useState, useEffect } from "react";
import { useTagController } from "@/features/tags/controllers/tag.controller";
import Link from "next/link";

export default function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { tag, loading, isSubmitting, handleSave, updateLocalMetadata, removeLocalField, handleReset } = useTagController(id);

  const [newKey, setNewKey] = useState("");
  const [refValue, setRefValue] = useState("");

  useEffect(() => {
    if (tag.reference) setRefValue(tag.reference);
  }, [tag.reference]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-black italic text-3xl animate-pulse">QRTAG PRO...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center relative">
      {/* BOUTON RETOUR FLOTTANT */}
      <Link href="/dashboard" className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 text-xl font-bold hover:bg-slate-50 active:scale-95 transition-all">
        ←
      </Link>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-white mt-10">
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-2xl font-black italic tracking-tighter">QRTAG PRO</h1>
          <p className="text-blue-400 text-[10px] font-mono mt-2 uppercase tracking-[0.3em]">{tag.id}</p>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Référence Globale</label>
            <input
              type="text"
              value={refValue}
              onChange={(e) => setRefValue(e.target.value)}
              className="w-full text-2xl font-bold bg-slate-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Ex: Palette A-12..."
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase text-slate-400">Métadonnées</label>
            {Object.entries(tag.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex-1">
                  <span className="text-[9px] font-black text-blue-600 block uppercase mb-1">{key}</span>
                  <input className="w-full font-bold text-slate-700 outline-none text-sm" value={value} onChange={(e) => updateLocalMetadata(key, e.target.value)} />
                </div>
                <button type="button" onClick={() => removeLocalField(key)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full font-bold">×</button>
              </div>
            ))}

            <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl">
              <input type="text" placeholder="Nom du champ..." value={newKey} onChange={(e) => setNewKey(e.target.value)} className="flex-1 bg-transparent px-4 py-2 text-sm outline-none" />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); if (newKey) { updateLocalMetadata(newKey, ""); setNewKey(""); } }}
                className="bg-white text-slate-900 px-6 py-2 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all"
              >
                AJOUTER
              </button>
            </div>
          </div>

          <button onClick={() => handleSave(refValue)} disabled={isSubmitting} className="w-full mt-10 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-200">
            {isSubmitting ? "SYNC..." : "VALIDER"}
          </button>

          {/* BOUTON SOFT DELETE */}
          <button
            onClick={handleReset}
            disabled={isSubmitting || !tag.isAssigned}
            className={`w-full mt-4 py-4 rounded-[2rem] font-bold text-sm transition-all ${!tag.isAssigned ? 'hidden' : 'bg-red-50 text-red-500 hover:bg-red-100 active:scale-95'}`}
          >
            LIBÉRER LE TAG
          </button>
        </div>
      </div>
    </main>
  );
}