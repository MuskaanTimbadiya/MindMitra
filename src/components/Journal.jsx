import React, { useState } from 'react';
import { analyzeJournalEntry } from '../utils/gemini';
import SafetyCard from './SafetyCard';

export default function Journal({ profile, onAddCustomAction }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [criticalAlert, setCriticalAlert] = useState(false);

  const lang = profile?.language || 'en';

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setCriticalAlert(false);
    
    const result = await analyzeJournalEntry(text, {
      name: profile.name,
      exam: profile.exam,
      subjects: profile.subjects,
      language: profile.language // Now passing preferred language to Gemini
    });

    setLoading(false);
    if (result) {
      setAnalysis(result);
      if (result.isCritical) {
        setCriticalAlert(true);
      }

      // Sync to local SQLite-backed MCP server
      try {
        const mcpUrl = import.meta.env.VITE_MCP_URL || 'http://localhost:8000';
        await fetch(`${mcpUrl}/log_journal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            text: text,
            mood_score: result.moodScore || 6,
            timestamp: new Date().toISOString()
          })
        });
        window.dispatchEvent(new Event('mcp_mood_updated'));
      } catch (err) {
        console.error('Failed to log journal entry to MCP:', err);
      }
    }
  };

  const handleClear = () => {
    setText('');
    setAnalysis(null);
    setCriticalAlert(false);
  };

  const handleAddToDashboard = () => {
    if (analysis && analysis.tenMinuteAction) {
      onAddCustomAction(analysis.tenMinuteAction);
      alert(
        lang === 'hi' ? "डैशबोर्ड पर रिचार्ज गतिविधियों में जोड़ दिया गया है!" : 
        lang === 'ta' ? "உற்சாகப் பயிற்சிகளில் சேர்க்கப்பட்டது!" : 
        lang === 'hinglish' ? "Dashboard Recharge Actions me add ho gaya hai!" :
        "Added to your Recharge Actions on the Dashboard!"
      );
    }
  };

  // Localized suggestion prompts
  const getSuggestionPrompts = () => {
    switch (lang) {
      case 'hi':
        return [
          "आज मॉक टेस्ट का स्कोर बहुत कम आया, काफी निराशा हो रही है...",
          "ऑर्गेनिक केमिस्ट्री के रिएक्शन याद नहीं हो रहे, बहुत उलझन है...",
          "लगता है कि मैं अपने माता-पिता की उम्मीदों पर खरा नहीं उतर पाऊंगा...",
          "बहुत थक चुका हूँ। अब और फिजिक्स पढ़ना मुमकिन नहीं लग रहा..."
        ];
      case 'hinglish':
        return [
          "Aaj mock test ka score kharab aaya, bohot demotivate feel ho raha hai...",
          "Organic Chemistry ke reaction pathways yaad nahi ho rahe...",
          "Aisa lagta hai parents ke expectations mujhse meet nahi ho payenge...",
          "Bohot exhaust ho chuka hu. Ab aur Physics nahi padha jayega..."
        ];
      case 'ta':
        return [
          "இன்று மாதிரித் தேர்வு மதிப்பெண் குறைவாக வந்தது, மிகவும் சோர்வாக இருக்கிறது...",
          "வேதியியல் சமன்பாடுகள் நினைவில் இல்லை, மிகவும் குழப்பமாக இருக்கிறது...",
          "பெற்றோரின் எதிர்பார்ப்புகளை என்னால் பூர்த்தி செய்ய முடியுமா என பயமாக உள்ளது...",
          "மிகவும் சோர்வாக இருக்கிறது. இனி இயற்பியல் படிக்க முடியாது என தோன்றுகிறது..."
        ];
      default:
        return [
          "Today's mock test score was demotivating...",
          "Struggling to understand organic naming reactions...",
          "I feel like I'm letting my parents down...",
          "Burned out. Can't study physics anymore today..."
        ];
    }
  };

  // Localized UI strings
  const strings = {
    title: lang === 'hi' ? 'अपने मानसिक स्वास्थ्य का विश्लेषण करें' : lang === 'ta' ? 'உங்கள் மனநிலையை அறியுங்கள்' : lang === 'hinglish' ? 'Apne Headspace ko Analyze karein' : 'Analyze Your Headspace',
    desc: lang === 'hi' ? 'अपने विचार यहाँ लिखें। मॉक टेस्ट के मार्क्स, किसी विषय के डर, या दोस्तों के दबाव के बारे में बात करें। हमारा एआई आपके तनाव के कारणों को समझेगा और बड़ी दीदी/भैया की तरह सलाह देगा।' :
          lang === 'ta' ? 'உங்கள் எண்ணங்களை இங்கே எழுதுங்கள். மாதிரித் தேர்வுகள், கடினமான பாடங்கள் அல்லது நண்பர்களின் ஒப்பீடுகளைப் பற்றிப் பகிர்ந்து கொள்ளுங்கள். எங்கள் AI உங்கள் கவலைகளைப் பகுப்பாய்வு செய்து உங்களை உற்சாகப்படுத்தும்.' :
          lang === 'hinglish' ? 'Apne thoughts yahan likho. Mock test scores, tough subjects, ya doston ke pressure ke bare me vent karo. Humara AI aapke stress triggers ko analyze karke bade bhai/didi jaisi advice dega.' :
          'Pour your thoughts out. Vent about mock tests, subjects you are stuck on, or peer pressure. Our AI analyzes your stress triggers and gives you specific older-sibling advice.',
    placeholder: lang === 'hi' ? 'जैसे, आज मैंने मॉक टेस्ट दिया। मेरी रैंक गिर गई। शर्मा जी के बेटे के 99 परसेंटाइल आए हैं, मुझे लगता है मैं बहुत पीछे हूँ। ऑर्गेनिक केमिस्ट्री बहुत कठिन लग रही है...' :
                 lang === 'ta' ? 'உதாரணமாக, மாதிரித் தேர்வு எழுதினேன். மதிப்பெண் குறைந்துவிட்டது. என் தோழன் என்னை விட அதிக மதிப்பெண் பெற்றுள்ளான், நான் பின்தங்கி விட்டதாக உணர்கிறேன்...' :
                 lang === 'hinglish' ? 'E.g., Aaj mock test me rank down ho gayi. Mere friend ke 99 percentile aaye aur mujhe lag raha hai mai peeche reh gaya. Organic chemistry bohot confused lag rahi hai...' :
                 'E.g., I\'m writing this after mock test 4. My rank went down. My friend got 99 percentile and I feel like I\'m lagging behind. Organic Chemistry is extremely confusing and I can\'t remember reaction pathways...',
    btnClear: lang === 'hi' ? 'साफ करें' : lang === 'ta' ? 'அழி' : lang === 'hinglish' ? 'Clear' : 'Clear',
    btnAnalyze: lang === 'hi' ? 'मन की बात का विश्लेषण ✨' : lang === 'ta' ? 'பகுப்பாய்வு செய் ✨' : lang === 'hinglish' ? 'Analyze Headspace ✨' : 'Analyze Headspace ✨',
    loading: lang === 'hi' ? 'संकेतों का विश्लेषण किया जा रहा है, बड़ी दीदी/भैया की सलाह तैयार हो रही है...' :
             lang === 'ta' ? 'மன அழுத்த காரணிகள் பகுப்பாய்வு செய்யப்படுகிறது, மூத்த சகோதரர் அறிவுரை தயாராகிறது...' :
             lang === 'hinglish' ? 'Triggers analyze ho rahe hain, Bade Bhai/Didi ki advice ready ho rahi hai...' :
             'Analyzing triggers, cooking sibling advice...',
    summaryTitle: lang === 'hi' ? 'मन की बात सारांश' : lang === 'ta' ? 'மனநிலை பகுப்பாய்வுச் சுருக்கம்' : lang === 'hinglish' ? 'Vibe Check Summary' : 'Vibe Check Summary',
    triggerPill: lang === 'hi' ? 'तनाव का कारण' : lang === 'ta' ? 'மன அழுத்த காரணி' : lang === 'hinglish' ? 'Stress Trigger' : 'Stress Trigger',
    patternPill: lang === 'hi' ? 'मानसिक पैटर्न' : lang === 'ta' ? 'மனநிலைப் போக்கு' : lang === 'hinglish' ? 'Pattern' : 'Pattern',
    siblingCard: lang === 'hi' ? 'बड़ी दीदी / भैया का नजरिया 🤝' : lang === 'ta' ? 'மூத்த சகோதரர் பார்வை 🤝' : lang === 'hinglish' ? 'Bhaiya / Didi Ka Perspective 🤝' : 'Older Sibling Perspective 🤝',
    copingCard: lang === 'hi' ? 'विशेष अध्ययन रणनीति 🎯' : lang === 'ta' ? 'படிப்பு உத்திகள் 🎯' : lang === 'hinglish' ? 'Targeted Study Coping 🎯' : 'Targeted Study Coping 🎯',
    suggestPill: lang === 'hi' ? 'सलाह' : lang === 'ta' ? 'பரிந்துரை' : lang === 'hinglish' ? 'Try' : 'Try',
    actionTitle: lang === 'hi' ? 'आपका 10-मिनट का एक्शन प्लान ⚡' : lang === 'ta' ? '10-நிமிட செயல் திட்டம் ⚡' : lang === 'hinglish' ? 'Apka 10-Minute Action Plan ⚡' : 'Your 10-Minute Action Plan ⚡',
    btnAddToDashboard: lang === 'hi' ? 'डैशबोर्ड गतिविधियों में जोड़ें 📋' : lang === 'ta' ? 'உற்சாகப் பயிற்சிகளில் சேர் 📋' : lang === 'hinglish' ? 'Dashboard Actions me add karein 📋' : 'Add to Dashboard Actions 📋'
  };

  return (
    <div className="tab-pane" id="journal-pane">
      <div className="glass-panel journal-editor-wrapper">
        <h2 style={{ marginBottom: '4px' }}>{strings.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px', fontWeight: 300 }}>
          {strings.desc}
        </p>

        {/* Suggestion Prompts */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {getSuggestionPrompts().map((promptText) => (
            <button
              key={promptText}
              className="glass-button"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
              onClick={() => setText(promptText)}
            >
              {promptText}
            </button>
          ))}
        </div>

        <textarea
          className="glass-textarea journal-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={strings.placeholder}
          id="journal-input-textarea"
        />

        <div className="journal-actions">
          <button 
            className="glass-button" 
            onClick={handleClear}
            disabled={loading || !text}
            id="clear-journal-btn"
          >
            {strings.btnClear}
          </button>
          
          <button 
            className="glass-button active" 
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            id="analyze-journal-btn"
            style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--bg-deep)' }}
          >
            {loading ? strings.loading.split('...')[0] + '...' : strings.btnAnalyze}
          </button>
        </div>
      </div>

      {loading && (
        <div className="spinner-wrapper" id="journal-loading-spinner">
          <div className="spinner"></div>
          <span className="loading-text">{strings.loading}</span>
        </div>
      )}

      {criticalAlert && <SafetyCard profile={profile} />}

      {analysis && !loading && (
        <div className="analysis-results" id="journal-analysis-results">
          {/* Tags / Badges */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{strings.summaryTitle}</h3>
            <div className="pill-container">
              {analysis.stressTriggers && (
                <span className="pill trigger">🎯 {strings.triggerPill}: {analysis.stressTriggers}</span>
              )}
              {analysis.emotionalPatterns && (
                <span className="pill pattern">🧠 {strings.patternPill}: {analysis.emotionalPatterns}</span>
              )}
            </div>
          </div>

          <div className="analysis-grid">
            {/* Sibling Advice Card */}
            <div className="analysis-card advice-card" id="sibling-advice-card">
              <h4 className="analysis-card-title">{strings.siblingCard}</h4>
              <p className="analysis-card-text">{analysis.siblingAdvice}</p>
            </div>

            {/* Personalized Coping Strategy */}
            <div className="analysis-card coping-card" id="coping-strategy-card">
              <h4 className="analysis-card-title">{strings.copingCard}</h4>
              <p className="analysis-card-text">{analysis.personalizedCoping}</p>
              {analysis.mindfulnessExercise && (
                <p className="analysis-card-text" style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>
                  💡 {strings.suggestPill}: {analysis.mindfulnessExercise}
                </p>
              )}
            </div>
          </div>

          {/* Action Card */}
          {analysis.tenMinuteAction && (
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-warm)' }} id="ten-minute-action-card">
              <h4 className="analysis-card-title" style={{ color: 'var(--accent-warm)' }}>{strings.actionTitle}</h4>
              <p className="analysis-card-text" style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '16px' }}>
                {analysis.tenMinuteAction}
              </p>
              <button 
                className="glass-button active"
                onClick={handleAddToDashboard}
                id="add-to-dashboard-action-btn"
                style={{ background: 'var(--accent-warm)', borderColor: 'var(--accent-warm)', color: 'var(--bg-deep)', boxShadow: '0 0 15px var(--accent-glow)' }}
              >
                {strings.btnAddToDashboard}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
