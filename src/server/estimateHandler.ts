import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

export interface TaskEstimationRequest {
  task: string;
  qualityTier?: 'efficient' | 'balanced' | 'flagship';
  tools?: {
    id: string;
    name: string;
    unit: string;
    available: number;
    total: number;
  }[];
}

export interface SubtaskEstimate {
  step: string;
  category: 'text' | 'image' | 'video' | 'audio' | 'code' | 'search';
  toolName: string;
  toolId: string;
  nativeAmount: number;
  nativeUnit: string;
  universalCredits: number;
  reasoning: string;
}

export interface TaskEstimationResponse {
  taskSummary: string;
  totalUniversalCredits: number;
  complexity: 'Low' | 'Medium' | 'High' | 'Heavy Compute';
  subtasks: SubtaskEstimate[];
  feasibility: {
    status: 'ready' | 'warning' | 'insufficient';
    message: string;
    deficits: {
      toolName: string;
      needed: number;
      available: number;
      unit: string;
      deficit: number;
    }[];
  };
  efficiencyTips: string[];
  recommendedAlternative?: string;
  source: 'gemini' | 'heuristic';
}

function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
}

// High-fidelity fallback heuristic estimator in case API key is absent or network fails
export function calculateHeuristicEstimate(
  task: string,
  qualityTier: 'efficient' | 'balanced' | 'flagship' = 'balanced',
  userTools: { id: string; name: string; unit: string; available: number; total: number }[] = []
): TaskEstimationResponse {
  const lower = task.toLowerCase();
  const subtasks: SubtaskEstimate[] = [];
  const multiplier = qualityTier === 'flagship' ? 1.4 : qualityTier === 'efficient' ? 0.75 : 1.0;

  const isVideo = lower.includes('video') || lower.includes('animation') || lower.includes('clip') || lower.includes('trailer') || lower.includes('runway') || lower.includes('cinema');
  const isImage = lower.includes('image') || lower.includes('illustration') || lower.includes('photo') || lower.includes('picture') || lower.includes('midjourney') || lower.includes('art') || lower.includes('render');
  const isAudio = lower.includes('voice') || lower.includes('audio') || lower.includes('speech') || lower.includes('podcast') || lower.includes('elevenlabs') || lower.includes('soundtrack') || lower.includes('narration');
  const isCode = lower.includes('code') || lower.includes('app') || lower.includes('react') || lower.includes('function') || lower.includes('refactor') || lower.includes('cursor') || lower.includes('debug') || lower.includes('script') && !isVideo;
  const isText = lower.includes('write') || lower.includes('article') || lower.includes('essay') || lower.includes('research') || lower.includes('chatgpt') || lower.includes('claude') || lower.includes('prompt') || (!isVideo && !isImage && !isAudio && !isCode);

  if (isText || isVideo || isCode) {
    const textMsgs = Math.max(2, Math.round(4 * multiplier));
    subtasks.push({
      step: 'Outline, Logic & Creative Prompting',
      category: 'text',
      toolName: 'Claude 3.5 Pro',
      toolId: 'claude-3-5',
      nativeAmount: textMsgs,
      nativeUnit: 'msgs',
      universalCredits: Math.round(textMsgs * 1.5),
      reasoning: 'Initial structural drafting and parameter conditioning across 3-4 prompt turns.'
    });
  }

  if (isImage || isVideo) {
    const renders = isVideo ? Math.max(3, Math.round(6 * multiplier)) : Math.max(4, Math.round(8 * multiplier));
    const gpuHours = +(renders * 0.035).toFixed(2);
    subtasks.push({
      step: 'Visual Keyframes & Concept Renders',
      category: 'image',
      toolName: 'Midjourney v6',
      toolId: 'midjourney-v6',
      nativeAmount: gpuHours,
      nativeUnit: 'GPU hrs',
      universalCredits: Math.round(gpuHours * 60),
      reasoning: `Synthesizing ${renders} high-resolution style keyframes in Fast GPU mode.`
    });
  }

  if (isVideo) {
    const videoSeconds = Math.max(10, Math.round(25 * multiplier));
    const runwayCredits = videoSeconds * 5;
    subtasks.push({
      step: 'Motion Interpolation & Video Generation',
      category: 'video',
      toolName: 'Runway Gen-3',
      toolId: 'runway-gen3',
      nativeAmount: runwayCredits,
      nativeUnit: 'credits',
      universalCredits: runwayCredits,
      reasoning: `Rendering ~${Math.round(videoSeconds / 5)} dynamic 5-second video sequences via Gen-3 Alpha.`
    });
  }

  if (isAudio) {
    const charCount = Math.max(1200, Math.round(3500 * multiplier));
    subtasks.push({
      step: 'Neural Voice Synthesis & Audio Mastering',
      category: 'audio',
      toolName: 'ElevenLabs',
      toolId: 'elevenlabs',
      nativeAmount: charCount,
      nativeUnit: 'characters',
      universalCredits: Math.round(charCount / 300),
      reasoning: `Cloning voiceover narration (~${Math.round(charCount / 850)} min read) with speech prosody.`
    });
  }

  if (isCode) {
    const queries = Math.max(5, Math.round(18 * multiplier));
    subtasks.push({
      step: 'AI IDE Code Synthesis & Unit Testing',
      category: 'code',
      toolName: 'Cursor Pro',
      toolId: 'cursor-pro',
      nativeAmount: queries,
      nativeUnit: 'fast queries',
      universalCredits: queries * 2,
      reasoning: `Running agentic code completion, terminal debugging, and multi-file refactoring.`
    });
  }

  const totalUniversalCredits = subtasks.reduce((sum, s) => sum + s.universalCredits, 0);

  // Check feasibility against user's actual balances
  const deficits: TaskEstimationResponse['feasibility']['deficits'] = [];
  for (const sub of subtasks) {
    const userTool = userTools.find(t => t.id === sub.toolId || t.name.toLowerCase().includes(sub.toolName.toLowerCase().split(' ')[0]));
    if (userTool && userTool.available < sub.nativeAmount) {
      deficits.push({
        toolName: sub.toolName,
        needed: sub.nativeAmount,
        available: userTool.available,
        unit: sub.nativeUnit,
        deficit: +(sub.nativeAmount - userTool.available).toFixed(1)
      });
    }
  }

  let status: 'ready' | 'warning' | 'insufficient' = 'ready';
  let message = 'All requested power cores have sufficient energy reserves for immediate execution.';

  if (deficits.length > 0) {
    status = 'insufficient';
    message = `Insufficient quota detected in ${deficits.map(d => d.toolName).join(', ')}. Action required before starting.`;
  } else if (totalUniversalCredits > 120) {
    status = 'warning';
    message = 'High-compute task: burns significant reserve pool. Review suggestions to optimize burn rate.';
  }

  const complexity: TaskEstimationResponse['complexity'] =
    totalUniversalCredits > 200 ? 'Heavy Compute' : totalUniversalCredits > 80 ? 'High' : totalUniversalCredits > 30 ? 'Medium' : 'Low';

  const efficiencyTips = [
    'Lock seed values on visual renders to avoid repetitive prompt cycles.',
    'Draft rough scripts in fast reasoning mode before requesting final deep model passes.',
    'Batch generate 4 image variations at once rather than running sequential prompts.',
  ];

  if (isVideo) {
    efficiencyTips.unshift('Generate keyframes first in Midjourney, then use image-to-video instead of pure text-to-video to reduce Runway rerolls by ~40%.');
  }

  return {
    taskSummary: task.length > 100 ? task.slice(0, 97) + '...' : task,
    totalUniversalCredits,
    complexity,
    subtasks,
    feasibility: {
      status,
      message,
      deficits,
    },
    efficiencyTips,
    recommendedAlternative: qualityTier === 'flagship' 
      ? 'Switching to Balanced tier will reduce estimated consumption by 32% while keeping 95% output fidelity.' 
      : undefined,
    source: 'heuristic',
  };
}

export async function handleEstimateTask(req: IncomingMessage, res: ServerResponse) {
  try {
    const raw = await parseBody(req);
    const data: TaskEstimationRequest = JSON.parse(raw || '{}');
    const task = (data.task || '').trim();

    if (!task) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Task description is required' }));
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const fallback = calculateHeuristicEstimate(task, data.qualityTier, data.tools);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(fallback));
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const userToolsStr = (data.tools || [])
        .map(t => `- ${t.name} (ID: ${t.id}): ${t.available} / ${t.total} ${t.unit} available`)
        .join('\n');

      const prompt = `
You are an expert AI Compute Resource Architect for the "AetherCredits" cockpit.
A user wants to run this creative/technical task:
"${task}"

Quality tier selected: "${data.qualityTier || 'balanced'}".

User's current connected AI tool balances:
${userToolsStr || 'None provided; assume standard Pro subscriptions (ChatGPT, Claude, Midjourney, Runway, ElevenLabs, Cursor)'}

Break down this task into subtasks and calculate the exact credits consumed across AI platforms.
Explain each subtask, the tool best suited for it, the native tool units (e.g. msgs, GPU hrs, credits, characters, fast queries), and universal energy credits (where 1 Universal Credit ≈ $0.01 worth of AI compute).

Format your response strictly as valid JSON matching this structure:
{
  "taskSummary": "Short concise summary of the task (under 12 words)",
  "totalUniversalCredits": 145,
  "complexity": "Low" | "Medium" | "High" | "Heavy Compute",
  "subtasks": [
    {
      "step": "Name of subtask",
      "category": "text" | "image" | "video" | "audio" | "code" | "search",
      "toolName": "e.g. Midjourney v6",
      "toolId": "e.g. midjourney-v6",
      "nativeAmount": 0.25,
      "nativeUnit": "GPU hrs",
      "universalCredits": 15,
      "reasoning": "Brief explanation why"
    }
  ],
  "feasibility": {
    "status": "ready" | "warning" | "insufficient",
    "message": "Clear explanation whether user has enough credits or if a deficit exists",
    "deficits": [
      {
        "toolName": "Runway Gen-3",
        "needed": 120,
        "available": 95,
        "unit": "credits",
        "deficit": 25
      }
    ]
  },
  "efficiencyTips": [
    "Practical tip 1 to save credits on this task",
    "Practical tip 2"
  ],
  "recommendedAlternative": "Optional suggestion to lower costs without hurting quality"
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);
      parsed.source = 'gemini';

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(parsed));
    } catch (geminiError) {
      console.warn('Gemini API call failed, falling back to heuristic engine:', geminiError);
      const fallback = calculateHeuristicEstimate(task, data.qualityTier, data.tools);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(fallback));
    }
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Server error' }));
  }
}
