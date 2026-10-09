import React, { useState } from 'react';
import { 
  Bot, 
  Brain, 
  Palette, 
  Video, 
  Mic, 
  Code2, 
  Flame, 
  AlarmClock, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Layers, 
  ArrowDown, 
  ArrowUp, 
  RefreshCw, 
  Plus, 
  Minus, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { AiTool, BurnActivity, ToolCategory } from '../types/credits';

interface DailyCommandViewProps {
  tools: AiTool[];
  activities: BurnActivity[];
  totalUsableCredits: number;
  maxCapacityCredits: number;
  todayBurn: number;
  expiringCredits: number;
  monthlySpend: number;
  onQuickBurn: (toolId: string, amount: number) => void;
  onQuickRefill: (toolId: string, amount: number) => void;
  onOpenLogModal: () => void;
  onOpenAddToolModal: () => void;
  onOpenEstimator: () => void;
  onAddUniversalCredits: (amount: number) => void;
  onNavigateToSubscriptions: () => void;
}

export const DailyCommandView: React.FC<DailyCommandViewProps> = ({
  tools,
  activities,
  totalUsableCredits,
  maxCapacityCredits,
  todayBurn,
  expiringCredits,
  monthlySpend,
  onQuickBurn,
  onQuickRefill,
  onOpenLogModal,
  onOpenAddToolModal,
  onOpenEstimator,
  onAddUniversalCredits,
  onNavigateToSubscriptions
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'needs-attention'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTipBanner, setShowTipBanner] = useState(true);
  const [activeTooltipToolId, setActiveTooltipToolId] = useState<string | null>(null);

  // Compute percentage available
  const percentAvailable = maxCapacityCredits > 0
    ? Math.round((totalUsableCredits / maxCapacityCredits) * 100)
    : 70;

  // Filter tools
  const filteredTools = tools.filter(tool => {
    if (filterMode === 'needs-attention') {
      const isLow = (tool.availableCredits / tool.totalCredits) < 0.25 || tool.resetsInDays <= 2;
      if (!isLow) return false;
    }
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const needsAttentionCount = tools.filter(
    t => (t.availableCredits / t.totalCredits) < 0.25 || t.resetsInDays <= 2
  ).length;

  const getToolIcon = (category: ToolCategory, name: string) => {
    if (name.toLowerCase().includes('chatgpt')) return Bot;
    if (name.toLowerCase().includes('claude')) return Brain;
    if (name.toLowerCase().includes('midjourney')) return Palette;
    if (name.toLowerCase().includes('runway')) return Video;
    if (name.toLowerCase().includes('eleven')) return Mic;
    if (name.toLowerCase().includes('cursor')) return Code2;

    switch (category) {
      case 'text': return Brain;
      case 'image': return Palette;
      case 'video': return Video;
      case 'audio': return Mic;
      case 'code': return Code2;
      default: return Bot;
    }
  };

  return (
    <div className="flex flex-col w-full p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* 1. ULTRA-WIDE TOP COCKPIT HUD BANNER */}
      <section className="relative w-full rounded-xl border border-emerald-500/30 bg-[#08100c]/90 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(0,255,136,0.08)] overflow-hidden">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Section Head Title & Core Network Telemetry Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-emerald-500/15">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_10px_#00ff88] animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-emerald-400 uppercase font-semibold">
                Command Hub • Live Telemetry
              </span>
              <span className="font-mono text-[10px] text-slate-600">| SYS_LOC: NODE_07</span>
            </div>
            <h1 className="font-tech text-3xl lg:text-4xl font-bold text-white tracking-wider uppercase drop-shadow-[0_0_12px_rgba(0,255,136,0.35)]">
              Today's AI Energy Reserves
            </h1>
            <p className="font-sans text-sm text-slate-400 max-w-2xl">
              Everything your generative tools consume, translated into plain credits. No complex token math, no surprises.
            </p>
          </div>

          {/* Online Badge */}
          <div className="flex items-center gap-2.5 self-start lg:self-center px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,136,0.15)]">
            <ShieldCheck className="text-emerald-400 text-lg" size={18} />
            <span className="font-mono text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              {tools.length} of {tools.length} Core Services Online
            </span>
          </div>
        </div>

        {/* Ultra-Wide Telemetry Gauges (4 Holographic HUD Modules) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* Card 1: Total AI Reserves */}
          <div className="relative p-4 rounded-lg bg-emerald-950/15 border border-emerald-500/20 hover:border-emerald-400/50 flex flex-col justify-between transition-all group shadow-[inset_0_0_20px_rgba(0,255,136,0.03)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Total AI Reserves
                </span>
                <span className="font-tech text-3xl font-bold text-emerald-300 tracking-wide mt-1 drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]">
                  {totalUsableCredits.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-slate-400 mt-0.5">Usable Energy Credits</span>
              </div>

              {/* Holographic Radar Ring */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    className="text-slate-800"
                    cx="32"
                    cy="32"
                    fill="none"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    className="text-emerald-400 drop-shadow-[0_0_8px_#00ff88] transition-all duration-700"
                    cx="32"
                    cy="32"
                    fill="none"
                    r="26"
                    stroke="currentColor"
                    strokeDasharray="163.36"
                    strokeDashoffset={163.36 * (1 - percentAvailable / 100)}
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-emerald-300">
                  {percentAvailable}%
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>Plenty of runway (~18 days at pace)</span>
            </div>
          </div>

          {/* Card 2: Today's Burn */}
          <div className="relative p-4 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 flex flex-col justify-between transition-all group shadow-[inset_0_0_20px_rgba(255,159,28,0.03)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  Today's Burn
                </span>
                <span className="font-tech text-3xl font-bold text-slate-100 tracking-wide mt-1">
                  {todayBurn}
                </span>
                <span className="font-mono text-xs text-slate-400 mt-0.5">Credits Consumed</span>
              </div>

              <div className="w-11 h-11 rounded border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(255,159,28,0.2)]">
                <Flame size={22} />
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center gap-1.5 font-mono text-[11px]">
              <span className="inline-flex items-center text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <ArrowDown size={12} className="mr-0.5" />
                12%
              </span>
              <span className="text-slate-400">calmer than yesterday</span>
            </div>
          </div>

          {/* Card 3: Expiring Soon */}
          <div className="relative p-4 rounded-lg bg-rose-950/15 border border-rose-500/30 hover:border-rose-400 flex flex-col justify-between transition-all group shadow-[inset_0_0_20px_rgba(255,51,102,0.06)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-rose-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping" />
                  Expiring Soon
                </span>
                <span className="font-tech text-3xl font-bold text-rose-400 tracking-wide mt-1 drop-shadow-[0_0_8px_rgba(255,51,102,0.4)]">
                  {expiringCredits}
                </span>
                <span className="font-mono text-xs text-slate-400 mt-0.5">Midjourney Fast Reset</span>
              </div>

              <div className="w-11 h-11 rounded border border-rose-500/40 bg-rose-500/15 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(255,51,102,0.3)]">
                <AlarmClock size={22} />
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-rose-900/40 flex items-center justify-between font-mono text-[11px]">
              <span className="text-rose-400 font-bold">Resets in 48 hours</span>
              <button
                onClick={onOpenEstimator}
                className="text-emerald-300 underline hover:text-emerald-200 transition-colors uppercase cursor-pointer"
              >
                Queue renders →
              </button>
            </div>
          </div>

          {/* Card 4: Estimated Spend */}
          <div className="relative p-4 rounded-lg bg-slate-900/40 border border-blue-500/20 hover:border-blue-400/50 flex flex-col justify-between transition-all group shadow-[inset_0_0_20px_rgba(59,130,246,0.03)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-widest text-blue-400 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  Estimated Spend
                </span>
                <span className="font-tech text-3xl font-bold text-blue-300 tracking-wide mt-1">
                  ${monthlySpend}
                  <span className="text-base font-normal text-slate-500">/mo</span>
                </span>
                <span className="font-mono text-xs text-slate-400 mt-0.5">Combined active tier cost</span>
              </div>

              <div className="w-11 h-11 rounded border border-blue-500/30 bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <CreditCard size={22} />
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-800 flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400">{tools.length} connected services</span>
              <button
                onClick={onNavigateToSubscriptions}
                className="text-blue-300 font-bold uppercase hover:underline cursor-pointer"
              >
                View Invoices →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Holographic Tactical Tip Banner */}
      {showTipBanner && (
        <div className="relative w-full rounded-lg border-l-4 border-l-emerald-400 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/60 p-4 shadow-[0_0_25px_rgba(0,255,136,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="hud-corner-tr" />
          <div className="hud-corner-br" />

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg border border-emerald-400/40 bg-emerald-400/10 flex-shrink-0 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(0,255,136,0.25)]">
              <Sparkles size={22} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                  Smart Optimization Tip
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-[10px] text-slate-400">Just now</span>
              </div>
              <p className="font-sans text-sm text-slate-200 mt-0.5">
                You have <span className="font-bold text-emerald-300">13.8 Fast Hours</span> remaining in Midjourney resetting in 2 days. Run your upcoming social campaign variations tonight to avoid losing paid compute!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => setShowTipBanner(false)}
              className="px-3 py-1.5 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={onOpenEstimator}
              className="px-3.5 py-1.5 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all cursor-pointer"
            >
              Queue Renders
            </button>
          </div>
        </div>
      )}

      {/* 2. ACTIVE AI POWER CORES: 3x2 MODULAR TELEMETRY GRID */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/15 pb-2">
          <div>
            <h2 className="font-tech text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-sm" />
              Active AI Power Cores
            </h2>
            <p className="font-mono text-xs text-slate-400 mt-0.5">
              Real-time status across your {tools.length} linked models &amp; tools
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded border border-slate-800">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Tools ({tools.length})
              </button>
              <button
                onClick={() => setFilterMode('needs-attention')}
                className={`px-3 py-1 rounded font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  filterMode === 'needs-attention'
                    ? 'bg-rose-500/20 border border-rose-400/40 text-rose-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Needs Attention ({needsAttentionCount})
              </button>
            </div>

            {/* Add New Tool Button */}
            <button
              onClick={onOpenAddToolModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus size={14} className="text-emerald-400" />
              <span>Add Tool</span>
            </button>
          </div>
        </div>

        {/* 3x2 High-Density Modular HUD Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map(tool => {
            const IconComponent = getToolIcon(tool.category, tool.name);
            const percentRemaining = Math.round((tool.availableCredits / tool.totalCredits) * 100);
            const isLow = percentRemaining < 25;
            const isAbundant = percentRemaining >= 85;

            // Border color styling matching design
            const borderColor = isLow 
              ? 'border-rose-500/35 hover:border-rose-400 bg-[#14080b]/85' 
              : tool.accentColor === 'blue'
                ? 'border-blue-500/25 hover:border-blue-400/60 bg-[#0a120e]/85'
                : 'border-emerald-500/25 hover:border-emerald-400/60 bg-[#0a120e]/85';

            const badgeColor = isLow
              ? 'border-rose-500/40 bg-rose-950/40 text-rose-400'
              : tool.accentColor === 'blue'
                ? 'border-blue-500/40 bg-blue-950/30 text-blue-300'
                : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400';

            const barColor = isLow
              ? 'bg-rose-500 shadow-[0_0_8px_#ff3366]'
              : tool.accentColor === 'blue'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_8px_#3b82f6]'
                : 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_8px_#00ff88]';

            const statusText = isLow ? 'Low Fuel' : isAbundant ? 'Abundant' : 'Optimal';

            return (
              <div
                key={tool.id}
                className={`relative rounded-lg border ${borderColor} backdrop-blur-xl p-5 flex flex-col justify-between gap-4 group shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all`}
              >
                <div className="hud-corner-tl" />
                <div className="hud-corner-tr" />
                <div className="hud-corner-bl" />
                <div className="hud-corner-br" />

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded border ${
                      isLow ? 'border-rose-500/40 bg-rose-950/40 text-rose-400' : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                    } flex items-center justify-center shadow-[0_0_12px_rgba(0,255,136,0.2)]`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-tech font-bold text-base text-white tracking-wide">
                        {tool.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {tool.provider} • {tool.model}
                      </span>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border ${badgeColor} font-mono text-[11px] font-semibold uppercase`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-rose-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                    {statusText}
                  </span>
                </div>

                {/* Balance Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-slate-400">{tool.unit}:</span>
                    <span className={`${isLow ? 'text-rose-400 font-bold' : 'text-emerald-300 font-bold'}`}>
                      {tool.availableCredits.toLocaleString()} / {tool.totalCredits.toLocaleString()}{' '}
                      <span className="font-normal text-slate-500">({percentRemaining}%)</span>
                    </span>
                  </div>

                  <div className="w-full h-2 rounded bg-slate-950 p-0.5 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, Math.max(3, percentRemaining))}%` }}
                    />
                  </div>
                </div>

                {/* Plain-Language Unit Explanation for Non-Tech Users */}
                <div className="relative">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/40 p-1.5 rounded border border-slate-800/80">
                    <span className="truncate pr-1 text-slate-300">
                      💡 {tool.unitDescription}
                    </span>
                    <button
                      onClick={() => setActiveTooltipToolId(activeTooltipToolId === tool.id ? null : tool.id)}
                      className="text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer flex-shrink-0"
                      title="What does this mean?"
                    >
                      <HelpCircle size={13} />
                    </button>
                  </div>

                  {activeTooltipToolId === tool.id && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 p-2.5 rounded bg-[#0a120e] border border-emerald-500/40 shadow-xl z-20 text-[11px] font-sans text-slate-200">
                      <div className="font-tech font-bold text-emerald-300 uppercase mb-1">
                        Plain English Guide: {tool.name}
                      </div>
                      <p>{tool.unitDescription}</p>
                      <div className="mt-1 pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                        Monthly Plan: ${tool.monthlyCost}/mo • Renew date: {tool.resetDate}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Increment/Decrement Buttons & Reset Note */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-slate-400">
                    <RefreshCw size={12} className="text-slate-500" />
                    {tool.resetsInDays <= 2 ? (
                      <span className="text-rose-400 font-bold">
                        {tool.resetsInDays === 1 ? 'Refreshes today' : '48h until monthly reset'}
                      </span>
                    ) : (
                      <span>Resets in {tool.resetsInDays} days</span>
                    )}
                  </span>

                  {/* Fast Action Mini-Triggers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onQuickBurn(tool.id, tool.category === 'image' ? 0.2 : 1)}
                      title={`Simulate using 1 ${tool.unit}`}
                      className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-rose-400 hover:text-rose-300 text-slate-400 transition-colors cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <button
                      onClick={() => onQuickRefill(tool.id, tool.category === 'image' ? 0.5 : 5)}
                      title={`Refill +5 ${tool.unit}`}
                      className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400 hover:text-emerald-300 text-slate-400 transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE SPLIT-COLUMN COMMAND STATION WITH GLOWING GEOMETRIC BORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Activity & Burn Feed (2 cols) */}
        <div className="lg:col-span-2 relative rounded-xl border border-emerald-500/25 bg-[#08100c]/90 backdrop-blur-xl p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded border border-emerald-500/40 bg-emerald-950/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
                  Live Activity &amp; Burn Feed
                </h3>
                <p className="font-mono text-xs text-slate-400">Instant feedback as you create</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLogModal}
                className="font-mono text-xs uppercase text-emerald-400 hover:text-emerald-300 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>+ Log Usage</span>
              </button>
            </div>
          </div>

          {/* Feed Items with HUD Matrix Glow Borders */}
          <div className="flex flex-col gap-2.5">
            {activities.slice(0, 5).map(act => {
              const isBurn = act.type === 'burn';
              const IconComp = getToolIcon(act.category, act.toolName);

              return (
                <div
                  key={act.id}
                  className="relative flex items-center justify-between p-3.5 rounded border border-slate-800 bg-slate-900/40 hover:border-emerald-500/40 hover:bg-slate-900/70 transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded border ${
                      isBurn ? 'border-blue-500/30 bg-blue-500/10 text-blue-300' : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                    } flex-shrink-0 flex items-center justify-center`}>
                      <IconComp size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-sans text-sm font-semibold text-slate-100 truncate group-hover:text-emerald-200 transition-colors">
                        {act.title}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {act.toolName} • {act.timeAgo}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0 pl-3">
                    <span className={`font-mono text-sm font-bold ${
                      isBurn ? 'text-rose-400' : 'text-emerald-400 drop-shadow-[0_0_6px_#00ff88]'
                    }`}>
                      {act.amountDelta > 0 ? `+${act.amountDelta.toLocaleString()}` : act.amountDelta.toLocaleString()}{' '}
                      {act.unit}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 uppercase">
                      {act.detail}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Where Your Fuel Goes (Concentric Radar Breakdown) */}
        <div className="relative rounded-xl border border-emerald-500/25 bg-[#08100c]/90 backdrop-blur-xl p-6 flex flex-col justify-between gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                Burn Breakdown
              </span>
              <span className="font-mono text-xs text-slate-400">Last 7 Days</span>
            </div>

            <h3 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
              Where Your Fuel Goes
            </h3>

            {/* Futuristic Holographic Radar Gauge */}
            <div className="flex items-center justify-center py-3">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Outer Target Calibration Rings */}
                <div
                  className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 animate-spin"
                  style={{ animationDuration: '40s' }}
                />
                <div className="absolute inset-3 rounded-full border border-slate-800" />

                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-slate-900"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  {/* Emerald: Image & Video Art 52% */}
                  <circle
                    className="text-emerald-400 drop-shadow-[0_0_8px_#00ff88]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="238.76"
                    strokeDashoffset="114.6"
                    strokeWidth="10"
                  />
                  {/* Azure: Coding & Logic 28% */}
                  <circle
                    className="text-blue-500 drop-shadow-[0_0_8px_#3b82f6]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="238.76"
                    strokeDashoffset="180"
                    strokeWidth="10"
                  />
                  {/* Light Matrix Green: Voice & Chat 20% */}
                  <circle
                    className="text-teal-300 drop-shadow-[0_0_8px_#05f0a5]"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="238.76"
                    strokeDashoffset="215"
                    strokeWidth="10"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-tech text-3xl font-bold text-white tracking-wider leading-none drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                    1,120
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 mt-1 uppercase tracking-widest">
                    Credits / wk
                  </span>
                </div>
              </div>
            </div>

            {/* HUD Metric Breakdown Legend */}
            <div className="flex flex-col gap-2 pt-1 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-[0_0_6px_#00ff88]" />
                  <span className="text-slate-200">Image &amp; Video Art</span>
                </div>
                <span className="text-emerald-300 font-bold">52%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
                  <span className="text-slate-200">Coding &amp; Logic</span>
                </div>
                <span className="text-blue-300 font-bold">28%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-teal-300 shadow-[0_0_6px_#05f0a5]" />
                  <span className="text-slate-200">Voice &amp; Chat</span>
                </div>
                <span className="text-teal-300 font-bold">20%</span>
              </div>
            </div>
          </div>

          {/* Cyber Boost Power Sub-module */}
          <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-emerald-300 uppercase">Need an instant boost?</span>
              <span className="text-emerald-400 uppercase tracking-wider font-semibold">
                Instant Delivery
              </span>
            </div>
            <p className="font-sans text-xs text-slate-400">
              Top up 1,000 Universal Credits usable on any connected service anytime.
            </p>
            <button
              onClick={() => onAddUniversalCredits(1000)}
              className="mt-1 w-full py-2 rounded border border-emerald-400/50 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Add 1,000 Credits ($10)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
