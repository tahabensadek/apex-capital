"use client";

import React, { useState, useEffect } from "react";
import {
  Kanban, Plus, CheckCircle2, Clock, AlertTriangle, ArrowRight,
  Sparkles, Building2, ShieldCheck, DollarSign, Layers, ExternalLink,
  ChevronRight, Trash2, Check, RefreshCw, Zap, Flame, Award, Filter
} from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface BoardTask {
  id: string;
  title: string;
  description: string;
  category: "CAPITAL" | "TECH" | "LEGAL" | "MARKETING" | "INFRA";
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  status: "TODO" | "IN_PROGRESS" | "TESTING" | "COMPLETED";
  completedAt?: string;
  checklist: ChecklistItem[];
}

const CATEGORY_TAGS: Record<string, { label: string; color: string }> = {
  CAPITAL: { label: "🏦 CAPITAL & LENDER", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  TECH: { label: "⚡ TECH & PLAID", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  LEGAL: { label: "⚖️ LEGAL & MANDAT", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  MARKETING: { label: "📣 MARKETING & ADS", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  INFRA: { label: "🖥️ INFRA & OS", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
};

const PRIORITY_BADGES: Record<string, { label: string; bg: string; icon: any }> = {
  CRITICAL: { label: "CRITIQUE", bg: "bg-rose-500/20 text-rose-400 border-rose-500/40", icon: Flame },
  HIGH: { label: "HAUTE", bg: "bg-amber-500/20 text-amber-400 border-amber-500/40", icon: Zap },
  MEDIUM: { label: "STANDARD", bg: "bg-slate-800 text-slate-300 border-slate-700", icon: Clock },
};

const COLUMNS = [
  { key: "TODO", title: "📥 À FAIRE / BACKLOG", borderColor: "border-slate-700", badgeBg: "bg-slate-800 text-slate-300" },
  { key: "IN_PROGRESS", title: "⚡ EN COURS (SPRINT)", borderColor: "border-amber-500/60", badgeBg: "bg-amber-500/20 text-amber-300" },
  { key: "TESTING", title: "🧪 VALIDATION & TEST", borderColor: "border-purple-500/60", badgeBg: "bg-purple-500/20 text-purple-300" },
  { key: "COMPLETED", title: "✅ VALIDÉ & COMPLÉTÉ", borderColor: "border-emerald-500/60", badgeBg: "bg-emerald-500/20 text-emerald-300" },
];

export default function MissionControlBoardPage() {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [stats, setStats] = useState<any>({ progressPercent: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // New task form state
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [newCategory, setNewCategory] = useState<BoardTask["category"]>("CAPITAL");
  const [newPriority, setNewPriority] = useState<BoardTask["priority"]>("HIGH");

  const fetchBoard = async () => {
    try {
      const res = await fetch("/api/board");
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
        setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to fetch board:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handleMoveTask = async (taskId: string, nextStatus: BoardTask["status"]) => {
    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MOVE", taskId, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
        const comp = data.tasks.filter((t: any) => t.status === "COMPLETED").length;
        setStats({
          ...stats,
          completed: comp,
          progressPercent: Math.round((comp / data.tasks.length) * 100)
        });

        if (nextStatus === "COMPLETED") {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleChecklist = async (taskId: string, checklistId: string, currentDone: boolean) => {
    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_CHECKLIST", taskId, checklistId, done: !currentDone })
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
        const comp = data.tasks.filter((t: any) => t.status === "COMPLETED").length;
        setStats({
          ...stats,
          completed: comp,
          progressPercent: Math.round((comp / data.tasks.length) * 100)
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE",
          task: {
            title: newTitle,
            description: newDesc,
            category: newCategory,
            priority: newPriority,
            checklist: []
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
        setNewTitle("");
        setNewDesc("");
        setIsModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", taskId })
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = filterCategory === "ALL" 
    ? tasks 
    : tasks.filter(t => t.category === filterCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20">
      
      {/* Top War Room Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Kanban className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-base">APEX WAR ROOM</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  NATIVE JETSON OS
                </span>
              </div>
              <p className="text-xs text-slate-400">Launch Roadmap • Target: <span className="font-mono text-emerald-400 font-bold">$100k/mo Q1 2027</span></p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center space-x-2">
            <Link
              href="/crm"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center space-x-1.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trading Desk (CRM)</span>
            </Link>
            <Link
              href="/portal/deal_8829"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Portail Client</span>
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Ajouter Tâche</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Top Progress & Metrics Strip */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 rounded-2xl border border-slate-800 p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Objectif Q1 2027 — Machine Autonome</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Plan de Lancement Apex Finance
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Chaque carte complétée déploie la machine de courtage vers 1 deal/jour sans intervention téléphonique manuelle.
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 min-w-[280px]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400 uppercase">Progression du Lancement</span>
                <span className="text-emerald-400 font-bold text-sm">{stats.progressPercent}% ({stats.completed}/{stats.total})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 mt-5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-mono text-[11px] uppercase mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Filtre :</span>
            </span>
            {["ALL", "CAPITAL", "TECH", "LEGAL", "MARKETING", "INFRA"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] transition ${
                  filterCategory === cat
                    ? "bg-slate-800 border-emerald-500 text-white shadow"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Interactive Kanban Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);

            return (
              <div
                key={col.key}
                className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 min-h-[550px] flex flex-col justify-between"
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <span className="text-xs font-bold tracking-wider text-slate-200">{col.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badgeBg}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3">
                    {colTasks.map((task) => {
                      const pri = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.MEDIUM;
                      const cat = CATEGORY_TAGS[task.category] || CATEGORY_TAGS.CAPITAL;
                      const PriIcon = pri.icon;

                      return (
                        <div
                          key={task.id}
                          className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 p-4 space-y-3 shadow-md transition group relative"
                        >
                          {/* Badges */}
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className={`px-2 py-0.5 rounded border ${cat.color}`}>
                              {cat.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded border flex items-center space-x-1 ${pri.bg}`}>
                              <PriIcon className="w-3 h-3" />
                              <span>{pri.label}</span>
                            </span>
                          </div>

                          {/* Title & Desc */}
                          <div>
                            <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-300 transition">
                              {task.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Subtask Checklist */}
                          {task.checklist && task.checklist.length > 0 && (
                            <div className="bg-slate-950/80 rounded-lg p-2.5 space-y-1.5 border border-slate-800/60">
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                Sous-tâches ({task.checklist.filter(c => c.done).length}/{task.checklist.length})
                              </p>
                              {task.checklist.map((item) => (
                                <label
                                  key={item.id}
                                  className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.done}
                                    onChange={() => handleToggleChecklist(task.id, item.id, item.done)}
                                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                                  />
                                  <span className={item.done ? "line-through text-slate-500" : ""}>
                                    {item.text}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Bottom Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-500 hover:text-rose-400 transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Forward Button */}
                            {col.key === "TODO" && (
                              <button
                                onClick={() => handleMoveTask(task.id, "IN_PROGRESS")}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-amber-300 flex items-center space-x-1"
                              >
                                <span>Démarrer</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {col.key === "IN_PROGRESS" && (
                              <button
                                onClick={() => handleMoveTask(task.id, "TESTING")}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-purple-300 flex items-center space-x-1"
                              >
                                <span>Valider / Tester</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            {col.key === "TESTING" && (
                              <button
                                onClick={() => handleMoveTask(task.id, "COMPLETED")}
                                className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-[11px] font-black text-slate-950 flex items-center space-x-1 shadow"
                              >
                                <span>Valider (Done)</span>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>
                            )}

                            {col.key === "COMPLETED" && (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Complété</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {colTasks.length === 0 && (
                      <div className="py-12 text-center text-slate-600 font-mono text-xs border-2 border-dashed border-slate-800/60 rounded-xl">
                        Aucune tâche
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>Créer une nouvelle tâche de lancement</span>
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Titre de la tâche</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex. Lancer campagne Ads Montréal"
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase">Description / Action plan</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Détails de l'exécution..."
                  className="w-full mt-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Catégorie</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CAPITAL">🏦 Capital & Lender</option>
                    <option value="TECH">⚡ Tech & Plaid</option>
                    <option value="LEGAL">⚖️ Legal & Mandat</option>
                    <option value="MARKETING">📣 Marketing & Ads</option>
                    <option value="INFRA">🖥️ Infra & OS</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Priorité</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CRITICAL">🔥 Critique</option>
                    <option value="HIGH">⚡ Haute</option>
                    <option value="MEDIUM">⏳ Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
                >
                  Créer la tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
