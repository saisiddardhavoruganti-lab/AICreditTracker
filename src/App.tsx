/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DailyCommandView } from './components/DailyCommandView';
import { TaskEstimatorView } from './components/TaskEstimatorView';
import { WeeklyDigestView } from './components/WeeklyDigestView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { LogActivityModal } from './components/LogActivityModal';
import { AddToolModal } from './components/AddToolModal';
import { ServerVaultModal } from './components/ServerVaultModal';
import { 
  INITIAL_AI_TOOLS, 
  INITIAL_ACTIVITIES, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { AiTool, BurnActivity, NotificationItem } from './types/credits';
import { playCyberBeep, playConfirmSound, playAlertSound } from './utils/audio';
import { TaskEstimationResponse } from './server/estimateHandler';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'daily-command' | 'task-estimator' | 'weekly-digest' | 'subscriptions'>('daily-command');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isServerVaultOpen, setIsServerVaultOpen] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Connecting...');

  // State
  const [tools, setTools] = useState<AiTool[]>(INITIAL_AI_TOOLS);
  const [activities, setActivities] = useState<BurnActivity[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [vaultMeta, setVaultMeta] = useState<any>({
    totalUsableCredits: 8420,
    maxCapacityCredits: 12000,
    todayBurn: 145,
    expiringCredits: 350
  });

  const isSavingToServerRef = useRef(false);

  // Sync state to server /data/vault.json
  const persistToServer = useCallback(async (
    newTools: AiTool[], 
    newActivities: BurnActivity[], 
    customMeta?: any
  ) => {
    try {
      isSavingToServerRef.current = true;
      const payload = {
        meta: {
          ...vaultMeta,
          ...customMeta,
          lastSync: new Date().toISOString()
        },
        tools: newTools,
        activities: newActivities
      };

      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setLastSyncedTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Could not persist to server vault:', err);
    } finally {
      setTimeout(() => {
        isSavingToServerRef.current = false;
      }, 500);
    }
  }, [vaultMeta]);

  // Pull latest vault from /api/vault
  const fetchServerVault = useCallback(async (silent = false) => {
    if (isSavingToServerRef.current) return;
    try {
      const res = await fetch('/api/vault');
      if (res.ok) {
        const data = await res.json();
        if (data.tools && Array.isArray(data.tools)) {
          setTools(data.tools);
        }
        if (data.activities && Array.isArray(data.activities)) {
          setActivities(data.activities);
        }
        if (data.meta) {
          setVaultMeta(data.meta);
          setLastSyncedTime(new Date(data.meta.lastSync || Date.now()).toLocaleTimeString());
        }
      }
    } catch (err) {
      if (!silent) console.warn('Could not load server vault:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchServerVault();
  }, [fetchServerVault]);

  // Real-time polling every 5s to sync changes made directly in /data/vault.json
  useEffect(() => {
    const interval = setInterval(() => {
      fetchServerVault(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchServerVault]);

  // Audio feedback helper
  const triggerAudio = (type: 'beep' | 'confirm' | 'alert' = 'beep') => {
    if (!soundEnabled) return;
    if (type === 'beep') playCyberBeep();
    else if (type === 'confirm') playConfirmSound();
    else if (type === 'alert') playAlertSound();
  };

  const handleTabChange = (tab: typeof currentTab) => {
    triggerAudio('beep');
    setCurrentTab(tab);
  };

  // Quick burn simulation on a tool
  const handleQuickBurn = (toolId: string, amount: number) => {
    triggerAudio('beep');
    const updatedTools = tools.map(t => {
      if (t.id === toolId) {
        const nextVal = Math.max(0, +(t.availableCredits - amount).toFixed(1));
        return {
          ...t,
          availableCredits: nextVal,
          status: (nextVal / t.totalCredits) < 0.25 ? ('low' as const) : t.status
        };
      }
      return t;
    });

    const tool = tools.find(t => t.id === toolId);
    let updatedActivities = activities;
    if (tool) {
      const newAct: BurnActivity = {
        id: `act-${Date.now()}`,
        title: `Quick operation executed on ${tool.name}`,
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        amountDelta: -amount,
        unit: tool.unit.split(' ')[0],
        universalDelta: -Math.round(amount * (tool.category === 'image' ? 60 : 1)),
        detail: 'Quick telemetry trigger',
        type: 'burn'
      };
      updatedActivities = [newAct, ...activities];
    }

    setTools(updatedTools);
    setActivities(updatedActivities);
    persistToServer(updatedTools, updatedActivities);
  };

  // Quick refill simulation on a tool
  const handleQuickRefill = (toolId: string, amount: number) => {
    triggerAudio('confirm');
    const updatedTools = tools.map(t => {
      if (t.id === toolId) {
        const nextVal = Math.min(t.totalCredits, +(t.availableCredits + amount).toFixed(1));
        return {
          ...t,
          availableCredits: nextVal,
          status: (nextVal / t.totalCredits) >= 0.25 ? ('optimal' as const) : t.status
        };
      }
      return t;
    });

    const tool = tools.find(t => t.id === toolId);
    let updatedActivities = activities;
    if (tool) {
      const newAct: BurnActivity = {
        id: `act-${Date.now()}`,
        title: `Manual credit refill on ${tool.name}`,
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        amountDelta: amount,
        unit: tool.unit.split(' ')[0],
        universalDelta: Math.round(amount * (tool.category === 'image' ? 60 : 1)),
        detail: 'Instant top-up',
        type: 'refill'
      };
      updatedActivities = [newAct, ...activities];
    }

    setTools(updatedTools);
    setActivities(updatedActivities);
    persistToServer(updatedTools, updatedActivities);
  };

  // Custom log activity from modal
  const handleLogActivity = (data: {
    title: string;
    toolId: string;
    amountDelta: number;
    detail: string;
    type: 'burn' | 'refill';
  }) => {
    triggerAudio('confirm');
    const tool = tools.find(t => t.id === data.toolId);
    if (!tool) return;

    const updatedTools = tools.map(t => {
      if (t.id === data.toolId) {
        const nextVal = Math.max(0, Math.min(t.totalCredits * 2, +(t.availableCredits + data.amountDelta).toFixed(1)));
        return {
          ...t,
          availableCredits: nextVal,
          status: (nextVal / t.totalCredits) < 0.25 ? ('low' as const) : ('optimal' as const)
        };
      }
      return t;
    });

    const newAct: BurnActivity = {
      id: `act-${Date.now()}`,
      title: data.title,
      toolId: tool.id,
      toolName: tool.name,
      category: tool.category,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      amountDelta: data.amountDelta,
      unit: tool.unit.split(' ')[0] || 'CR',
      universalDelta: data.amountDelta * (tool.category === 'image' ? 60 : 1),
      detail: data.detail,
      type: data.type
    };

    const updatedActivities = [newAct, ...activities];
    setTools(updatedTools);
    setActivities(updatedActivities);
    persistToServer(updatedTools, updatedActivities);
  };

  // Add new tool
  const handleAddTool = (newTool: AiTool) => {
    triggerAudio('confirm');
    const updated = [...tools, newTool];
    setTools(updated);
    persistToServer(updated, activities);
  };

  // Delete tool
  const handleDeleteTool = (toolId: string) => {
    triggerAudio('alert');
    const updated = tools.filter(t => t.id !== toolId);
    setTools(updated);
    persistToServer(updated, activities);
  };

  // Toggle auto renew
  const handleToggleAutoRenew = (toolId: string) => {
    triggerAudio('beep');
    const updated = tools.map(t => t.id === toolId ? { ...t, autoRenew: !t.autoRenew } : t);
    setTools(updated);
    persistToServer(updated, activities);
  };

  // Refill all tools
  const handleRefillAllTools = () => {
    triggerAudio('confirm');
    const updatedTools = tools.map(t => ({ ...t, availableCredits: t.totalCredits, status: 'optimal' as const }));
    const newAct: BurnActivity = {
      id: `act-${Date.now()}`,
      title: 'Full Fleet Monthly Quota Refresh',
      toolId: 'fleet',
      toolName: 'All Active Cores',
      category: 'multimodal',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      amountDelta: 2500,
      unit: 'CR',
      universalDelta: 2500,
      detail: 'Fleet Sync',
      type: 'refill'
    };
    const updatedActivities = [newAct, ...activities];
    setTools(updatedTools);
    setActivities(updatedActivities);
    persistToServer(updatedTools, updatedActivities);
  };

  // Universal credits boost
  const handleAddUniversalCredits = (amount: number) => {
    triggerAudio('confirm');
    const newAct: BurnActivity = {
      id: `act-${Date.now()}`,
      title: `Added Universal AI Energy Pack (+${amount.toLocaleString()} CR)`,
      toolId: 'universal-pool',
      toolName: 'Universal Energy Reserves',
      category: 'multimodal',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      amountDelta: amount,
      unit: 'CR',
      universalDelta: amount,
      detail: 'Instant Delivery ($10)',
      type: 'refill'
    };
    const updatedActivities = [newAct, ...activities];
    setActivities(updatedActivities);
    persistToServer(tools, updatedActivities);
  };

  // Execute Task Estimator output
  const handleExecuteEstimate = (estimate: TaskEstimationResponse) => {
    triggerAudio('confirm');
    let updatedTools = [...tools];
    for (const sub of estimate.subtasks) {
      updatedTools = updatedTools.map(t => {
        if (t.id === sub.toolId || t.name.toLowerCase().includes(sub.toolName.toLowerCase().split(' ')[0])) {
          const nextVal = Math.max(0, +(t.availableCredits - sub.nativeAmount).toFixed(1));
          return {
            ...t,
            availableCredits: nextVal,
            status: (nextVal / t.totalCredits) < 0.25 ? ('low' as const) : t.status
          };
        }
        return t;
      });
    }

    const newAct: BurnActivity = {
      id: `act-${Date.now()}`,
      title: `Executed AI Task: ${estimate.taskSummary}`,
      toolId: estimate.subtasks[0]?.toolId || 'multi-tool',
      toolName: 'Multi-Tool Fleet Execution',
      category: estimate.subtasks[0]?.category || 'multimodal',
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      amountDelta: -estimate.totalUniversalCredits,
      unit: 'CR',
      universalDelta: -estimate.totalUniversalCredits,
      detail: `${estimate.subtasks.length} subtasks completed`,
      type: 'burn'
    };

    const updatedActivities = [newAct, ...activities];
    setTools(updatedTools);
    setActivities(updatedActivities);
    persistToServer(updatedTools, updatedActivities);
  };

  // Save from ServerVaultModal
  const handleSaveVaultFromModal = async (newData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        if (newData.tools) setTools(newData.tools);
        if (newData.activities) setActivities(newData.activities);
        if (newData.meta) setVaultMeta(newData.meta);
        setLastSyncedTime(new Date().toLocaleTimeString());
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Dismiss notification
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Reset to default sample state
  const handleResetData = async () => {
    if (window.confirm('Reset all AI tools and activity feed to default cockpit data?')) {
      triggerAudio('alert');
      const defaultState = {
        meta: {
          pilotName: "Alex Mercer",
          pilotRank: "Pro Creator",
          totalUsableCredits: 8420,
          maxCapacityCredits: 12000,
          todayBurn: 145,
          expiringCredits: 350,
          lastSync: new Date().toISOString()
        },
        tools: INITIAL_AI_TOOLS,
        activities: INITIAL_ACTIVITIES
      };
      await handleSaveVaultFromModal(defaultState);
    }
  };

  // Aggregated values
  const totalUsableCredits = vaultMeta.totalUsableCredits || 8420;
  const maxCapacityCredits = vaultMeta.maxCapacityCredits || 12000;
  const todayBurn = vaultMeta.todayBurn || 145;
  const expiringCredits = vaultMeta.expiringCredits || 350;
  const monthlySpend = tools.reduce((sum, t) => sum + t.monthlyCost, 0);

  const fullVaultData = {
    meta: vaultMeta,
    tools,
    activities
  };

  return (
    <div className="bg-[#050807] min-h-screen text-[#d8eade] antialiased selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Ambient Phosphor Matrix Glow & Sci-Fi Background Grids */}
      <div className="fixed inset-0 hud-grid pointer-events-none z-0" />
      <div className="fixed inset-0 hud-scanlines opacity-40 z-50 pointer-events-none" />
      <div className="fixed -top-40 left-1/4 w-[600px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Left Futuristic Dock / Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onResetData={handleResetData}
        onOpenServerVault={() => setIsServerVaultOpen(true)}
        activeToolsCount={tools.length}
      />

      {/* Main HUD Content Area */}
      <div className="pl-72 min-h-screen flex flex-col">
        {/* Top Cockpit Control Header */}
        <Header
          totalUsableCredits={totalUsableCredits}
          maxCapacityCredits={maxCapacityCredits}
          onOpenEstimator={() => handleTabChange('task-estimator')}
          onOpenLogModal={() => setIsLogModalOpen(true)}
          onOpenServerVault={() => setIsServerVaultOpen(true)}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onClearAllNotifications={handleClearAllNotifications}
        />

        {/* Main Deck Container */}
        <main className="relative pt-16 w-full flex-1 z-10 pb-12">
          {currentTab === 'daily-command' && (
            <DailyCommandView
              tools={tools}
              activities={activities}
              totalUsableCredits={totalUsableCredits}
              maxCapacityCredits={maxCapacityCredits}
              todayBurn={todayBurn}
              expiringCredits={expiringCredits}
              monthlySpend={monthlySpend}
              onQuickBurn={handleQuickBurn}
              onQuickRefill={handleQuickRefill}
              onOpenLogModal={() => setIsLogModalOpen(true)}
              onOpenAddToolModal={() => setIsAddToolModalOpen(true)}
              onOpenEstimator={() => handleTabChange('task-estimator')}
              onAddUniversalCredits={handleAddUniversalCredits}
              onNavigateToSubscriptions={() => handleTabChange('subscriptions')}
            />
          )}

          {currentTab === 'task-estimator' && (
            <TaskEstimatorView
              tools={tools}
              onExecuteEstimate={handleExecuteEstimate}
            />
          )}

          {currentTab === 'weekly-digest' && (
            <WeeklyDigestView
              tools={tools}
              activities={activities}
              totalWeeklyBurn={1120}
            />
          )}

          {currentTab === 'subscriptions' && (
            <SubscriptionsView
              tools={tools}
              onOpenAddToolModal={() => setIsAddToolModalOpen(true)}
              onDeleteTool={handleDeleteTool}
              onRefillAllTools={handleRefillAllTools}
              onToggleAutoRenew={handleToggleAutoRenew}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <LogActivityModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        tools={tools}
        onLogActivity={handleLogActivity}
      />

      <AddToolModal
        isOpen={isAddToolModalOpen}
        onClose={() => setIsAddToolModalOpen(false)}
        onAddTool={handleAddTool}
      />

      <ServerVaultModal
        isOpen={isServerVaultOpen}
        onClose={() => setIsServerVaultOpen(false)}
        vaultData={fullVaultData}
        onSaveVault={handleSaveVaultFromModal}
        onRefreshVault={() => fetchServerVault(false)}
        lastSyncedTime={lastSyncedTime}
      />
    </div>
  );
}

