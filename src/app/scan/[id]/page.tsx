import React, { use, useState, useEffect, useRef } from "react";
import { useTagController } from "@/features/tags/controllers/tag.controller";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";

export default function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { tag, loading, isSubmitting, handleSave, updateLocalMetadata, removeLocalField, handleReset } = useTagController(id);

  const [refValue, setRefValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recentLots, setRecentLots] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tag.reference) setRefValue(tag.reference);

    // Charger l'historique des lots depuis LocalStorage
    const savedLots = localStorage.getItem("recent_lots");
    if (savedLots) {
      setRecentLots(JSON.parse(savedLots));
    }

    // Auto-focus sur le champ HP dès le chargement
    if (!loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [tag.reference, loading]);

  const validateAndSave = async (ref: string) => {
    if (!ref.trim()) {
      setError("Le numéro de lot est obligatoire.");
      return;
    }
    if (ref.trim().length < 3) {
      setError("Le lot doit comporter au moins 3 caractères.");
      return;
    }

    setError(null);

    // Sauvegarder dans l'historique local
    const updatedHistory = [ref, ...recentLots.filter(l => l !== ref)].slice(0, 5);
    setRecentLots(updatedHistory);
    localStorage.setItem("recent_lots", JSON.stringify(updatedHistory));

    await handleSave(ref);
  };

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
              <UserMenu />
              <button className={`px-3 py-1 rounded-lg text-xs font-semibold ${tag.isAssigned ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                {tag.isAssigned ? "● Actif" : "Inactif"}
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
              <button
                onClick={() => window.location.reload()}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Rafraîchir"
              >
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
              Prêt pour injection
            </p>
          </div>

          {/* FORMULAIRE */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="space-y-6">
              {/* Référence */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Numéro de Lot / Produit
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="e.g. B-2023-001"
                  value={refValue}
                  onChange={(e) => {
                    setRefValue(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && validateAndSave(refValue)}
                  className={`w-full px-4 py-4 bg-gray-50 border ${error ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-200'} rounded-2xl text-lg font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all`}
                />
                {error && <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>}

                {/* HISTORIQUE RECÉNT */}
                {recentLots.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wide">Récemment utilisés</p>
                    <div className="flex flex-wrap gap-2">
                      {recentLots.map((lot) => (
                        <button
                          key={lot}
                          onClick={() => {
                            setRefValue(lot);
                            setError(null);
                            inputRef.current?.focus();
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 border border-blue-100 transition-colors"
                        >
                          {lot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Métadonnées existantes */}
              {Object.entries(tag.metadata).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Détails Personnalisés</h3>
                  {Object.entries(tag.metadata).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateLocalMetadata(key, e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
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
                </div>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-8 bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 text-gray-500 hover:text-gray-700 font-bold transition-colors text-sm"
              >
                Annuler
              </Link>
              <div className="flex-1"></div>
              {tag.isAssigned && (
                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
                >
                  Libérer
                </button>
              )}
              <button
                onClick={() => validateAndSave(refValue)}
                disabled={isSubmitting}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
              >
                {isSubmitting ? "Enregistrement..." : "Valider l'Injection"}
                <svg className="w-5 h-5 italic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-center mt-6 text-gray-400 text-xs font-medium">
            Astuce : Appuyez sur <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-600">Entrée</kbd> pour valider rapidement.
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
