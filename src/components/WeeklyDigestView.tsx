import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Copy, 
  Check, 
  Flame, 
  Sparkles,
  PieChart,
  Clock,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { AiTool, BurnActivity } from '../types/credits';

interface WeeklyDigestViewProps {
  tools: AiTool[];
  activities: BurnActivity[];
  totalWeeklyBurn: number;
}

export const WeeklyDigestView: React.FC<WeeklyDigestViewProps> = ({
  tools,
  activities,
  totalWeeklyBurn
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // Default to Thursday/current day
  const [copied, setCopied] = useState(false);

  // 7-day data simulation
  const days = [
    { day: 'Mon', date: 'Oct 05', burn: 180, label: '180 CR', imgVideo: 90, code: 50, chat: 40 },
    { day: 'Tue', date: 'Oct 06', burn: 220, label: '220 CR', imgVideo: 120, code: 65, chat: 35 },
    { day: 'Wed', date: 'Oct 07', burn: 140, label: '140 CR', imgVideo: 70, code: 40, chat: 30 },
    { day: 'Thu', date: 'Oct 08', burn: 195, label: '195 CR', imgVideo: 105, code: 55, chat: 35 },
    { day: 'Fri', date: 'Oct 09', burn: 145, label: '145 CR', imgVideo: 75, code: 40, chat: 30 },
    { day: 'Sat', date: 'Oct 10', burn: 110, label: '110 CR', imgVideo: 60, code: 30, chat: 20 },
    { day: 'Sun', date: 'Oct 11', burn: 130, label: '130 CR', imgVideo: 62, code: 34, chat: 34 },
  ];

  const maxBurn = Math.max(...days.map(d => d.burn));
  const activeDay = days[selectedDayIndex];

  const handleCopySummary = () => {
    const text = `== AetherCredits Weekly Summary (Oct 05 - Oct 11, 2026) ==\nTotal Burn: ${totalWeeklyBurn} Credits\nEfficiency Score: 94/100\nTop Category: Image & Video Art (52%)\nDaily Average: ${Math.round(totalWeeklyBurn / 7)} Credits/day\nUpcoming Resets: Midjourney (48h), Cursor (8d)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_10px_#00ff88] animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-emerald-400 uppercase font-semibold">
                Weekly Synthesis • Cycle #41
              </span>
              <span className="font-mono text-[10px] text-slate-600">| OCT 05 – OCT 11, 2026</span>
            </div>
            <h1 className="font-tech text-3xl font-bold text-white tracking-wider uppercase drop-shadow-[0_0_12px_rgba(0,255,136,0.35)]">
              Weekly Resource Digest
            </h1>
            <p className="font-sans text-sm text-slate-400 max-w-2xl">
              Consolidated intelligence on your 7-day generative spend, category distribution, and optimization recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-1.5 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
            <div className="px-3 py-1.5 rounded bg-emerald-950/40 border border-emerald-500/30 font-mono text-xs text-emerald-300">
              Score: <span className="font-bold text-emerald-400">94/100</span>
            </div>
          </div>
        </div>

        {/* 4 Weekly KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-lg bg-emerald-950/15 border border-emerald-500/20 flex flex-col justify-between">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Total 7-Day Burn
            </span>
            <div className="font-tech text-3xl font-bold text-emerald-300 mt-1">
              {totalWeeklyBurn.toLocaleString()}{' '}
              <span className="text-sm font-normal text-slate-500">Credits</span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>12% lower than previous week</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Daily Average
            </span>
            <div className="font-tech text-3xl font-bold text-slate-100 mt-1">
              {Math.round(totalWeeklyBurn / 7)}{' '}
              <span className="text-sm font-normal text-slate-500">CR/day</span>
            </div>
            <div className="mt-2 text-[11px] font-mono text-slate-400">
              Balanced daily distribution
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/40 border border-blue-500/20 flex flex-col justify-between">
            <span className="font-mono text-xs text-blue-400 uppercase tracking-wider">
              Quota Utilization
            </span>
            <div className="font-tech text-3xl font-bold text-blue-300 mt-1">
              88.4%
            </div>
            <div className="mt-2 text-[11px] font-mono text-emerald-400">
              Minimal idle or wasted compute
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              Equivalent Compute Value
            </span>
            <div className="font-tech text-3xl font-bold text-slate-100 mt-1">
              $42.80
            </div>
            <div className="mt-2 text-[11px] font-mono text-slate-400">
              Across 6 connected engines
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 7-Day Burn Chart & Day Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Bar Chart (2 cols) */}
        <div className="lg:col-span-2 relative rounded-xl border border-emerald-500/25 bg-[#08100c]/90 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-400" />
              <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
                Daily Consumption Bar Graph
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-400">Click a bar to inspect details</span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {days.map((item, index) => {
              const heightPercent = Math.round((item.burn / maxBurn) * 100);
              const isSelected = selectedDayIndex === index;

              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDayIndex(index)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <span className={`font-mono text-[11px] transition-all ${
                    isSelected ? 'text-emerald-300 font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    {item.burn}
                  </span>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[48px] h-44 rounded-t bg-slate-900/80 p-0.5 border border-slate-800 flex flex-col justify-end overflow-hidden group-hover:border-emerald-500/40 transition-all">
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-[0_0_12px_#00ff88]'
                          : 'bg-emerald-500/40 group-hover:bg-emerald-500/70'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className={`font-mono text-xs ${isSelected ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
                      {item.day}
                    </span>
                    <span className="font-mono text-[9px] text-slate-600">
                      {item.date.split(' ')[1]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Inspection Sub-Card */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-emerald-400" />
              <span className="text-slate-300 font-bold">
                {activeDay.day}, {activeDay.date}:
              </span>
              <span className="text-emerald-300">{activeDay.burn} Total Credits Burned</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Art: {activeDay.imgVideo}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Code: {activeDay.code}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-300" />
                Chat: {activeDay.chat}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Strategic Advisor (1 col) */}
        <div className="relative rounded-xl border border-emerald-500/25 bg-[#08100c]/90 backdrop-blur-xl p-6 flex flex-col justify-between gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>AI Strategic Insights</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">Auto-Generated</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs">
                <div className="font-tech font-bold text-emerald-300 uppercase mb-1">
                  1. Midjourney Fast Hours Expiry
                </div>
                <p className="font-sans text-slate-300 leading-relaxed">
                  You have <span className="font-bold text-white">13.8 Fast GPU hours</span> expiring in 48 hours. At standard rates, that is ~$27 of compute. Run batch variations before Sunday.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs">
                <div className="font-tech font-bold text-blue-300 uppercase mb-1">
                  2. Cursor Pro High Efficiency
                </div>
                <p className="font-sans text-slate-300 leading-relaxed">
                  Your Cursor queries averaged 45 queries/day with low bounce. Optimal return on your $20/mo subscription.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 text-xs">
                <div className="font-tech font-bold text-amber-300 uppercase mb-1">
                  3. Runway Gen-3 Refill Window
                </div>
                <p className="font-sans text-slate-300 leading-relaxed">
                  Runway credits dropped below 15%. If planning video production this weekend, top-up 500 CR or use the Task Estimator to plan keyframes.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
            <span>Next Weekly Cycle:</span>
            <span className="text-emerald-400 font-bold">Oct 12, 00:00 UTC</span>
          </div>
        </div>
      </div>

      {/* Upcoming Expiration & Quota Renewals Radar */}
      <section className="relative rounded-xl border border-emerald-500/25 bg-[#08100c]/90 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-emerald-400" />
            <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wider">
              Upcoming Renewal &amp; Reset Radar (Next 7 Days)
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">Don't let paid compute expire</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tools.slice(0, 3).map(tool => (
            <div
              key={tool.id}
              className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-tech font-bold text-sm text-white">{tool.name}</span>
                <span className="font-mono text-xs font-bold text-rose-400">
                  {tool.resetsInDays <= 2 ? `${tool.resetsInDays * 24}h Left` : `${tool.resetsInDays} Days`}
                </span>
              </div>
              <div className="font-mono text-xs text-slate-400">
                {tool.availableCredits.toLocaleString()} / {tool.totalCredits.toLocaleString()} {tool.unit} remaining
              </div>
              <div className="text-[11px] font-sans text-slate-400">
                {tool.notes || 'Renews automatically on billing cycle.'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
