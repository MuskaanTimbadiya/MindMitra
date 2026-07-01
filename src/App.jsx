import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import Mindfulness from './components/Mindfulness';
import VentWall from './components/VentWall';
import SettingsModal from './components/SettingsModal';
import SafetyCard from './components/SafetyCard';
import Logo from './components/Logo';
import ShaderBackground from './components/ShaderBackground';
import { getTranslationText } from './utils/translations';

const NAV_TABS = [
  { id: 'dashboard',   icon: 'spa',              labelKey: 'navSanctuary',   label: 'Sanctuary' },
  { id: 'journal',     icon: 'mood',             labelKey: 'navVibeCheck',   label: 'Vibe Check' },
  { id: 'mindfulness', icon: 'self_improvement', labelKey: 'navMindfulness', label: 'Mindfulness' },
  { id: 'ventwall',    icon: 'forum',            labelKey: 'navVentWall',    label: 'Vent Wall' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpline, setShowHelpline] = useState(false);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('mindspace_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      exam: 'JEE',
      subjects: 'Organic Chemistry, Physics mechanics',
      language: 'en'
    };
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('mindspace_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Do a 2-minute body stretch right now", completed: false },
      { id: 2, text: "Drink a full glass of water", completed: false },
      { id: 3, text: "Write down one thing you are proud of today", completed: false }
    ];
  });

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('mindspace_streak') || '3', 10);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedStreak = parseInt(localStorage.getItem('mindspace_streak') || '3', 10);
      setStreak(savedStreak);
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => { localStorage.setItem('mindspace_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('mindspace_tasks', JSON.stringify(tasks)); }, [tasks]);

  const handleSaveProfile = (newProfile) => setProfile(newProfile);

  const handleTaskToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddCustomAction = (actionText) => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([{ id: newId, text: actionText, completed: false }, ...tasks]);
  };

  useEffect(() => {
    if (!profile.name) setShowSettings(true);
  }, []);

  const lang = profile.language || 'en';

  const activeNavItem = NAV_TABS.find(t => t.id === activeTab);

  return (
    <div className="stitch-root">
      <ShaderBackground />

      {/* ── TOP NAVBAR ── */}
      <nav className="stitch-topnav">
        {/* Brand */}
        <div className="stitch-brand" onClick={() => setActiveTab('dashboard')} role="button">
          <Logo size={34} />
          <span className="stitch-brand-name">MindMitra</span>
        </div>


        {/* Desktop header nav — section anchors with Stitch animated underline hover */}
        <div className="stitch-topnav-links">
          {[
            { label: 'Home', href: '#hero-section', testId: 'nav-link-home', action: (e) => { e.preventDefault(); setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
            { label: 'Daily Tools', href: '#daily-tools', testId: 'nav-link-dailytools', action: (e) => { e.preventDefault(); setActiveTab('dashboard'); setTimeout(() => document.getElementById('daily-tools')?.scrollIntoView({ behavior: 'smooth' }), 100); } },
            { label: 'Mindfulness', href: '#mindfulness-section', testId: 'nav-link-mindfulness', action: (e) => { e.preventDefault(); setActiveTab('mindfulness'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
            { label: '🚨 Helplines', href: '#resources', testId: 'nav-link-helplines', action: (e) => { e.preventDefault(); setShowHelpline(true); } },
          ].map(link => (
            <a
              key={link.label}
              className="stitch-topnav-link"
              href={link.href}
              onClick={link.action}
              data-testid={link.testId}
            >
              {link.label}
              <span className="stitch-topnav-underline" />
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="stitch-topnav-actions">
          {/* Exam badge */}
          {profile.name && (
            <div className="stitch-badge stitch-badge--exam" data-testid="badge-exam">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>school</span>
              {profile.exam}
            </div>
          )}
          {/* Streak badge */}
          <div className="stitch-badge stitch-badge--streak" data-testid="badge-streak">
            <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            {streak}
          </div>
          {/* Notifications */}
          <button
            className="stitch-icon-btn"
            onClick={() => setShowHelpline(true)}
            title="Helplines &amp; Notifications"
            id="trigger-helpline-btn"
            data-testid="btn-notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          {/* Settings */}
          <button
            className="stitch-icon-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
            id="trigger-settings-btn"
            data-testid="btn-settings"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
          {/* Avatar ring */}
          <div className="stitch-avatar-ring" data-testid="avatar-ring">
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--secondary)', fontVariationSettings: "'FILL' 1" }}>person</span>
          </div>
        </div>
      </nav>

      {/* ── LAYOUT BODY ── */}
      <div className="stitch-body">

        {/* ── SIDEBAR (desktop only) ── */}
        <aside className="stitch-sidebar">
          <div className="stitch-sidebar-header">
            <h2 className="stitch-sidebar-title">Aspirant Sanctuary</h2>
            <p className="stitch-sidebar-sub">Preparing with Peace</p>
          </div>

          <nav className="stitch-sidebar-nav">
            {NAV_TABS.map(tab => (
              <button
                key={tab.id}
                className={`stitch-sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-symbols-outlined stitch-sidebar-icon">
                  {tab.icon}
                </span>
                {getTranslationText(lang, tab.labelKey) || tab.label}
              </button>
            ))}
          </nav>

          <div className="stitch-sidebar-footer">
            <button
              className="stitch-sidebar-checkin-btn"
              onClick={() => setActiveTab('journal')}
            >
              Daily Check-in
            </button>
            <button
              className="stitch-sidebar-helpline-btn"
              onClick={() => setShowHelpline(true)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>emergency</span>
              🚨 Helplines &amp; Support
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="stitch-main">
          {activeTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              onSelectTab={setActiveTab}
              tasks={tasks}
              onToggleTask={handleTaskToggle}
            />
          )}
          {activeTab === 'journal' && (
            <Journal
              profile={profile}
              onAddCustomAction={handleAddCustomAction}
            />
          )}
          {activeTab === 'mindfulness' && (
            <Mindfulness profile={profile} />
          )}
          {activeTab === 'ventwall' && (
            <VentWall profile={profile} />
          )}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="stitch-bottomnav">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            className={`stitch-bottomnav-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`material-symbols-outlined ${activeTab === tab.id ? 'filled' : ''}`}
              style={{ fontVariationSettings: activeTab === tab.id ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className="stitch-bottomnav-label">
              {getTranslationText(lang, tab.labelKey)?.split(' ')[0] || tab.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </nav>

      {/* ── SETTINGS MODAL ── */}
      {showSettings && (
        <SettingsModal
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* ── HELPLINE MODAL ── */}
      {showHelpline && (
        <div className="modal-overlay" onClick={() => setShowHelpline(false)} id="helpline-modal-overlay">
          <div
            className="modal-content glass-panel"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 600, borderLeft: '4px solid var(--danger)' }}
          >
            <div className="modal-header">
              <h2>🚨 Helplines &amp; Support</h2>
              <button className="glass-button" onClick={() => setShowHelpline(false)}
                style={{ padding: '6px 12px', borderRadius: '50%' }}>✕</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <SafetyCard profile={profile} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
