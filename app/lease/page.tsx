"use client";

import { useReducer, useState, useEffect } from "react";

// 1. THE DATA FLEET (This is your "Inventory")
const FLEET = [
  { id: 1, name: "John Deere 5075E", type: "Utility Tractor", rate: 45000 },
  { id: 2, name: "CAT 320D", type: "Hydraulic Excavator", rate: 125000 },
  { id: 3, name: "Komatsu GD511", type: "Motor Grader", rate: 95000 },
  { id: 4, name: "Bobcat S450", type: "Skid Steer Loader", rate: 35000 },
];

const initialState = {
  equipment: FLEET[0].name, // Defaults to John Deere
  dailyRate: FLEET[0].rate,
  days: 1,
  total: FLEET[0].rate,
  status: "idle",
};

function leaseReducer(state: any, action: any) {
  switch (action.type) {
    case "SELECT_MACHINE":
      return {
        ...state,
        equipment: action.payload.name,
        dailyRate: action.payload.rate,
        total: state.days * action.payload.rate,
        status: "idle", // Reset status if they change machines
      };
    case "SET_DAYS":
      const newDays = Math.max(1, Number(action.payload) || 0);
      return {
        ...state,
        days: newDays,
        total: newDays * state.dailyRate,
      };
    case "START_LEASE":
      return { ...state, status: "processing" };
    case "LEASE_SUCCESS":
      return { ...state, status: "confirmed" };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export default function Terratract() {
  const [state, dispatch] = useReducer(leaseReducer, initialState);
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-Reset Logic
  useEffect(() => {
    if (state.status === "confirmed") {
      const timer = setTimeout(() => {
        dispatch({ type: "RESET_FORM" });
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

  async function handleLease() {
    if (state.days <= 0) return;
    setIsSyncing(true);
    dispatch({ type: "START_LEASE" });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    dispatch({ type: "LEASE_SUCCESS" });
    setIsSyncing(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 🏛️ TOP NAVIGATION BAR */}
      <nav className="w-full border-b border-slate-800 bg-slate-900/50 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-emerald-500 flex items-center gap-2">
            TERRATRACT{" "}
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-1 rounded border border-emerald-500/20">
              ENTERPRISE v2.6
            </span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
            Mechanical Systems Division • Jos, Nigeria
          </p>
        </div>
        <div className="flex gap-8 text-[10px] font-mono text-slate-400">
          <div className="flex flex-col items-end">
            <span>OPERATOR</span>
            <span className="text-emerald-400">MANASSEH_DEV</span>
          </div>
          <div className="flex flex-col items-end text-right">
            <span>SYSTEM_CLOCK</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </nav>

      {/* 🏛️ MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT COLUMN: CONTROL PANEL */}
        <section className="lg:col-span-4 border-r border-slate-800 p-10 bg-slate-900/20 overflow-y-auto">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 border-b border-slate-800 pb-2">
            Deployment Controls
          </h2>

          <div className="space-y-10">
            {/* NEW: DYNAMIC MACHINE SELECTOR */}
            <div>
              <label className="block text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">
                Select Fleet Unit
              </label>
              <div className="grid grid-cols-1 gap-3">
                {FLEET.map((machine) => (
                  <button
                    key={machine.id}
                    disabled={state.status === "confirmed" || isSyncing}
                    onClick={() =>
                      dispatch({ type: "SELECT_MACHINE", payload: machine })
                    }
                    className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                      state.equipment === machine.name
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50"
                        : "border-slate-800 bg-slate-950/50 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-tight">
                        {machine.name}
                      </span>
                      <span className="text-[9px] font-mono opacity-50">
                        ₦{machine.rate.toLocaleString()}/D
                      </span>
                    </div>
                    <div className="text-[9px] mt-1 opacity-40 uppercase tracking-tighter">
                      {machine.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 uppercase mb-4 tracking-widest">
                Lease Duration (Days)
              </label>
              <input
                type="number"
                value={state.days}
                disabled={state.status === "confirmed" || isSyncing}
                onChange={(e) =>
                  dispatch({ type: "SET_DAYS", payload: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-6 text-4xl font-black text-white focus:border-emerald-500 outline-none transition-all disabled:opacity-30"
              />
            </div>

            <div className="pt-6">
              {state.status === "confirmed" ? (
                <div className="bg-emerald-500 p-8 rounded-xl text-slate-950 animate-in zoom-in duration-300">
                  <h3 className="font-black text-xl uppercase italic leading-none">
                    Protocol Secure
                  </h3>
                  <p className="text-[10px] font-bold mt-2 uppercase tracking-tighter">
                    Handshake successful. Fleet unit dispatched.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleLease}
                  disabled={isSyncing || state.days === 0}
                  className="w-full group bg-white text-slate-950 py-6 rounded-xl font-black text-xl hover:bg-emerald-400 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
                >
                  {isSyncing ? "INITIALIZING SECURE LINK..." : "EXECUTE LEASE"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: DATA MONITOR */}
        <section className="lg:col-span-8 p-10 flex flex-col justify-between bg-slate-950 relative">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#10b981 1px, transparent 0px)",
              backgroundSize: "40px 40px",
            }}
          ></div>

          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-10 border-b border-slate-800 pb-2">
              Financial telemetry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="p-10 border border-slate-800 bg-slate-900/40 rounded-3xl backdrop-blur-sm">
                <span className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                  Total Commitment
                </span>
                <div className="text-7xl font-black text-white mt-6 tracking-tighter">
                  ₦{(state?.total || 0).toLocaleString()}
                </div>
              </div>
              <div className="p-10 border border-slate-800 bg-slate-900/40 rounded-3xl backdrop-blur-sm">
                <span className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                  Lease Status
                </span>
                <div
                  className={`text-5xl font-black mt-8 uppercase tracking-tight ${state.status === "confirmed" ? "text-emerald-500" : state.status === "processing" ? "text-amber-500 animate-pulse" : "text-slate-700"}`}
                >
                  {state.status}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM TERMINAL LOG */}
          <div className="mt-10 bg-black/80 border border-slate-800 p-6 rounded-xl font-mono text-[10px] text-emerald-800 space-y-1 relative z-10">
            <p className="opacity-50 tracking-tighter">{`> [BOOT] TRT_SYSTEM_INITIALIZED_OK`}</p>
            <p>{`> [FLEET] Active Unit: ${state.equipment}`}</p>
            <p>{`> [MARKET] Daily Rate Locked: ₦${state.dailyRate.toLocaleString()}`}</p>
            {isSyncing && (
              <p className="text-amber-500">{`> [SYNC] Establishing uplink to Jos Central Node...`}</p>
            )}
            {state.status === "confirmed" && (
              <p className="text-white bg-emerald-900/50 px-2 py-1 inline-block mt-2">
                {`> [LOG] TRANSACTION_VERIFIED_SUCCESS :: HASH_${Math.random().toString(36).substring(7).toUpperCase()}`}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
