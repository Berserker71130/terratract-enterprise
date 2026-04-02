"use client";
import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          TERRATRACT
        </h1>
        <p className="text-xl text-slate-400 mb-8 font-light tracking-wide">
          Bridging The Gap Between Modern Machinery & The African Farmer.
          <br />
          <span className="text-emerald-500/50 italic text-sm">
            Engineered in Jos, Nigeria
          </span>
        </p>

        {/* The bridge button */}
        <Link href="/lease">
          <button className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl shadow-emerald-900/20">
            ENTER ENGINE ROOM →
          </button>
        </Link>
      </div>

      {/* Feature Grid - Simple & Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full">
        <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50">
          <h3 className="text-emerald-400 font-bold mb-2">Precision</h3>
          <p className="text-sm text-slate-500">
            Advanced 12B-grade mechanical schematics for every unit.
          </p>
        </div>

        <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50">
          <h3 className="text-emerald-400 font-bold mb-2">Transparency</h3>
          <p className="text-sm text-slate-500">
            No hidden fees. Just direct access to the soil.
          </p>
        </div>

        <div className="p-6 border border-slate-800 rounded-2xl bg-slate-900/50">
          <h3 className="text-emerald-400 font-bold mb-2">Scalability</h3>
          <p className="text-sm text-slate-500">
            Built on Next.js for global-speed performance.
          </p>
        </div>
      </div>
    </main>
  );
}
