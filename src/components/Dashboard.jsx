import React, { useState, useEffect } from 'react';
import { MOCK_QUOTES } from '../utils/mockData';
import { getTranslationText } from '../utils/translations';

export default function Dashboard({ profile, onSelectTab, tasks, onToggleTask }) {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [selectedMood, setSelectedMood] = useState(localStorage.getItem('mindspace_mood') || '');
  const [streak, setStreak] = useState(parseInt(localStorage.getItem('mindspace_streak') || '3', 10));

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

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('mindspace_mood', mood);
    
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
