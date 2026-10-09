import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Copy, 
  Check, 
  Layers, 
  Flame, 
  Clock, 
  RefreshCw,
  Lightbulb,
  ShieldAlert,
  Play
} from 'lucide-react';
import { AiTool } from '../types/credits';
import { TaskEstimationResponse, calculateHeuristicEstimate } from '../server/estimateHandler';

interface TaskEstimatorViewProps {
  tools: AiTool[];
  onExecuteEstimate: (estimate: TaskEstimationResponse) => void;
}

const PRESET_TASKS = [
  {
    label: '🎬 60s Sci-Fi Video Trailer',
    desc: 'Produce a 60-second sci-fi video trailer with a cinematic voiceover, 4 script revisions, and 6 dynamic video scenes.'
  },
  {
    label: '💻 Full-Stack React Code Refactor',
    desc: 'Refactor a 3,000-line React and Tailwind codebase to Next.js App Router, add TypeScript interfaces and 15 unit tests.'
  },
  {
    label: '🎨 12-Page Illustrated Storybook',
    desc: 'Illustrate a 12-page children storybook with consistent cute animal character art and pastel watercolor styles.'
  },
  {
    label: '🎙️ 15-Min Voice Cloned Podcast',
    desc: 'Generate a 15-minute natural dual-speaker interview podcast from an outline notes document using neural voice cloning.'
  },
  {
    label: '📊 20-Page Competitor Intelligence Report',
    desc: 'Conduct deep web research on top 5 AI productivity tools, synthesize financial metrics, and write an executive brief.'
  },
  {
    label: '📱 30-Day Social Media Content Pack',
    desc: 'Draft 30 LinkedIn thought leadership posts, 30 Twitter threads, and 10 promotional graphic concept prompts.'
  }
];

export const TaskEstimatorView: React.FC<TaskEstimatorViewProps> = ({
  tools,
  onExecuteEstimate
}) => {
  const [taskInput, setTaskInput] = useState('');
  const [qualityTier, setQualityTier] = useState<'efficient' | 'balanced' | 'flagship'>('balanced');
  const [loading, setLoading] = useState(false);
  const [estimateResult, setEstimateResult] = useState<TaskEstimationResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [executed, setExecuted] = useState(false);

  const handleSimulate = async () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    setLoading(true);
    setExecuted(false);

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: trimmed,
          qualityTier,
          tools: tools.map(t => ({
            id: t.id,
            name: t.name,
            unit: t.unit,
            available: t.availableCredits,
            total: t.totalCredits
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: TaskEstimationResponse = await response.json();
      setEstimateResult(data);
    } catch (err) {
      console.warn('API call failed, running local heuristic engine:', err);
      // Fallback to local heuristic engine
      const fallback = calculateHeuristicEstimate(
        trimmed,
        qualityTier,
        tools.map(t => ({
          id: t.id,
          name: t.name,
          unit: t.unit,
          available: t.availableCredits,
          total: t.totalCredits
        }))
      );
      setEstimateResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!estimateResult) return;
    const lines = [
      `== AetherCredits Task Cost Estimate ==`,
      `Task: ${estimateResult.taskSummary}`,
      `Complexity: ${estimateResult.complexity}`,
      `Total Estimated AI Energy: ${estimateResult.totalUniversalCredits} Credits`,
      `Feasibility Status: ${estimateResult.feasibility.status.toUpperCase()} - ${estimateResult.feasibility.message}`,
      ``,
      `-- Step Breakdown --`,
      ...estimateResult.subtasks.map(
        s => `• ${s.step}: ${s.toolName} consumes ${s.nativeAmount} ${s.nativeUnit} (~${s.universalCredits} CR)`
      ),
      ``,
      `-- Optimization Advice --`,
      ...estimateResult.efficiencyTips.map(t => `• ${t}`)
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    if (!estimateResult || executed) return;
    onExecuteEstimate(estimateResult);
    setExecuted(true);
  };

  return (
    <div className="flex flex-col w-full p-6 lg:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* Title & Cockpit HUD Banner */}
      <section className="relative w-full rounded-xl border border-emerald-500/30 bg-[#08100c]/90 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(0,255,136,0.08)]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 shadow-[0_0_10px_#3b82f6] animate-pulse" />
              <span className="font-mono text-[11px] tracking-widest text-blue-400 uppercase font-semibold">
                Predictive AI Engine • Task Cost Simulation
              </span>
              <span className="font-mono text-[10px] text-slate-600">| MODEL: GEMINI-3.8-FLASH</span>
            </div>
            <h1 className="font-tech text-3xl font-bold text-white tracking-wider uppercase drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]">
              AI Task Energy Estimator
            </h1>
            <p className="font-sans text-sm text-slate-400 max-w-3xl">
              Type what you want to create or accomplish. Our engine breaks it down into subtasks, checks your current tool balances, and predicts the exact credits needed before you burn a single token.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-950/30 border border-blue-500/40 text-blue-300 font-mono text-xs">
            <Cpu size={16} className="text-blue-400" />
            <span>Pre-Flight Balance Check Active</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-2">
            <label className="font-tech font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>Describe Your Target Task or Project</span>
              <span className="font-mono text-[11px] text-slate-500 font-normal">
                Natural Language • Plain English
              </span>
            </label>
            <div className="relative">
              <textarea
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                rows={3}
                placeholder="e.g. Create a 60-second animated video ad with a cinematic voiceover, 4 script revisions, and 8 generated concept images..."
                className="w-full p-4 rounded-lg bg-slate-950/80 border border-emerald-500/30 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-100 font-sans text-sm placeholder:text-slate-600 resize-none transition-all"
              />
              {taskInput && (
                <button
                  onClick={() => setTaskInput('')}
                  className="absolute top-3 right-3 font-mono text-[11px] text-slate-500 hover:text-slate-300 uppercase cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Preset Chips */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              1-Click Preset Inspirations:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TASKS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setTaskInput(preset.desc)}
                  className="px-3 py-1.5 rounded border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:bg-slate-900 text-slate-300 font-mono text-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Tier Selector & Estimate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Quality Tier:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800">
                <button
                  onClick={() => setQualityTier('efficient')}
                  className={`px-3 py-1 rounded font-mono text-xs uppercase cursor-pointer transition-all ${
                    qualityTier === 'efficient'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Efficient
                </button>
                <button
                  onClick={() => setQualityTier('balanced')}
                  className={`px-3 py-1 rounded font-mono text-xs uppercase cursor-pointer transition-all ${
                    qualityTier === 'balanced'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚖️ Balanced
                </button>
                <button
                  onClick={() => setQualityTier('flagship')}
                  className={`px-3 py-1 rounded font-mono text-xs uppercase cursor-pointer transition-all ${
                    qualityTier === 'flagship'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  💎 Flagship
                </button>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading || !taskInput.trim()}
              className={`px-6 py-2.5 rounded font-tech font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loading || !taskInput.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin text-slate-950" />
                  <span>Simulating Neural Cost...</span>
                </>
              ) : (
                <>
                  <Calculator size={16} />
                  <span>Simulate &amp; Calculate Cost</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Estimation Results Display */}
      {estimateResult && (
        <section className="relative w-full rounded-xl border border-emerald-500/30 bg-[#08100c]/90 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(0,255,136,0.08)] flex flex-col gap-6 animate-fadeIn">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          {/* Results Summary Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-500/15">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Simulation Results • {estimateResult.source === 'gemini' ? 'Gemini 3.8 Flash AI Model' : 'Heuristic Compute Engine'}
              </span>
              <h2 className="font-tech text-2xl font-bold text-white tracking-wide">
                {estimateResult.taskSummary}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40">
                <span className="font-mono text-xs text-slate-400 uppercase">Est. Universal Energy:</span>
                <span className="font-tech text-2xl font-bold text-emerald-300 drop-shadow-[0_0_8px_#00ff88]">
                  ~{estimateResult.totalUniversalCredits} CR
                </span>
              </div>

              <span className={`font-mono text-xs font-bold uppercase px-2.5 py-1.5 rounded border ${
                estimateResult.complexity === 'Heavy Compute'
                  ? 'border-purple-500/40 bg-purple-950/30 text-purple-300'
                  : estimateResult.complexity === 'High'
                    ? 'border-amber-500/40 bg-amber-950/30 text-amber-300'
                    : 'border-blue-500/40 bg-blue-950/30 text-blue-300'
              }`}>
                {estimateResult.complexity}
              </span>
            </div>
          </div>

          {/* Pre-Flight Feasibility Banner */}
          <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
            estimateResult.feasibility.status === 'insufficient'
              ? 'border-rose-500/40 bg-rose-950/30 text-rose-200'
              : estimateResult.feasibility.status === 'warning'
                ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
          }`}>
            <div className="flex items-center gap-3">
              {estimateResult.feasibility.status === 'insufficient' ? (
                <ShieldAlert size={24} className="text-rose-400 flex-shrink-0 animate-pulse" />
              ) : estimateResult.feasibility.status === 'warning' ? (
                <AlertTriangle size={24} className="text-amber-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="font-tech font-bold text-sm uppercase tracking-wide">
                  Pre-Flight Balance Check: {estimateResult.feasibility.status.toUpperCase()}
                </span>
                <span className="font-sans text-xs text-slate-300 mt-0.5">
                  {estimateResult.feasibility.message}
                </span>
              </div>
            </div>

            {estimateResult.feasibility.deficits && estimateResult.feasibility.deficits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {estimateResult.feasibility.deficits.map((def, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-xs px-2 py-1 rounded bg-rose-900/60 border border-rose-500/50 text-rose-300 font-bold"
                  >
                    Deficit: {def.toolName} -{def.deficit} {def.unit}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Step-by-Step Subtasks Breakdown Grid */}
          <div className="flex flex-col gap-3">
            <h3 className="font-tech text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={18} className="text-emerald-400" />
              <span>Predicted Subtask Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {estimateResult.subtasks.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex flex-col justify-between gap-3 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                      Step {idx + 1} • {sub.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                      ~{sub.universalCredits} CR
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="font-tech font-bold text-sm text-white">
                      {sub.step}
                    </span>
                    <span className="font-mono text-xs text-blue-300">
                      {sub.toolName}: <span className="font-bold text-white">{sub.nativeAmount} {sub.nativeUnit}</span>
                    </span>
                    <p className="font-sans text-xs text-slate-400 mt-1 leading-relaxed">
                      {sub.reasoning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Tips & Strategic Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-950/15 flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <Lightbulb size={14} />
                <span>Credit-Saving Optimization Tips</span>
              </span>
              <ul className="flex flex-col gap-1.5 font-sans text-xs text-slate-300">
                {estimateResult.efficiencyTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono text-[10px] mt-0.5">0{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {estimateResult.recommendedAlternative && (
              <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-950/15 flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Alternative Route Available</span>
                </span>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  {estimateResult.recommendedAlternative}
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleCopyReport}
              className="px-4 py-2 rounded border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-mono text-xs uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Report Copied!' : 'Copy Estimation Report'}</span>
            </button>

            <button
              onClick={handleExecute}
              disabled={executed}
              className={`px-6 py-2.5 rounded font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                executed
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_0_20px_rgba(0,255,136,0.4)]'
              }`}
            >
              {executed ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Logged to Active Cores &amp; Feed</span>
                </>
              ) : (
                <>
                  <Play size={16} />
                  <span>Execute &amp; Log This Task Burn</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
