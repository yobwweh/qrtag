"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#F7F8FA] flex flex-col">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">QRTAG PRO</h1>
              <p className="text-xs text-gray-500">Logistics Hub</p>
            </div>
          </div>
          <div>
            <UserMenu />
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* STATUS */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">System Operational</span>
          </div>

          {/* TITLE */}
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center mb-3">
            Hub Logistique Central
          </h2>
          <p className="text-gray-600 text-center max-w-md mb-12">
            Gérez le flux d'inventaire et générez des actifs. Scannez un tag pour commencer.
          </p>

          {/* CARDS GRID */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* INVENTORY CARD */}
            <Link href="/dashboard" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inventaire</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Gérez les niveaux de stock, les transferts et l'historique.
                </p>
                <span className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1">
                  Voir le Tableau →
                </span>
              </div>
            </Link>

            {/* SCAN NOW CARD (CENTER) */}
            <Link href="/scan" className="bg-blue-600 rounded-3xl p-8 shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center text-center h-full">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">SCANNER</h3>
                <p className="text-sm text-blue-100">Appuyez sur Espace pour Scanner</p>
              </div>
            </Link>

            {/* GENERATOR CARD */}
            <Link href="/admin" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Générateur</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Créez de nouveaux tags, imprimez des étiquettes et attribuez des IDs.
                </p>
                <span className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1">
                  Créer un Tag →
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 text-center">
          <p className="text-xs text-gray-400">© 2026 QRTAG Logistics Systems. </p>
        </footer>
      </main>
    </ProtectedRoute>
  );
}