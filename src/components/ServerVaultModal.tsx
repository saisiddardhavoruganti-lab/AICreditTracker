import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Save, 
  RotateCw, 
  FileJson, 
  Check, 
  Copy, 
  AlertCircle,
  Sparkles,
  Sliders
} from 'lucide-react';
import { AiTool, BurnActivity } from '../types/credits';

interface ServerVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultData: any;
  onSaveVault: (newData: any) => Promise<boolean>;
  onRefreshVault: () => Promise<void>;
  lastSyncedTime: string;
}

export const ServerVaultModal: React.FC<ServerVaultModalProps> = ({
  isOpen,
  onClose,
  vaultData,
  onSaveVault,
  onRefreshVault,
  lastSyncedTime
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'visual' | 'raw'>('visual');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Local editable copy of tools for visual tab
  const [editableTools, setEditableTools] = useState<AiTool[]>([]);

  useEffect(() => {
    if (vaultData) {
      setJsonText(JSON.stringify(vaultData, null, 2));
      setEditableTools(vaultData.tools || []);
      setJsonError(null);
    }
  }, [vaultData]);

  const handleToolBalanceChange = (toolId: string, newBalance: number) => {
    setEditableTools(prev => prev.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          availableCredits: newBalance,
          status: (newBalance / t.totalCredits) < 0.25 ? 'low' : 'optimal'
        };
      }
      return t;
    }));
  };

  const handleSaveVisual = async () => {
    setSaving(true);
    const updatedVault = {
      ...vaultData,
      tools: editableTools,
      meta: {
        ...vaultData.meta,
        lastSync: new Date().toISOString()
      }
    };
    const success = await onSaveVault(updatedVault);
    setSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleSaveRaw = async () => {
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonText);
      setSaving(true);
      const success = await onSaveVault(parsed);
      setSaving(false);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err: any) {
      setJsonError(err?.message || 'Invalid JSON syntax');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-xl border border-emerald-500/40 bg-[#08100c] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.95)] flex flex-col gap-4 animate-fadeIn max-h-[90vh]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Database size={20} />
            </div>
            <div>
              <h2 className="font-tech text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Local State Vault</span>
                <span className="font-mono text-xs text-emerald-400 font-normal px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20">
                  /data/vault.json
                </span>
              </h2>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                Zero API keys required. Edit values here or in the server file to update the entire app.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode switcher & File status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1 rounded uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders size={13} />
              <span>Quick Sliders</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1 rounded uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'raw'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileJson size={13} />
              <span>Raw JSON File</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Last Sync: {lastSyncedTime}</span>
            <button
              onClick={onRefreshVault}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase cursor-pointer"
              title="Pull latest file from server"
            >
              <RotateCw size={12} />
              <span>Re-sync</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'visual' ? (
            <div className="flex flex-col gap-3 py-2">
              <span className="font-mono text-xs text-slate-400 uppercase">
                Adjust credit balances across your connected tools:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {editableTools.map(tool => {
                  const percent = Math.round((tool.availableCredits / tool.totalCredits) * 100);
                  const isLow = percent < 25;

                  return (
                    <div
                      key={tool.id}
                      className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-tech font-bold text-sm text-white">
                            {tool.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 block">
                            {tool.provider} • {tool.unit}
                          </span>
                        </div>

                        <span className={`font-mono text-xs font-bold ${isLow ? 'text-rose-400' : 'text-emerald-300'}`}>
                          {tool.availableCredits} / {tool.totalCredits}
                        </span>
                      </div>

                      {/* Range slider */}
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max={tool.totalCredits}
                          step={tool.category === 'image' ? 0.1 : 1}
                          value={tool.availableCredits}
                          onChange={e => handleToolBalanceChange(tool.id, parseFloat(e.target.value))}
                          className="flex-1 accent-emerald-400 cursor-pointer"
                        />
                        <input
                          type="number"
                          step={tool.category === 'image' ? 0.1 : 1}
                          value={tool.availableCredits}
                          onChange={e => handleToolBalanceChange(tool.id, parseFloat(e.target.value) || 0)}
                          className="w-20 p-1 rounded bg-slate-950 border border-slate-800 text-right font-mono text-xs text-white focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 py-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400 uppercase">
                  Edit Server File Content (/data/vault.json):
                </span>
                <button
                  onClick={handleCopyJson}
                  className="font-mono text-xs text-slate-400 hover:text-emerald-400 uppercase flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                rows={16}
                className="w-full p-3 rounded bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs focus:border-emerald-400 focus:outline-none leading-relaxed"
                spellCheck={false}
              />

              {jsonError && (
                <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{jsonError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-500">
            💡 Any changes made directly in <code className="text-emerald-400">/data/vault.json</code> will reload automatically.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border border-slate-800 text-slate-400 hover:text-slate-200 font-mono text-xs uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={activeTab === 'visual' ? handleSaveVisual : handleSaveRaw}
              disabled={saving}
              className="px-5 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>{saveSuccess ? 'Saved to Server!' : saving ? 'Saving...' : 'Save & Update UI'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
