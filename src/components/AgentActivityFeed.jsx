import React, { useState, useEffect } from 'react';

// Counter component to animate duration in ms
function DurationCounter({ value, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || value === 0) {
      setCount(0);
      return;
    }
    
    let startTimestamp = null;
    const duration = 400; // Count up duration in ms
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, active]);

  return <span>{count} ms</span>;
}

export default function AgentActivityFeed({ agentTrace }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [staggerCount, setStaggerCount] = useState(0);

  // Stagger entry animation
  useEffect(() => {
    if (!agentTrace || agentTrace.length === 0) {
      setStaggerCount(0);
      return;
    }

    setStaggerCount(0);
    const timers = [];
    for (let i = 0; i < agentTrace.length; i++) {
      const timer = setTimeout(() => {
        setStaggerCount(i + 1);
      }, i * 150); // 150ms stagger
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [agentTrace]);

  if (!agentTrace || agentTrace.length === 0) {
    return null;
  }

  // Icon mapping
  const getAgentIcon = (name) => {
    switch (name) {
      case 'OrchestratorAgent': return '🧠';
      case 'StressDetectorAgent': return '🔍';
      case 'StudyBalanceAgent': return '📊';
      case 'CopingCoachAgent': return '💡';
      case 'CrisisGuardAgent': return '🛡️';
      default: return '🤖';
    }
  };

  // Status color mapping
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return { background: 'rgba(107, 167, 131, 0.12)', color: 'var(--success)', border: '1px solid rgba(107, 167, 131, 0.3)' };
      case 'flagged': return { background: 'rgba(213, 137, 124, 0.12)', color: 'var(--accent-warm)', border: '1px solid rgba(213, 137, 124, 0.3)' };
      case 'crisis': return { background: 'rgba(207, 124, 110, 0.15)', color: 'var(--danger)', border: '1px solid rgba(207, 124, 110, 0.4)' };
      default: return { background: 'rgba(128, 122, 133, 0.12)', color: 'var(--text-muted)', border: '1px solid rgba(128, 122, 133, 0.2)' };
    }
  };

  return (
    <div className="agent-activity-feed-wrapper" style={{ marginTop: '20px', width: '100%' }}>
      {/* Toggle Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="glass-button"
          style={{
            fontSize: '0.8rem',
            padding: '6px 14px',
            borderRadius: '16px',
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            color: 'var(--text-secondary)'
          }}
          id="toggle-agent-feed-btn"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px', transition: 'transform 0.2s' }}>
            {isVisible ? 'visibility_off' : 'visibility'}
          </span>
          {isVisible ? 'Hide Agent Activity' : 'Show Agent Activity'}
        </button>
      </div>

      {isVisible && (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(125, 107, 130, 0.04) 0%, rgba(74, 144, 164, 0.04) 100%)',
            border: '1px solid var(--glass-border)'
          }}
        >
          {/* Header with Mobile Chevron */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              borderBottom: '1px solid rgba(125, 107, 130, 0.1)',
              paddingBottom: '10px',
              marginBottom: '15px'
            }}
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="feed-header"
          >
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span>🛠️</span> Multi-Agent Activity Trace
            </h3>
            
            {/* Chevron (visible on mobile, toggles expanded state) */}
            <span 
              className="material-symbols-outlined mobile-chevron-toggle" 
              style={{ 
                fontSize: '20px',
                color: 'var(--text-muted)',
                transform: isMobileExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              expand_more
            </span>
          </div>

          {/* Cards List container - toggles height based on mobile expand state */}
          <div 
            className={`feed-content-container ${isMobileExpanded ? 'mobile-expanded' : 'mobile-collapsed'}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              overflow: 'hidden',
              transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {agentTrace.map((trace, idx) => {
              const active = idx < staggerCount;
              const isCrisis = trace.agent === 'CrisisGuardAgent' && trace.status === 'crisis';

              return (
                <div
                  key={trace.agent}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: isCrisis ? 'rgba(207, 124, 110, 0.08)' : 'rgba(255, 255, 255, 0.3)',
                    border: isCrisis ? '1px solid var(--danger)' : '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: isCrisis ? '0 0 10px rgba(207, 124, 110, 0.25)' : 'none',
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateY(0)' : 'translateY(15px)',
                    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: isCrisis ? 'pulse-red 2s infinite ease-in-out' : 'none'
                  }}
                  className="agent-trace-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    {/* Icon */}
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                      {getAgentIcon(trace.agent)}
                    </span>

                    {/* Meta info */}
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {trace.agent.replace('Agent', '')}
                        </span>
                        
                        {/* Status Badge */}
                        <span 
                          style={{ 
                            fontSize: '0.65rem', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            ...getStatusStyle(trace.status)
                          }}
                        >
                          {trace.status}
                        </span>
                      </div>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={trace.summary}
                      >
                        {trace.summary}
                      </span>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {trace.status !== 'skipped' && (
                    <div 
                      style={{ 
                        fontSize: '0.7rem', 
                        color: 'var(--text-muted)', 
                        background: 'rgba(125, 107, 130, 0.06)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontWeight: 500,
                        marginLeft: '12px',
                        flexShrink: 0
                      }}
                    >
                      ⏱️ <DurationCounter value={trace.duration_ms} active={active} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Footer Label */}
            <div 
              style={{ 
                textAlign: 'center', 
                fontSize: '0.7rem', 
                color: 'var(--text-muted)', 
                marginTop: '6px',
                fontStyle: 'italic',
                fontWeight: 300
              }}
            >
              Powered by multi-agent AI • MindMitra Orchestration Engine
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Inject for Pulsing Red Frame and Collapsing behavior */}
      <style>{`
        @keyframes pulse-red {
          0% {
            box-shadow: 0 0 0 0 rgba(207, 124, 110, 0.4);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(207, 124, 110, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(207, 124, 110, 0);
          }
        }
        
        /* Mobile collapsing layout rules */
        @media (max-width: 768px) {
          .feed-content-container.mobile-collapsed {
            max-height: 0px !important;
            margin-top: 0px !important;
            opacity: 0;
            pointer-events: none;
          }
          .feed-content-container.mobile-expanded {
            max-height: 500px !important;
            opacity: 1;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-chevron-toggle {
            display: none !important;
          }
          .feed-content-container {
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}
