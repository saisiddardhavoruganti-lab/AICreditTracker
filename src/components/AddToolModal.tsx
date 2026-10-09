import React, { useState } from 'react';
import { X, Plus, Sparkles, Layers } from 'lucide-react';
import { AiTool, ToolCategory } from '../types/credits';
import { AI_TOOL_PRESETS } from '../data/initialData';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTool: (tool: AiTool) => void;
}

export const AddToolModal: React.FC<AddToolModalProps> = ({
  isOpen,
  onClose,
  onAddTool
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  // Custom tool state
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState<ToolCategory>('text');
  const [tier, setTier] = useState('Pro Subscription');
  const [totalCredits, setTotalCredits] = useState('500');
  const [unit, setUnit] = useState('Credits');
  const [unitDescription, setUnitDescription] = useState('1 credit allows 1 generative operation.');
  const [monthlyCost, setMonthlyCost] = useState('20');
  const [resetsInDays, setResetsInDays] = useState('30');

  const handleSelectPreset = (preset: Partial<AiTool>) => {
    const id = (preset.name || 'custom').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTool: AiTool = {
      id: `${id}-${Date.now()}`,
      name: preset.name || 'New AI Tool',
      provider: preset.provider || 'AI Provider',
      model: preset.model || 'Default Model',
      category: preset.category || 'text',
      tier: preset.tier || 'Pro Tier',
      availableCredits: preset.availableCredits || 500,
      totalCredits: preset.totalCredits || 500,
      unit: preset.unit || 'Credits',
      unitDescription: preset.unitDescription || '1 unit per generative turn.',
      resetsInDays: 30,
      resetDate: 'In 30 days',
      monthlyCost: preset.monthlyCost || 20,
      autoRenew: true,
      status: 'optimal',
      accentColor: preset.accentColor || 'emerald',
      notes: 'Active subscription synced.'
    };
    onAddTool(newTool);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    const numTotal = parseFloat(totalCredits) || 500;

    const newTool: AiTool = {
      id,
      name: name.trim(),
      provider: provider.trim() || 'AI Provider',
      model: model.trim() || 'General Model',
      category,
      tier: tier.trim() || 'Standard Tier',
      availableCredits: numTotal,
      totalCredits: numTotal,
      unit: unit.trim() || 'Credits',
      unitDescription: unitDescription.trim() || 'Generative compute units.',
      resetsInDays: parseInt(resetsInDays) || 30,
      resetDate: `In ${resetsInDays} days`,
      monthlyCost: parseFloat(monthlyCost) || 0,
      autoRenew: true,
      status: 'optimal',
      accentColor: category === 'video' ? 'rose' : category === 'image' ? 'emerald' : 'blue',
      notes: 'Added to command suite.'
    };

    onAddTool(newTool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-xl border border-emerald-500/30 bg-[#0a120e] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] animate-fadeIn">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/15">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-emerald-400" />
            <h2 className="font-tech text-xl font-bold text-white uppercase tracking-wider">
              Add New AI Service / Core
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-1.5 rounded font-mono text-xs uppercase transition-all cursor-pointer ${
              activeTab === 'preset'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            ⭐ Popular AI Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 rounded font-mono text-xs uppercase transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
            }`}
          >
            ⚙️ Custom Tool Configuration
          </button>
        </div>

        {activeTab === 'preset' ? (
          <div className="flex flex-col gap-3 pt-4 max-h-96 overflow-y-auto">
            <span className="font-mono text-xs text-slate-400 uppercase">
              Click any service to add to your cockpit:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AI_TOOL_PRESETS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between gap-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {preset.name}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      ${preset.monthlyCost}/mo
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    {preset.totalCredits} {preset.unit}
                  </div>
                  <div className="text-[10px] font-sans text-slate-400 line-clamp-2">
                    {preset.unitDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3 pt-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Tool Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leonardo AI"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Provider / Creator:</label>
                <input
                  type="text"
                  placeholder="e.g. Leonardo.Ai"
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Model / Engine:</label>
                <input
                  type="text"
                  placeholder="e.g. Phoenix v2"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Category:</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ToolCategory)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="text">Text / Reasoning</option>
                  <option value="image">Image Generation</option>
                  <option value="video">Video Synthesis</option>
                  <option value="audio">Voice / Audio</option>
                  <option value="code">Code / IDE</option>
                  <option value="multimodal">Multimodal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Allowance / Total:</label>
                <input
                  type="number"
                  value={totalCredits}
                  onChange={e => setTotalCredits(e.target.value)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Credit Unit:</label>
                <input
                  type="text"
                  placeholder="e.g. Tokens, Fast hrs"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] text-slate-400 uppercase">Monthly Price ($):</label>
                <input
                  type="number"
                  value={monthlyCost}
                  onChange={e => setMonthlyCost(e.target.value)}
                  className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] text-slate-400 uppercase">
                Plain English Explanation (For Non-Tech Users):
              </label>
              <input
                type="text"
                placeholder="e.g. 1 credit allows 1 photo render or 4 rapid sketches."
                value={unitDescription}
                onChange={e => setUnitDescription(e.target.value)}
                className="p-2 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:border-emerald-400 focus:outline-none"
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
                Connect Service
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
