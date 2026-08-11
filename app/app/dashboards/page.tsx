"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, RefreshCw, Trash2 } from "lucide-react";
import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";
import MiraVisual from "@/components/mira/MiraVisual";
import { deleteMiraDashboardCard, listMiraDashboardCards, type MiraDashboardCard } from "@/lib/api/mira";

export default function DashboardsPage() {
  const { activeWorkspace } = useAppWorkspace();
  const [cards, setCards] = useState<MiraDashboardCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setCards(await listMiraDashboardCards(activeWorkspace.workspace_id)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Dashboard cards could not be loaded."); }
    finally { setLoading(false); }
  }, [activeWorkspace.workspace_id]);

  useEffect(() => { void load(); }, [load]);

  async function remove(card: MiraDashboardCard) {
    if (!window.confirm(`Remove “${card.title}” from this dashboard?`)) return;
    await deleteMiraDashboardCard(activeWorkspace.workspace_id, card.id);
    setCards((current) => current.filter((item) => item.id !== card.id));
  }

  return <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-950 dark:bg-[#070810] dark:text-white sm:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">InsightMend</p><h1 className="mt-2 text-3xl font-semibold">Decision dashboards</h1><p className="mt-2 text-sm text-slate-500">Reusable governed visuals created directly from Mira analysis.</p></div>
        <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm dark:border-white/10 dark:bg-white/[0.05]"><RefreshCw className="h-3.5 w-3.5" />Refresh</button>
      </header>
      {error ? <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="mt-16 text-center text-sm text-slate-500">Loading governed dashboard cards…</div> : cards.length ? <div className="mt-8 grid gap-5 xl:grid-cols-2">{cards.map((card) => <article key={card.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="mb-4 flex items-start justify-between gap-4"><div><h2 className="font-semibold">{card.title}</h2>{card.description ? <p className="mt-1 text-xs text-slate-500">{card.description}</p> : null}</div><button onClick={() => void remove(card)} aria-label="Remove card" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button></div>
        <MiraVisual visual={card.visual_payload} metadata={card.metadata || { semantic_context: card.semantic_context }} />
      </article>)}</div> : <div className="mt-16 rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-white/15"><LayoutDashboard className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-4 font-semibold">No dashboard cards yet</h2><p className="mt-2 text-sm text-slate-500">Open a Mira answer and choose Save, share & export → Dashboard card.</p></div>}
    </div>
  </main>;
}
