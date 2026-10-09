import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AiTool } from '../types/credits';

interface SubscriptionsViewProps {
  tools: AiTool[];
  onOpenAddToolModal: () => void;
  onDeleteTool: (toolId: string) => void;
  onRefillAllTools: () => void;
  onToggleAutoRenew: (toolId: string) => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  tools,
  onOpenAddToolModal,
  onDeleteTool,
  onRefillAllTools,
  onToggleAutoRenew
}) => {
  const [refillSuccess, setRefillSuccess] = useState(false);

  const totalMonthlySpend = tools.reduce((sum, t) => sum + t.monthlyCost, 0);
  const totalAnnualSpend = totalMonthlySpend * 12;

  const handleRefillAll = () => {
    onRefillAllTools();
    setRefillSuccess(true);
    setTimeout(() => setRefillSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col w-full p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <section className="relative w-full rounded-xl border border-emerald-500/30 bg-[#08100c]/90 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(0,255,136,0.08)]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-emerald-500/15">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 shadow-[0_0_10px_#3b82f6] animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-blue-400 uppercase font-semibold">
                Billing &amp; Tiers • Fleet Subscriptions
              </span>
              <span className="font-mono text-[10px] text-slate-600">| TOTAL TIERS: {tools.length}</span>
            </div>
            <h1 className="font-tech text-3xl font-bold text-white tracking-wider uppercase drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]">
              AI Subscriptions Manager
            </h1>
            <p className="font-sans text-sm text-slate-400 max-w-2xl">
              Track renewal calendars, auto-renew configurations, rollover policies, and total cost of ownership across your tool stack.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefillAll}
              className="px-3.5 py-2 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} className={refillSuccess ? 'text-emerald-400 animate-spin' : ''} />
              <span>{refillSuccess ? 'Fleet Refilled!' : 'Reset All Quotas'}</span>
            </button>

            <button
              onClick={onOpenAddToolModal}
              className="px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>Add AI Service</span>
            </button>
          </div>
        </div>

        {/* Spend Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/20 flex flex-col justify-between">
            <span className="font-mono text-xs text-blue-300 uppercase tracking-wider">
              Total Monthly Burn Rate
            </span>
            <div className="font-tech text-3xl font-bold text-blue-300 mt-1">
              ${totalMonthlySpend}
              <span className="text-base font-normal text-slate-500">/mo</span>
            </div>
            <span className="mt-2 text-[11px] font-mono text-slate-400">
              Across {tools.length} active generative services
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Projected Annual Spend
            </span>
            <div className="font-tech text-3xl font-bold text-slate-100 mt-1">
              ${totalAnnualSpend}
              <span className="text-base font-normal text-slate-500">/yr</span>
            </div>
            <span className="mt-2 text-[11px] font-mono text-slate-400">
              Tax and compute tier inclusive
            </span>
          </div>

          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex flex-col justify-between">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
              Active Fleet Health
            </span>
            <div className="font-tech text-3xl font-bold text-emerald-300 mt-1">
              100%
            </div>
            <span className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>All payment methods verified</span>
            </span>
          </div>
        </div>
      </section>

      {/* Subscription Service Cards */}
      <section className="flex flex-col gap-4">
        <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers size={20} className="text-emerald-400" />
          <span>Active Subscriptions ({tools.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => {
            const percent = Math.round((tool.availableCredits / tool.totalCredits) * 100);

            return (
              <div
                key={tool.id}
                className="relative rounded-lg border border-slate-800 bg-[#0a120e]/90 p-5 flex flex-col justify-between gap-4 hover:border-emerald-500/40 transition-all shadow-lg"
              >
                <div className="hud-corner-tl" />
                <div className="hud-corner-tr" />
                <div className="hud-corner-bl" />
                <div className="hud-corner-br" />

                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="font-tech font-bold text-lg text-white">
                      {tool.name}
                    </span>
                    <span className="font-mono text-xs text-emerald-400">
                      {tool.tier} • ${tool.monthlyCost}/mo
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {tool.provider}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Balance Quota:</span>
                    <span className="text-white font-bold">
                      {tool.availableCredits.toLocaleString()} / {tool.totalCredits.toLocaleString()} {tool.unit}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-400 rounded"
                      style={{ width: `${Math.min(100, Math.max(3, percent))}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[11px] font-sans text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-900">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>Next Reset:</span>
                    <span className="text-emerald-400">{tool.resetDate}</span>
                  </div>
                  <div className="text-slate-400 text-xs">
                    {tool.unitDescription}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => onToggleAutoRenew(tool.id)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <span className={`w-2 h-2 rounded-full ${tool.autoRenew ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span>Auto-Renew: {tool.autoRenew ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteTool(tool.id)}
                    className="text-slate-600 hover:text-rose-400 transition-colors cursor-pointer p-1"
                    title="Remove subscription from tracker"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
