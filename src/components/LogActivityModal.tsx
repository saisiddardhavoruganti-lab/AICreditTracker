import React, { useState } from 'react';
import { X, Flame, Plus, CheckCircle2 } from 'lucide-react';
import { AiTool, ToolCategory } from '../types/credits';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: AiTool[];
  onLogActivity: (activity: {
    title: string;
    toolId: string;
    amountDelta: number;
    detail: string;
    type: 'burn' | 'refill';
  }) => void;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  tools,
  onLogActivity
}) => {
  if (!isOpen) return null;

  const [toolId, setToolId] = useState(tools[0]?.id || '');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('1');
  const [type, setType] = useState<'burn' | 'refill'>('burn');
  const [detail, setDetail] = useState('');

  const selectedTool = tools.find(t => t.id === toolId) || tools[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 1;
    onLogActivity({
      title: title.trim() || `${type === 'burn' ? 'Manual usage' : 'Top-up'} on ${selectedTool.name}`,
      toolId: selectedTool.id,
      amountDelta: type === 'burn' ? -Math.abs(numAmount) : Math.abs(numAmount),
      detail: detail.trim() || `${selectedTool.provider} session`,
      type
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-xl border border-emerald-500/30 bg-[#0a120e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] animate-fadeIn">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
          <div className="flex items-center gap-2">
            {type === 'burn' ? (
              <Flame size={20} className="text-amber-400" />
            ) : (
              <Plus size={20} className="text-emerald-400" />
            )}
            <h2 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
              {type === 'burn' ? 'Record Credit Burn' : 'Record Credit Top-Up'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          {/* Action Type Toggle */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400 uppercase">Operation:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
              <button
                type="button"
                onClick={() => setType('burn')}
                className={`px-3 py-1 rounded font-mono text-xs uppercase cursor-pointer ${
                  type === 'burn'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400'
                }`}
              >
                Consume / Burn
              </button>
              <button
                type="button"
                onClick={() => setType('refill')}
                className={`px-3 py-1 rounded font-mono text-xs uppercase cursor-pointer ${
                  type === 'refill'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400'
                }`}
              >
                Top-Up / Refill
              </button>
            </div>
          </div>

          {/* AI Tool Select */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-300 uppercase">Target AI Tool:</label>
            <select
              value={toolId}
              onChange={e => setToolId(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-emerald-400 focus:outline-none"
            >
              {tools.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.availableCredits} {t.unit} left)
                </option>
              ))}
            </select>
          </div>

          {/* Task / Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-300 uppercase">Task Description:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Synthesized 8 game asset textures"
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-100 font-sans text-xs focus:border-emerald-400 focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Amount & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-slate-300 uppercase">Amount:</label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-xs text-slate-300 uppercase">Unit:</label>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400 truncate">
                {selectedTool?.unit || 'Credits'}
              </div>
            </div>
          </div>

          {/* Tag/Detail */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-xs text-slate-300 uppercase">Context Tag / Note:</label>
            <input
              type="text"
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder="e.g. Project Apollo • Batch Reroll"
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-100 font-sans text-xs focus:border-emerald-400 focus:outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-slate-800 text-slate-400 hover:text-slate-200 font-mono text-xs uppercase cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,136,0.35)] cursor-pointer"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
