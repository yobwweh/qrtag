"use client";

import React, { use, useState, useEffect } from "react";
import { useTagController } from "@/features/tags/controllers/tag.controller";
import Link from "next/link";

export default function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { tag, loading, isSubmitting, handleSave, updateLocalMetadata, removeLocalField, handleReset } = useTagController(id);

  const [refValue, setRefValue] = useState("");

  useEffect(() => {
    if (tag.reference) setRefValue(tag.reference);
  }, [tag.reference]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Chargement...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#EEF0F5] relative">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">QRTAG PRO</h1>
              <p className="text-xs text-gray-500">INVENTORY INJECTION</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`px-3 py-1 rounded-lg text-xs font-semibold ${tag.isAssigned ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
              {tag.isAssigned ? "● Active" : "Inactive"}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* TAG INFO CARD */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Référence Tag Actuelle</span>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <h2 className="text-3xl font-bold text-blue-600 mb-2">{id}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Scanned just now
          </p>
        </div>

        {/* FORMULAIRE */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          {/* Champs générés dynamiquement à partir de metadata */}
          <div className="space-y-4">
            {/* Référence */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Numéro de Lot
              </label>
              <input
                type="text"
                placeholder="e.g. B-2023-001"
                value={refValue}
                onChange={(e) => setRefValue(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Métadonnées existantes */}
            {Object.entries(tag.metadata).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateLocalMetadata(key, e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    onClick={() => removeLocalField(key)}
                    className="px-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Zone Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes Additionnelles
              </label>
              <textarea
                placeholder="Ajoutez des instructions ou remarques..."
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 bg-gray-900 rounded-2xl p-5 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-gray-300 hover:text-white font-semibold transition-colors"
          >
            Annuler
          </Link>
          <div className="flex items-center gap-3">
            {tag.isAssigned && (
              <button
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-5 py-2 text-red-400 hover:text-red-300 font-semibold transition-colors disabled:opacity-50"
              >
                Libérer le Tag
              </button>
            )}
            <button
              onClick={() => handleSave(refValue)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Enregistrement..." : "Injecter le Tag"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <span className="text-xs text-gray-500">Appuyez sur <kbd className="px-2 py-1 bg-gray-800 rounded">Entrée</kbd> pour valider</span>
        </div>
      </div>
    </main>
  );
}