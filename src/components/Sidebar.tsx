import React from 'react';
import { 
  LayoutDashboard, 
  Calculator, 
  TrendingUp, 
  Layers, 
  Volume2, 
  VolumeX, 
  Zap, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'daily-command' | 'task-estimator' | 'weekly-digest' | 'subscriptions';
  setCurrentTab: (tab: 'daily-command' | 'task-estimator' | 'weekly-digest' | 'subscriptions') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onResetData: () => void;
  onOpenServerVault: () => void;
  activeToolsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  soundEnabled,
  setSoundEnabled,
  onResetData,
  onOpenServerVault,
  activeToolsCount
}) => {
  const navItems = [
    {
      id: 'daily-command' as const,
      label: 'Daily Command',
      code: '01',
      icon: LayoutDashboard,
      color: 'text-emerald-300'
    },
    {
      id: 'task-estimator' as const,
      label: 'Task Estimator',
      code: '02',
      icon: Calculator,
      color: 'text-blue-400'
    },
    {
      id: 'weekly-digest' as const,
      label: 'Weekly Digest',
      code: '03',
      icon: TrendingUp,
      color: 'text-emerald-400'
    },
    {
      id: 'subscriptions' as const,
      label: 'Subscriptions',
      code: '04',
      icon: Layers,
      color: 'text-slate-400'
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#070c09]/95 border-r border-emerald-500/20 backdrop-blur-2xl z-40 flex flex-col justify-between p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col gap-6">
        {/* Cockpit App Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="relative p-2 border border-emerald-500/30 rounded-lg bg-emerald-950/40 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
              <Zap className="h-6 w-6 text-emerald-400 animate-pulse drop-shadow-[0_0_8px_#00ff88]" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div className="flex flex-col">
              <span className="font-tech font-bold text-lg text-emerald-300 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]">
                AetherCredits
              </span>
              <span className="font-mono text-[10px] text-emerald-600 tracking-widest uppercase">
                AI Resource Suite
              </span>
            </div>
          </div>
        </div>

        {/* Live Sync Status Banner & Server Vault Trigger */}
        <button
          onClick={onOpenServerVault}
          className="flex items-center justify-between px-3 py-1.5 rounded border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 hover:border-emerald-500/50 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,136,0.15)] group text-left"
          title="Click to view/edit /data/vault.json"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00ff88]" />
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider group-hover:text-emerald-300">
              Live Vault Sync
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-600 group-hover:text-emerald-400 uppercase tracking-widest">
            v2.4 ONLINE
          </span>
        </button>

        {/* Cyber Navigation Links */}
        <nav className="flex flex-col gap-2 mt-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded text-left transition-all tracking-wide cursor-pointer ${
                  isActive
                    ? 'border-l-4 border-emerald-400 bg-emerald-500/15 text-emerald-300 font-tech font-semibold shadow-[0_0_16px_rgba(0,255,136,0.3)]'
                    : 'border border-transparent font-tech text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-500/20'
                }`}
              >
                <Icon className={`text-xl ${isActive ? 'text-emerald-300 drop-shadow-[0_0_6px_#00ff88]' : item.color}`} size={18} />
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`ml-auto font-mono text-[10px] uppercase ${isActive ? 'text-emerald-400/80' : 'text-slate-600'}`}>
                  {item.code}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry Module */}
      <div className="flex flex-col gap-3">
        {/* Controls row: Sound toggle & sample data reload */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-emerald-300 transition-colors"
            title={soundEnabled ? 'Mute Cyber Audio' : 'Enable Cyber Audio'}
          >
            {soundEnabled ? (
              <>
                <Volume2 size={14} className="text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider">HUD Audio On</span>
              </>
            ) : (
              <>
                <VolumeX size={14} className="text-slate-500" />
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Audio Muted</span>
              </>
            )}
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-amber-400 transition-colors"
            title="Reset to default mock data"
          >
            <RotateCcw size={12} />
            <span>Reset Data</span>
          </button>
        </div>

        {/* HUD Radar / Quota Pulse Bottom Telemetry Module */}
        <div className="relative p-3.5 rounded-lg border border-emerald-500/25 bg-[#09110d]/90 backdrop-blur-md flex flex-col gap-2.5 shadow-[inset_0_0_15px_rgba(0,255,136,0.05)]">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="flex items-center justify-between border-b border-emerald-500/15 pb-1.5">
            <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Quota Pulse
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold tracking-wide uppercase">
              Optimal
            </span>
          </div>

          <div className="w-full h-2 rounded bg-slate-950 p-0.5 border border-emerald-500/20 overflow-hidden">
            <div className="h-full rounded bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 w-[70%] shadow-[0_0_10px_#00ff88]" />
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
            <span>Sync Frequency</span>
            <span className="text-emerald-300 font-semibold tracking-wide">Real-Time (5s)</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 pt-1 border-t border-slate-900">
            <span>Active Power Cores</span>
            <span className="text-slate-300 font-mono">{activeToolsCount} Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
