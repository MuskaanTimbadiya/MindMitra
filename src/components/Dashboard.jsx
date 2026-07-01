import React, { useState, useEffect } from 'react';
import { MOCK_QUOTES } from '../utils/mockData';
import { getTranslationText } from '../utils/translations';

export default function Dashboard({ profile, onSelectTab, tasks, onToggleTask }) {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [selectedMood, setSelectedMood] = useState(localStorage.getItem('mindspace_mood') || '');
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('mindspace_streak') || '3', 10));

  const [moodHistory, setMoodHistory] = useState([]);
  const [daysRange, setDaysRange] = useState(7);
  const [mcpStatus, setMcpStatus] = useState('loading'); // 'connected', 'offline', 'loading'

  const fetchMoodHistory = async (range = daysRange) => {
    const mcpUrl = import.meta.env.VITE_MCP_URL || 'http://localhost:8000';
    try {
      // Perform health check first
      const healthResp = await fetch(`${mcpUrl}/health`);
      if (!healthResp.ok) throw new Error('Unhealthy');
      
      const historyResp = await fetch(`${mcpUrl}/mood_history?days=${range}`);
      if (!historyResp.ok) throw new Error('Failed to fetch history');
      
      const data = await historyResp.json();
      setMoodHistory(data);
      setMcpStatus('connected');
      localStorage.setItem(`mindspace_cached_moods_${range}`, JSON.stringify(data));
    } catch (err) {
      console.warn('MCP server offline, falling back to local sandbox data:', err);
      setMcpStatus('offline');
      const cached = localStorage.getItem(`mindspace_cached_moods_${range}`);
      if (cached) {
        setMoodHistory(JSON.parse(cached));
      } else {
        // Generate beautiful baseline mock data if no cache exists
        const mockPoints = [];
        const base = new Date();
        for (let i = range - 1; i >= 0; i--) {
          const date = new Date(base.getTime() - i * 24 * 60 * 60 * 1000);
          const wave = Math.sin(i * 0.8) * 3 + 6 + (Math.random() - 0.5) * 2;
          const score = Math.max(1, Math.min(10, Math.round(wave)));
          mockPoints.push({
            mood_score: score,
            timestamp: date.toISOString(),
            text: i % 2 === 0 ? "Felt study anxiety but resolved it" : "Quick mood check-in"
          });
        }
        setMoodHistory(mockPoints);
      }
    }
  };

  useEffect(() => {
    fetchMoodHistory(daysRange);
    
    const handleUpdate = () => {
      fetchMoodHistory(daysRange);
    };
    window.addEventListener('mcp_mood_updated', handleUpdate);
    return () => {
      window.removeEventListener('mcp_mood_updated', handleUpdate);
    };
  }, [daysRange]);


  const lang = profile?.language || 'en';

  // Localized breaks list
  const getLocalizedBreaks = () => {
    switch (lang) {
      case 'hi':
        return [
          { id: 'chai', label: '🍵 5-मिनट चाय/कॉफ़ी ब्रेक', done: false },
          { id: 'balcony', label: '🚶‍♂️ बालकनी वॉक और खुली हवा', done: false },
          { id: 'stretch', label: '🙆‍♂️ पूरे शरीर को स्ट्रेच करें', done: false },
          { id: 'eyes', label: '👀 आँखों को आराम दें (20-20-20 नियम)', done: false }
        ];
      case 'hinglish':
        return [
          { id: 'chai', label: '🍵 5-Min Chai/Coffee Break', done: false },
          { id: 'balcony', label: '🚶‍♂️ Balcony Walk aur Taazi Hawa', done: false },
          { id: 'stretch', label: '🙆‍♂️ Full Body Stretch', done: false },
          { id: 'eyes', label: '👀 Eyes ko rest do (20-20-20 rule)', done: false }
        ];
      case 'ta':
        return [
          { id: 'chai', label: '🍵 5-நிமிட டீ/காபி இடைவேளை', done: false },
          { id: 'balcony', label: '🚶‍♂️ பால்கனி நடை & காற்று', done: false },
          { id: 'stretch', label: '🙆‍♂️ முழு உடல் தளர்வு பயிற்சி', done: false },
          { id: 'eyes', label: '👀 கண்களுக்கு ஓய்வு (20-20-20 விதி)', done: false }
        ];
      default:
        return [
          { id: 'chai', label: '🍵 5-Min Chai/Coffee Break', done: false },
          { id: 'balcony', label: '🚶‍♂️ Balcony Walk & Air', done: false },
          { id: 'stretch', label: '🙆‍♂️ Full Body Stretch', done: false },
          { id: 'eyes', label: '👀 Rest eyes (20-20-20 rule)', done: false }
        ];
    }
  };

  const [quickBreaks, setQuickBreaks] = useState(getLocalizedBreaks());

  // Re-localize breaks when language change occurs
  useEffect(() => {
    setQuickBreaks(getLocalizedBreaks());
  }, [lang]);

  useEffect(() => {
    // Pick a random quote on load
    const idx = Math.floor(Math.random() * MOCK_QUOTES.length);
    setQuote(MOCK_QUOTES[idx]);
  }, []);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('mindspace_mood', mood);
    
    // Map mood string to 1-10 score
    const moodScores = {
      Motivated: 10,
      Calm: 8,
      Anxious: 4,
      Overwhelmed: 3,
      Exhausted: 2
    };
    const score = moodScores[mood] || 5;

    // Log to local SQLite-backed MCP server
    try {
      const mcpUrl = import.meta.env.VITE_MCP_URL || 'http://localhost:8000';
      await fetch(`${mcpUrl}/log_journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Quick check-in: ${mood}`,
          mood_score: score,
          timestamp: new Date().toISOString()
        })
      });
      window.dispatchEvent(new Event('mcp_mood_updated'));
    } catch (err) {
      console.error('Failed to log mood check-in to MCP:', err);
    }
    
    // Add to streak if mood checked in today
    const lastCheckin = localStorage.getItem('mindspace_last_checkin');
    const today = new Date().toDateString();
    if (lastCheckin !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('mindspace_streak', newStreak.toString());
      localStorage.setItem('mindspace_last_checkin', today);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleToggleBreak = (id) => {
    setQuickBreaks(quickBreaks.map(b => {
      if (b.id === id) {
        const nextDone = !b.done;
        if (nextDone) {
          const nextStreak = streak + 1;
          setStreak(nextStreak);
          localStorage.setItem('mindspace_streak', nextStreak.toString());
          window.dispatchEvent(new Event('storage'));
        }
        return { ...b, done: nextDone };
      }
      return b;
    }));
  };

  const getMoodResponse = (mood) => {
    if (lang === 'hi') {
      switch (mood) {
        case 'Calm': return "बहुत बढ़िया! इस मानसिक स्पष्टता का लाभ उठाएं। आज अपने सबसे कठिन विषय या प्रश्न को हल करें।";
        case 'Anxious': return "घबराहट महसूस होना पूरी तरह से सामान्य है। एक कदम पीछे लें। कोई भी एक छोटा सूत्र या परिभाषा अभी दोहरा लें।";
        case 'Exhausted': return "आपका दिमाग थक गया है। जबरदस्ती न करें। 20 मिनट की झपकी लें या बस आँखें बंद करके संगीत सुनें।";
        case 'Overwhelmed': return "पाठ्यक्रम पहाड़ जैसा लग रहा है? इसे छोटे हिस्सों में बांटें। पूरी किताब छोड़ें—केवल एक पृष्ठ पर ध्यान केंद्रित करें।";
        case 'Motivated': return "जोश बना हुआ है! तीन उच्च-प्राथमिकता वाले प्रश्न लिखें और उन्हें तुरंत हल करें।";
        default: return "अपने मूड के अनुसार शांत वातावरण बनाएं।";
      }
    } else if (lang === 'hinglish') {
      switch (mood) {
        case 'Calm': return "Superb! Abhi focus ekdum clear hai. Sabse tough chapter ya numericals ko abhi nipta dalo.";
        case 'Anxious': return "Anxiety hona bilkul normal hai, tension mat lo. Take a break. Ek baar koi formula ya theory review kar lo.";
        case 'Exhausted': return "Dimaag full charge se down hai. Padhna band karo. 20-min ki power nap lo ya relax karo.";
        case 'Overwhelmed': return "Syllabus ki pahaad dikh rahi hai? Pure syllabus ko chhoro, abhi bas ek topic ya ek page par focus karo.";
        case 'Motivated': return "Full power energy hai! Jo 3 critical numericals hain unhe solve karo jab tak motivation active hai.";
        default: return "Ambient environment set karne ke liye mood check-in karein.";
      }
    } else if (lang === 'ta') {
      switch (mood) {
        case 'Calm': return "அருமை! இந்த மன அமைதியைப் பயன்படுத்தி, கடினமான பாடங்களை இன்று படியுங்கள்.";
        case 'Anxious': return "பதற்றம் ஏற்படுவது முற்றிலும் இயல்பானது. அமைதியாக இருங்கள். ஒரு எளிய சூத்திரத்தை மட்டும் இப்போது திருப்புதல் செய்யுங்கள்.";
        case 'Exhausted': return "மூளை சோர்வடைந்துள்ளது. கட்டாயப்படுத்த வேண்டாம். 20 நிமிடம் ஓய்வெடுக்கவும் அல்லது மெல்லிய இசை கேட்கவும்.";
        case 'Overwhelmed': return "பாடங்கள் மலை போலத் தோன்றுகிறதா? முழுவதையும் நினைக்காமல், ஒரு பகுதியை மட்டும் இப்போது படியுங்கள்.";
        case 'Motivated': return "முழு உத்வேகத்துடன் இருக்கிறீர்கள்! முக்கியமான கேள்விகளைத் தேர்ந்தெடுத்து இப்போது படித்து விடுங்கள்.";
        default: return "உங்கள் மனநிலையை பகிர்ந்து கொள்ளுங்கள்.";
      }
    } else {
      switch (mood) {
        case 'Calm': return "Awesome! Capitalize on this mental clarity. Tackle your hardest topic or numerical today.";
        case 'Anxious': return "It's completely okay to feel anxious. Take a step back. What is one small concept or formula you can review right now?";
        case 'Exhausted': return "Your brain is full. Stop forcing it. Take a 20-minute power nap or just close your eyes and listen to a song.";
        case 'Overwhelmed': return "Syllabus looking like a mountain? Let's break it down. Ignore the whole book—focus on just one paragraph or page.";
        case 'Motivated': return "Riding the wave! Write down three high-priority questions and smash them while the energy lasts.";
        default: return "Check in with your mood today to customize your ambient wellness environment.";
      }
    }
  };

  // Localized static tips
  const getLocalizedTips = () => {
    switch (lang) {
      case 'hi':
        return [
          { title: "50-10 पोमोडोरो नियम", desc: "50 मिनट पढ़ाई करें, 10 मिनट टहलें। ब्रेक के दौरान सोशल मीडिया से दूर रहें।" },
          { title: "गलतियों की कॉपी", desc: "कैलकुलेशन या सिली मिस्टेक्स के लिए एक अलग रजिस्टर बनाएं। टेस्ट से पहले इसे देखें।" },
          { title: "7 घंटे की नींद", desc: "कम सोना याददाश्त को कमजोर करता है। परीक्षा या टेस्ट से पहले पूरी नींद लें।" }
        ];
      case 'hinglish':
        return [
          { title: "50-10 Pomodoro Rule", desc: "50 mins padho, 10 mins walk karo. Breaks me phone ya Instagram bilkul block rakho." },
          { title: "Mistake Book", desc: "Silly calculation errors aur conceptual doubts ke liye alag se copy banao, aur revision me padho." },
          { title: "7-Hour Sleep Rule", desc: "Neend me compromise mat karo. Proper sleep se retention badhti hai." }
        ];
      case 'ta':
        return [
          { title: "50-10 போமோடோரோ விதி", desc: "50 நிமிடங்கள் படியுங்கள், 10 நிமிடங்கள் நடங்கள். இடைவேளையில் போன் பயன்படுத்த வேண்டாம்." },
          { title: "தவறு பதிவு நோட்டு", desc: "நீங்கள் செய்யும் கணக்கீட்டு பிழைகளை ஒரு நோட்டில் எழுதி வைத்து திருப்புதல் செய்யவும்." },
          { title: "7 மணிநேர தூக்கம்", desc: "குறைவான தூக்கம் ஞாபக சக்தியைக் குறைக்கும். தேர்வுக்கு முன் நன்றாகத் தூங்குங்கள்." }
        ];
      default:
        return [
          { title: "The 50-10 Pomodoro Rule", desc: "Study for 50 mins, walk for 10. No phones allowed during the break." },
          { title: "The Mistake Book (Errors Copy)", desc: "Maintain a copy specifically for silly calculation or conceptual errors." },
          { title: "The 7-Hour Sleep Standard", desc: "Lack of sleep kills retention. Prioritize sleep, especially before mock tests." }
        ];
    }
  };

  return (
    <div className="dashboard-grid tab-pane" id="hero-section">
      <div className="dashboard-main">
        {/* Welcome Section */}
        <div className="glass-panel" id="welcome-panel" style={{ 
          background: 'linear-gradient(135deg, rgba(157, 129, 137, 0.08) 0%, rgba(144, 219, 244, 0.08) 100%)',
          borderLeft: '4px solid var(--secondary)'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
            {getTranslationText(lang, 'welcomeTitle', { name: profile.name || 'Friend' })}
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontWeight: 300 }}>
            {getTranslationText(lang, 'welcomeDesc', { 
              exam: profile.exam, 
              subjects: profile.subjects || (lang === 'hi' ? 'सामान्य पाठ्यक्रम' : lang === 'ta' ? 'அனைத்து பாடங்கள்' : 'General subjects') 
            })}
          </p>
        </div>

        {/* Daily Quote */}
        <div className="glass-panel quote-card" id="quote-panel">
          <p className="quote-text">{quote.text}</p>
          <div className="quote-author">— {quote.author}</div>
        </div>

        {/* Mood Checkin */}
        <div className="glass-panel mood-panel" id="mood-checkin-panel">
          <h3 className="mood-title" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            {getTranslationText(lang, 'headspaceTitle')}
          </h3>
          <div className="mood-options">
            {[
              { label: 'Calm', emoji: '😌', translation: lang === 'hi' ? 'शांत' : lang === 'ta' ? 'அமைதி' : 'Calm' },
              { label: 'Anxious', emoji: '😰', translation: lang === 'hi' ? 'घबराया हुआ' : lang === 'ta' ? 'பதற்றம்' : 'Anxious' },
              { label: 'Exhausted', emoji: '🥱', translation: lang === 'hi' ? 'थका हुआ' : lang === 'ta' ? 'சோர்வு' : 'Exhausted' },
              { label: 'Overwhelmed', emoji: '🤯', translation: lang === 'hi' ? 'अति-व्यस्त' : lang === 'ta' ? 'அழுத்தம்' : 'Overwhelmed' },
              { label: 'Motivated', emoji: '🔥', translation: lang === 'hi' ? 'प्रेरित' : lang === 'ta' ? 'உத்வேகம்' : 'Motivated' }
            ].map((m) => (
              <button
                key={m.label}
                className={`mood-card ${selectedMood === m.label ? 'active' : ''}`}
                onClick={() => handleMoodSelect(m.label)}
                id={`mood-btn-${m.label.toLowerCase()}`}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.translation}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <p style={{ 
              marginTop: '16px', 
              padding: '14px', 
              background: 'rgba(144, 219, 244, 0.04)', 
              borderRadius: '10px',
              borderLeft: '3px solid var(--secondary)',
              fontSize: '0.9rem',
              lineHeight: '1.5'
            }} id="mood-response-text">
              ✨ {getMoodResponse(selectedMood)}
            </p>
          )}
        </div>

        {/* Mood Timeline Visualization */}
        <div className="glass-panel mood-timeline-card" id="mood-timeline-panel" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 {lang === 'hi' ? 'मनोदशा समयरेखा' : lang === 'ta' ? 'மனநிலை காலவரிசை' : lang === 'hinglish' ? 'Mood Timeline' : 'Mood Timeline'}
                <span style={{ 
                  fontSize: '0.7rem', 
                  padding: '3px 8px', 
                  borderRadius: '12px', 
                  fontWeight: 500,
                  background: mcpStatus === 'connected' ? 'rgba(107, 167, 131, 0.12)' : 'rgba(213, 137, 124, 0.12)',
                  color: mcpStatus === 'connected' ? 'var(--success)' : 'var(--accent-warm)',
                  border: mcpStatus === 'connected' ? '1px solid rgba(107, 167, 131, 0.3)' : '1px solid rgba(213, 137, 124, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: mcpStatus === 'connected' ? 'var(--success)' : 'var(--accent-warm)',
                    display: 'inline-block'
                  }}></span>
                  {mcpStatus === 'connected' ? 'MCP SQLite Live' : 'Local Sandbox'}
                </span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 300 }}>
                {lang === 'hi' ? 'समय के साथ अपने मूड के रुझान को ट्रैक करें' : lang === 'ta' ? 'உங்கள் மனநிலை மாற்றங்களை கண்காணிக்கவும்' : lang === 'hinglish' ? 'Apne mood trends ko track karein' : 'Track your emotional patterns and preparation stress'}
              </p>
            </div>
            
            {/* Days Toggle Buttons */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(125, 107, 130, 0.05)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(125, 107, 130, 0.1)' }}>
              {[7, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setDaysRange(days)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: daysRange === days ? 'var(--primary)' : 'transparent',
                    color: daysRange === days ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {days} {lang === 'hi' ? 'दिन' : lang === 'ta' ? 'நாட்கள்' : lang === 'hinglish' ? 'Days' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart Container */}
          <div style={{ position: 'relative', width: '100%', minHeight: '180px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.4)', padding: '10px', overflow: 'visible' }}>
            {moodHistory.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '160px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-muted)' }}>bar_chart</span>
                {lang === 'hi' ? 'कोई मनोदशा डेटा उपलब्ध नहीं है।' : lang === 'ta' ? 'மனநிலை தரவு எதுவும் இல்லை' : 'No mood logs available yet. Check in above or write in your journal!'}
              </div>
            ) : (
              <MoodChartSVG moodHistory={moodHistory} />
            )}
          </div>
        </div>

        {/* 5-Min Recharge Breaks */}
        <div className="glass-panel" id="daily-tools">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
            {getTranslationText(lang, 'rechargeBreaksTitle')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '14px', fontWeight: 300 }}>
            {getTranslationText(lang, 'rechargeBreaksDesc')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {quickBreaks.map((b) => (
              <button
                key={b.id}
                onClick={() => handleToggleBreak(b.id)}
                className="glass-button"
                style={{
                  justifyContent: 'flex-start',
                  fontSize: '0.85rem',
                  padding: '12px 16px',
                  background: b.done ? 'rgba(183, 228, 199, 0.08)' : 'var(--glass-bg)',
                  borderColor: b.done ? 'var(--success)' : 'var(--glass-border)',
                  color: b.done ? 'var(--success)' : 'var(--text-primary)'
                }}
              >
                <span style={{ textDecoration: b.done ? 'line-through' : 'none' }}>
                  {b.label} {b.done && '✅'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-sidebar">
        {/* Streak & Stats */}
        <div className="glass-panel" style={{ textAlign: 'center' }} id="stats-panel">
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {getTranslationText(lang, 'streakTitle')}
          </h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-warm)', filter: 'drop-shadow(0 0 10px var(--accent-glow))' }}>
            {streak} 🔥
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 300 }}>
            {getTranslationText(lang, 'streakDesc')}
          </p>
        </div>

        {/* Small 10-Minute Actions */}
        <div className="glass-panel mini-tasks-card" id="mini-actions-panel">
          <h3>{getTranslationText(lang, 'rechargeTitle')}</h3>
          <div className="mini-tasks-list">
            {tasks.map((t) => (
              <label 
                key={t.id} 
                className={`mini-task-item ${t.completed ? 'completed' : ''}`}
              >
                <input
                  type="checkbox"
                  className="mini-task-checkbox"
                  checked={t.completed}
                  onChange={() => onToggleTask(t.id)}
                />
                <span className="mini-task-text">{t.text}</span>
              </label>
            ))}
          </div>
          <button 
            className="glass-button active" 
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            onClick={() => onSelectTab('mindfulness')}
            id="start-exercise-dashboard-btn"
          >
            {lang === 'hi' ? 'ध्यान साधना कक्ष में जाएं 🧘‍♀️' : lang === 'ta' ? 'தியான அறைக்குச் செல் 🧘‍♀️' : 'Go to Mindfulness Studio 🧘‍♀️'}
          </button>
        </div>

        {/* Resources Panel */}
        <div className="glass-panel resources-card" id="quick-tips-panel">
          <h3>{getTranslationText(lang, 'survivalKitTitle')}</h3>
          <div className="resources-list" style={{ marginTop: '12px' }}>
            {getLocalizedTips().map((tip, idx) => (
              <div key={idx} className="resource-card">
                <span className="resource-icon">{idx === 0 ? '⏱️' : idx === 1 ? '📝' : '🛌'}</span>
                <div className="resource-info">
                  <span className="resource-title">{tip.title}</span>
                  <span className="resource-desc">{tip.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MoodChartSVG({ moodHistory }) {
  const [hoveredIdx, setHoveredIdx] = React.useState(null);

  // Layout parameters
  const width = 500;
  const height = 180;
  const top = 15;
  const bottom = 30;
  const left = 75; // Extra padding for horizontal text labels
  const right = 20;
  
  const usableWidth = width - left - right;
  const usableHeight = height - top - bottom;

  // 1. Sort chronological (oldest first)
  const sortedHistory = [...moodHistory]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // 2. Generate points
  const points = sortedHistory.map((p, idx) => {
    const score = p.mood_score || 5;
    const x = left + (idx * usableWidth) / Math.max(1, sortedHistory.length - 1);
    const y = top + usableHeight - ((score - 1) * usableHeight) / 9; // score 1 to 10
    return { 
      x, 
      y, 
      score, 
      date: new Date(p.timestamp),
      text: p.text || ''
    };
  });

  // 3. Line and Area paths
  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${top + usableHeight} L ${points[0].x} ${top + usableHeight} Z` 
    : '';

  // 4. Grid lines values
  // Reference levels (scores: 10, 8, 5, 2)
  const gridLevels = [
    { score: 10, label: 'Motivated 🔥' },
    { score: 8, label: 'Calm 😌' },
    { score: 5, label: 'Neutral 😐' },
    { score: 2, label: 'Exhausted 🥱' }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        width="100%" 
        height="100%" 
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          {/* Smooth linear gradient for filled area */}
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y-Axis Grid Lines & Labels */}
        {gridLevels.map((lvl) => {
          const y = top + usableHeight - ((lvl.score - 1) * usableHeight) / 9;
          return (
            <g key={lvl.score}>
              <line 
                x1={left} 
                y1={y} 
                x2={width - right} 
                y2={y} 
                stroke="rgba(125, 107, 130, 0.08)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={left - 8} 
                y={y + 4} 
                textAnchor="end" 
                style={{ fontSize: '0.65rem', fill: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}
              >
                {lvl.label}
              </text>
            </g>
          );
        })}

        {/* Gradient Area under the line */}
        {areaD && (
          <path d={areaD} fill="url(#chart-gradient)" />
        )}

        {/* Main Line path */}
        {pathD && (
          <path 
            d={pathD} 
            fill="none" 
            stroke="var(--secondary)" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0px 2px 4px rgba(74, 144, 164, 0.25))' }}
          />
        )}

        {/* X-Axis labels (dates) */}
        {points.map((p, idx) => {
          // Render label only for key points to prevent overlap
          const shouldShowLabel = 
            points.length <= 7 || 
            idx === 0 || 
            idx === points.length - 1 || 
            (points.length > 7 && points.length <= 15 && idx % 3 === 0) ||
            (points.length > 15 && idx % 6 === 0);

          if (!shouldShowLabel) return null;

          return (
            <text 
              key={idx}
              x={p.x} 
              y={height - 8} 
              textAnchor="middle" 
              style={{ fontSize: '0.6rem', fill: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}
            >
              {p.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          );
        })}

        {/* Interactive Data points */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g key={idx}>
              {/* Visible small marker dot */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={isHovered ? 5.5 : 3.5} 
                fill={isHovered ? 'var(--accent-warm)' : 'var(--secondary)'} 
                stroke="var(--bg-deep)" 
                strokeWidth={isHovered ? 2 : 1.5}
                style={{ transition: 'all 0.15s ease' }}
              />
              
              {/* Transparent larger hover trigger target for easy finger taps / mouse hovers */}
              <circle 
                cx={p.x} 
                cy={p.y} 
                r={12} 
                fill="transparent" 
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML Tooltip (absolute positioned relative to chart wrapper) */}
      {hoveredIdx !== null && points[hoveredIdx] && (
        <div style={{
          position: 'absolute',
          left: `${Math.max(10, Math.min(width - 160, points[hoveredIdx].x - 75))}px`,
          top: `${Math.max(0, points[hoveredIdx].y - 85)}px`,
          width: '150px',
          padding: '8px 10px',
          borderRadius: '10px',
          fontSize: '0.75rem',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(125, 107, 130, 0.2)',
          boxShadow: '0 4px 16px rgba(125, 107, 130, 0.12)',
          pointerEvents: 'none',
          color: 'var(--text-primary)',
          transition: 'top 0.15s ease, left 0.15s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: '4px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '2px' }}>
            <span>Score: {points[hoveredIdx].score}/10</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
              {points[hoveredIdx].date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.3, wordBreak: 'break-word' }}>
            "{points[hoveredIdx].text.length > 50 ? points[hoveredIdx].text.substring(0, 47) + '...' : points[hoveredIdx].text || 'Mood check-in'}"
          </div>
        </div>
      )}
    </div>
  );
}
