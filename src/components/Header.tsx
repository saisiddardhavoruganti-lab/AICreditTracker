import React, { useState } from 'react';
import { 
  Zap, 
  PlusCircle, 
  Bell, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronDown,
  Database
} from 'lucide-react';
import { NotificationItem } from '../types/credits';

interface HeaderProps {
  totalUsableCredits: number;
  maxCapacityCredits: number;
  onOpenEstimator: () => void;
  onOpenLogModal: () => void;
  onOpenServerVault: () => void;
  notifications: NotificationItem[];
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalUsableCredits,
  maxCapacityCredits,
  onOpenEstimator,
  onOpenLogModal,
  onOpenServerVault,
  notifications,
  onDismissNotification,
  onClearAllNotifications
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const percentAvailable = maxCapacityCredits > 0 
    ? Math.round((totalUsableCredits / maxCapacityCredits) * 100) 
    : 70;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-72 right-0 z-30 bg-[#070c09]/90 border-b border-emerald-500/20 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        {/* AI Power Telemetry Readout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,136,0.1)]">
            <div className="flex items-center gap-1.5">
              <Zap className="text-emerald-400 text-lg animate-pulse" size={16} />
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
                Total AI Power:
              </span>
              <span className="font-tech text-sm text-emerald-300 font-bold tracking-wide">
                {totalUsableCredits.toLocaleString()} / {maxCapacityCredits.toLocaleString()} Energy Credits
              </span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 font-bold tracking-wider">
              {percentAvailable}% Available
            </span>
          </div>
        </div>

        {/* Action Tools & Operator Avatar */}
        <div className="flex items-center gap-2.5">
          {/* Server Vault JSON Trigger */}
          <button
            onClick={onOpenServerVault}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            title="Open /data/vault.json editor"
          >
            <Database size={13} className="text-emerald-400" />
            <span>Server Vault (JSON)</span>
          </button>

          {/* Quick Log Activity Button */}
          <button
            onClick={onOpenLogModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus size={14} className="text-emerald-400" />
            <span>Log Usage</span>
          </button>

          {/* Estimate Task Action Button */}
          <button
            onClick={onOpenEstimator}
            className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded bg-emerald-400 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,136,0.5)] hover:bg-emerald-300 hover:shadow-[0_0_25px_rgba(0,255,136,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>Estimate Task</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
              className="relative p-2 rounded border border-slate-700/50 bg-[#0a120e] text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
              type="button"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#ff3366] animate-ping" />
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-emerald-500/30 bg-[#0a120e] p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50">
                <div className="hud-corner-tl" />
                <div className="hud-corner-tr" />
                <div className="hud-corner-bl" />
                <div className="hud-corner-br" />

                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-emerald-400" />
                    <span className="font-tech text-sm font-bold text-white uppercase tracking-wider">
                      Telemetry Alerts
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={onClearAllNotifications}
                      className="font-mono text-[10px] text-slate-400 hover:text-emerald-300 uppercase cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center font-mono text-xs text-slate-500">
                      No active telemetry alerts. All cores nominal.
                    </div>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded border text-xs transition-all ${
                          item.type === 'warning'
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-tech font-bold text-xs uppercase tracking-wide">
                            {item.title}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{item.timeAgo}</span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-300 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => onDismissNotification(item.id)}
                            className="font-mono text-[10px] text-slate-400 hover:text-emerald-400 uppercase cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User / Pilot Badge */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-800 text-left cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-[0_0_10px_rgba(0,255,136,0.4)]">
                  <div className="w-full h-full rounded-full bg-[#070c09] flex items-center justify-center font-tech font-bold text-xs text-emerald-300">
                    AM
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-950" />
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="font-tech font-bold text-xs text-slate-200 tracking-wider">
                  Alex Mercer
                </span>
                <span className="font-mono text-[10px] text-emerald-400 tracking-wider uppercase">
                  Pro Creator
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-500 hidden xl:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-emerald-500/30 bg-[#0a120e] p-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 font-mono text-xs">
                <div className="hud-corner-tl" />
                <div className="hud-corner-tr" />
                <div className="hud-corner-bl" />
                <div className="hud-corner-br" />

                <div className="pb-2 border-b border-slate-800">
                  <div className="font-tech font-bold text-white text-sm">Alex Mercer</div>
                  <div className="text-[10px] text-emerald-400">saisiddardhavoruganti@gmail.com</div>
                </div>

                <div className="pt-2 flex flex-col gap-1.5 text-slate-300">
                  <div className="flex items-center justify-between text-[11px] py-1">
                    <span>Pilot Status</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] py-1">
                    <span>Universal Fleet</span>
                    <span className="text-blue-400 font-bold">LEVEL 4</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
