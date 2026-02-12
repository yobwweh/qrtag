"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export const GenerateTagsView = ({ count = 25 }: { count?: number }) => {
  const [origin, setOrigin] = useState("");
  const [tags, setTags] = useState<{ id: string }[]>([]);

  useEffect(() => {
    setOrigin(window.location.origin);
    generateNewSet();
  }, []);

  const generateNewSet = () => {
    const newTags = Array.from({ length: count }, (_, i) => ({
      id: `QT-${Math.floor(1000 + Math.random() * 9000)}-${i + 1}`,
    }));
    setTags(newTags);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-10 no-print bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          {/* RETOUR VERS DASHBOARD */}
          <Link href="/dashboard" className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold hover:bg-slate-200 transition-all">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Générateur</h1>
            <p className="text-slate-500 text-sm">Planche de {count} QR Codes</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={generateNewSet} className="px-5 py-2 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50">Régénérer</button>
          <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700">Imprimer</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 print:gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white border border-slate-200 p-4 flex flex-col items-center justify-center rounded-2xl aspect-square">
            {origin ? <QRCodeSVG value={`${origin}/scan/${tag.id}`} size={110} level="H" /> : <div className="w-[110px] h-[110px] bg-slate-100 animate-pulse rounded" />}
            <p className="mt-3 font-mono text-[9px] font-black text-slate-400 uppercase tracking-tighter">{tag.id}</p>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @media print { .no-print { display: none !important; } body { background: white !important; } }
      `}</style>
    </div>
  );
};