import React, { useState, useEffect, useRef } from 'react';
import { getTranslationText } from '../utils/translations';

export default function Mindfulness({ profile }) {
  const [activeMode, setActiveMode] = useState('breathing');

  const lang = profile?.language || 'en';

  // Box Breathing State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathStage, setBreathStage] = useState(0); // 0: Inhale, 1: Hold Full, 2: Exhale, 3: Hold Empty
  const [secondsLeft, setSecondsLeft] = useState(4);
  const intervalRef = useRef(null);

  // Multilingual PMR Steps
  const getPmrSteps = () => {
    switch (lang) {
      case 'hi':
        return [
          { title: "चेहरा और जबड़ा", desc: "आँखें कसकर बंद करें, नाक सिकोड़ें, और जबड़ा भींचें। 5 सेकंड तनाव बनाए रखें... अब पूरी तरह ढीला छोड़ें। चेहरे की मांसपेशियों में आती गर्माहट और विश्राम को महसूस करें।" },
          { title: "कंधे और गर्दन", desc: "कंधों को ऊपर कानों तक उठाएं, गर्दन को सिकोड़ें। 5 सेकंड होल्ड करें... अब कंधों को नीचे गिरने दें। गर्दन से जैसे सारा बोझ उतर गया हो, महसूस करें।" },
          { title: "हाथ और बाहें", desc: "दोनों मुट्ठियाँ कसकर बंद करें, फोरआर्म्स और बाइसेप्स में खिंचाव लाएं। 5 सेकंड होल्ड करें... मुट्ठी खोलें। गोद में उँगलियों को ढीला छोड़ते हुए आराम महसूस करें।" },
          { title: "पैर और पंजे", desc: "पंजों को नीचे की ओर खींचें, पिंडलियों और जांघों को तानें। 5 सेकंड होल्ड करें... छोड़ें। पैरों को जमीन पर भारी और शिथिल महसूस होने दें।" }
        ];
      case 'hinglish':
        return [
          { title: "Face & Jaw", desc: "Apni eyes tight band karo, naak sikodo, aur jaw ko tight squeeze karo. 5 seconds tak tight rakho... Aur ab ekdum release kar do. Face muscles me relief feel karo." },
          { title: "Shoulders & Neck", desc: "Apne shoulders ko kaan tak upar uthao aur neck ko tense karo. 5s hold karo... Aur ab shoulders drop kar do. Dekho neck se saara burden chala gaya." },
          { title: "Hands & Arms", desc: "Dono fists ko tightly band karo, arms aur biceps ko tight karo. 5 seconds tak hold karo... Ab release karo, fingers ko goad me bilkul loose chhod do." },
          { title: "Legs & Feet", desc: "Toes ko niche pull karo aur thighs/calves ko tight karo. 5s hold karo... Aur ab release kar do. Pairon ko zameen par heavy aur loose feel hone do." }
        ];
      case 'ta':
        return [
          { title: "முகம் மற்றும் தாடை", desc: "கண்களை இறுக்கமாக மூடி, தாடையை கடிக்கவும். 5 வினாடிகள் இந்த அழுத்தத்தை வைத்திருங்கள்... இப்போது முழுமையாக தளர்த்தவும். முகத் தசைகள் தளர்வடைவதை உணருங்கள்." },
          { title: "தோள்கள் மற்றும் கழுத்து", desc: "தோள்களை காதுகள் வரை உயர்த்தி, கழுத்தை இறுக்கவும். 5 வினாடிகள் அப்படியே வைத்திருங்கள்... பின் முழுமையாக கீழே இறக்கவும். கழுத்து பாரம் குறைவதை உணருங்கள்." },
          { title: "கைகள் மற்றும் தோள்கள்", desc: "இரு கைகளையும் இறுக்கமாக மூடி, முன்கைகளை இறுக்கவும். 5 வினாடிகள் பிடித்துக் கொள்ளுங்கள்... விரல்களை தளர்த்தி மடியில் வையுங்கள். நிம்மதியை உணருங்கள்." },
          { title: "கால்கள் மற்றும் பாதம்", desc: "விரல்களை கீழ்நோக்கி நீட்டி, கால்களை இறுக்கவும். 5 வினாடிகள் தசைப் பிடிப்பை வையுங்கள்... பின் விடுவிக்கவும். கால்கள் தரையில் தளர்வாக இருக்கட்டும்." }
        ];
      default:
        return [
          { title: "Face & Jaw", desc: "Squeeze your eyes shut, wrinkle your nose, and bite down gently. Tense for 5 seconds... Now, completely release. Feel the warmth spreading in your facial muscles." },
          { title: "Shoulders & Neck", desc: "Shrug your shoulders all the way up to your ears, tensing your neck. Hold tight for 5 seconds... Let them drop completely. Feel the load falling off your neck." },
          { title: "Hands & Arms", desc: "Clench both fists tightly, tensing your forearms and biceps. Hold the tension for 5 seconds... Release. Unfold your fingers on your lap and feel the relaxation flow." },
          { title: "Legs & Feet", desc: "Point your toes downward, tensing your calves, thighs, and feet. Hold for 5 seconds... Release. Let your legs sink heavily into the floor." }
        ];
    }
  };

  const [pmrStep, setPmrStep] = useState(0);
  const pmrSteps = getPmrSteps();

  // Re-sync steps on language change
  useEffect(() => {
    setPmrStep(0);
  }, [lang]);

  // Body Scan State
  const [scanActive, setScanActive] = useState(false);
  const [scanSection, setScanSection] = useState(0); // 0: Head, 1: Shoulders/Chest, 2: Core/Back, 3: Legs
  const [scanTimer, setScanTimer] = useState(15);
  const scanIntervalRef = useRef(null);

  const getScanSections = () => {
    switch (lang) {
      case 'hi':
        return [
          { title: "1. सिर और चेहरा", instructions: "आँखें बंद करें। अपना ध्यान सिर के ऊपरी हिस्से, माथे और आँखों पर लाएं। पलकों के पास की छोटी मांसपेशियों को ढीला छोड़ें। गणित के सूत्रों या सिलेबस की चिंताओं को अभी जाने दें।" },
          { title: "2. कंधे और रीढ़ की हड्डी", instructions: "अपनी बैठने की मुद्रा पर ध्यान दें। कंधों में साँस लें—वह जगह जो परीक्षाओं और माता-पिता की उम्मीदों का सारा बोझ उठाती है। उन्हें ढीला छोड़ें। रीढ़ की हड्डी से हवा को नीचे जाते महसूस करें।" },
          { title: "3. पेट और सीना", instructions: "ध्यान छाती और पेट पर लाएं। पेट में उठने वाली किसी भी घबराहट या तनाव को छोड़ें। गहरी साँस लें, पेट को बाहर फूलने दें। पूरी साँस बाहर छोड़ें।" },
          { title: "4. जमीन से जुड़ाव (Roots)", instructions: "कुर्सी पर अपनी जांघों को महसूस करें और पैर जमीन पर सपाट रखें। धरती के सहारे को महसूस करें। आप सुरक्षित हैं, शांत हैं, और आपकी पहचान आपकी परीक्षा के अंकों से अलग है।" }
        ];
      case 'hinglish':
        return [
          { title: "1. Crown & Face", instructions: "Eyes close karo. Apna focus forehead aur aankhon par leke aao. Eyelids ke paas ki muscles ko relax karo. Formulae aur syllabus ki stress ko thodi der ke liye bhool jao." },
          { title: "2. Shoulders & Spine", instructions: "Apne posture par dhyan do. Shoulders par saans lo—vo jagah jahan exams aur parental expectations ka heavy load hota hai. Unhe drop karo. Spine ke through relaxation ko feel karo." },
          { title: "3. Stomach & Core", instructions: "Focus apne chest aur stomach par lao. Stomach me jo anxiousness ya tension fill lag rahi hai use release karo. Dhire se saans lo, belly ko expand hone do." },
          { title: "4. Grounding", instructions: "Apne pairon ko floor par flat feel karo. Earth ke support ko feel karo. Aap safe ho, grounded ho, aur aapki value mock tests ke scores se bohot badhkar hai." }
        ];
      case 'ta':
        return [
          { title: "1. தலை மற்றும் முகம்", instructions: "கண்களை மூடுங்கள். உங்கள் கவனத்தை தலையின் உச்சி, நெற்றி மற்றும் கண்களுக்கு கொண்டு செல்லுங்கள். கண்ணிமை தசைகளை தளர்த்தவும். பாடத்திட்ட கவலைகளை இப்போதைக்கு மறந்து விடுங்கள்." },
          { title: "2. தோள்கள் மற்றும் முதுகுத் தண்டு", instructions: "உங்கள் தோள்களுக்குள் மூச்சை செலுத்துங்கள்—பெற்றோரின் எதிர்பார்ப்புகளையும் தேர்வு பாரத்தையும் சுமக்கும் இடம் அதுதான். தோள்களை தளர்த்துங்கள். தண்டுவடம் வழியே நிம்மதியை உணருங்கள்." },
          { title: "3. மார்பு மற்றும் வயிறு", instructions: "உங்கள் மார்பு மற்றும் வயிற்றில் கவனம் செலுத்துங்கள். வயிற்றில் இருக்கும் பய உணர்வை விடுவியுங்கள். மெதுவாக மூச்சை இழுத்து வயிறு விரிவடைவதை உணருங்கள்." },
          { title: "4. தரை தழுவல் மற்றும் பாதுகாப்பு", instructions: "கால்களை தரையில் பதிய வையுங்கள். இந்த பூமி உங்களுக்கு தரும் ஆதரவை உணருங்கள். நீங்கள் பாதுகாப்பாக இருக்கிறீர்கள், உங்கள் மதிப்பு தேர்வை விடப் பெரியது." }
        ];
      default:
        return [
          { title: "1. Crown & Face", instructions: "Close your eyes. Draw your awareness to the top of your head, your forehead, and your eyes. Relax the tiny muscles around your eyelids. Let go of any formulas or syllabus anxiety stored in your temples." },
          { title: "2. Shoulders & Spine", instructions: "Notice your posture. Breathe into your shoulders—the place that carries all the weight of mock tests and parental expectations. Let them drop. Feel the air moving down your back as you sit." },
          { title: "3. Solar Plexus & Core", instructions: "Bring focus to your chest and stomach. Release any physical tightness or 'knot in the stomach' feeling. Inhale slowly, letting your belly expand naturally. Exhale fully." },
          { title: "4. Roots & Grounding", instructions: "Feel your thighs on the chair and your feet flat on the floor. Acknowledge the earth supporting you right now. You are grounded, you are safe, and you are separate from your academic scores." }
        ];
    }
  };

  const scanSections = getScanSections();

  // Audio Engines (Synthesized Rain, Forest Wind, Alpha Binaural Hum)
  const audioCtxRef = useRef(null);
  const activeSourcesRef = useRef([]);
  const [activeSound, setActiveSound] = useState(''); // 'rain', 'wind', 'hum' or ''

  const stopAllSounds = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    setActiveSound('');
  };

  const playRain = (ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 750;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.22; // louder rain

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    source.start(0);
    activeSourcesRef.current.push(source);
    setActiveSound('rain');
  };

  const playWind = (ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.0;
    }
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.13; // louder wind

    const filterLfo = ctx.createOscillator();
    filterLfo.frequency.value = 0.15;
    const filterLfoGain = ctx.createGain();
    filterLfoGain.gain.value = 120;

    filterLfo.connect(filterLfoGain);
    filterLfoGain.connect(filter.frequency);
    filterLfo.start(0);

    const gainLfo = ctx.createOscillator();
    gainLfo.frequency.value = 0.08;
    const gainLfoGain = ctx.createGain();
    gainLfoGain.gain.value = 0.04;

    gainLfo.connect(gainLfoGain);
    gainLfoGain.connect(gainNode.gain);
    gainLfo.start(0);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
    activeSourcesRef.current.push(source, filterLfo, gainLfo);
    setActiveSound('wind');
  };

  const playHum = (ctx) => {
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 110;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 116;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 130;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.12; // louder hum

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(0);
    osc2.start(0);

    activeSourcesRef.current.push(osc1, osc2);
    setActiveSound('hum');
  };

  // Forest ambience (synthesized wind-like sound)
  const playForest = (ctx) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 2.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.35; // louder forest ambience

    // Adjust filter for clearer high frequencies
    filter.frequency.value = 800;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
    activeSourcesRef.current.push(source);
    setActiveSound('forest');
  };

  const handleToggleSound = (soundType) => {
    if (activeSound === soundType) {
      stopAllSounds();
      return;
    }

    stopAllSounds();

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (soundType === 'rain') playRain(ctx);
      else if (soundType === 'wind') playWind(ctx);
      else if (soundType === 'hum') playHum(ctx);
    } catch (e) {
      console.error("Failed to play synthesized sound:", e);
    }
  };

    // Speech synthesis utility with empathic voice and toggle
  const [activeUtterance, setActiveUtterance] = React.useState(null);
  const readText = (text) => {
    if (!('speechSynthesis' in window)) return;
    // If currently speaking same text, stop
    if (window.speechSynthesis.speaking && activeUtterance?.text === text) {
      window.speechSynthesis.cancel();
      setActiveUtterance(null);
      return;
    }
    // Cancel any ongoing speech before starting new
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    // Choose an empathic voice if available
    const voices = window.speechSynthesis.getVoices();
    const empathic = voices.find(v => /female|Emma|Olivia|Samantha|Victoria/i.test(v.name)) || null;
    if (empathic) utter.voice = empathic;
    // Slightly slower, warm pitch for empathy
    utter.rate = 0.75;
    utter.pitch = 1.2;
    utter.onend = () => setActiveUtterance(null);
    window.speechSynthesis.speak(utter);
    setActiveUtterance(utter);
  };

  const handleBreathingToggle = () => {
    if (breathingActive) {
      setBreathingActive(false);
    } else {
      setBreathStage(0);
      setSecondsLeft(4);
      setBreathingActive(true);
    }
  };

  const handleScanToggle = () => {
    if (scanActive) {
      setScanActive(false);
    } else {
      setScanSection(0);
      setScanTimer(15);
      setScanActive(true);
    }
  };

  // Box Breathing Loop
  useEffect(() => {
    if (breathingActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            setBreathStage((stage) => (stage + 1) % 4);
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [breathingActive]);

  // Body Scan Loop
  useEffect(() => {
    if (scanActive) {
      scanIntervalRef.current = setInterval(() => {
        setScanTimer((prev) => {
          if (prev === 1) {
            setScanSection((section) => {
              if (section === 3) {
                setScanActive(false);
                return 0;
              }
              setScanTimer(15);
              return section + 1;
            });
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(scanIntervalRef.current);
    }
    return () => clearInterval(scanIntervalRef.current);
  }, [scanActive]);

  const getBreathingScale = () => {
    if (!breathingActive) return 1.0;
    if (breathStage === 0) {
      return 1.0 + (4 - secondsLeft) * 0.13;
    } else if (breathStage === 1) {
      return 1.5;
    } else if (breathStage === 2) {
      return 1.5 - (4 - secondsLeft) * 0.13;
    } else {
      return 1.0;
    }
  };

  const getBreathStageText = () => {
    switch (breathStage) {
      case 0: return getTranslationText(lang, 'breathingStageInhale');
      case 1: return getTranslationText(lang, 'breathingStageHoldFull');
      case 2: return getTranslationText(lang, 'breathingStageExhale');
      case 3: return getTranslationText(lang, 'breathingStageHoldEmpty');
      default: return getTranslationText(lang, 'breathingStageReady');
    }
  };

  const getBreathDescriptor = () => {
    if (lang === 'hi') {
      switch (breathStage) {
        case 0: return "नाक से धीरे-धीरे शांत सकारात्मक ऊर्जा अंदर खींचें।";
        case 1: return "अपनी साँस रोकें। इस पूर्णता के मौन क्षण का आनंद लें।";
        case 2: return "धीरे-धीरे साँस छोड़ें, परीक्षा की सभी चिंताओं को विसर्जित करें।";
        case 3: return "खाली स्थान को होल्ड करें। पूर्ण शून्यता और शांति महसूस करें।";
        default: return "सांस लेने के चक्र के लिए स्वयं को तैयार करें।";
      }
    } else if (lang === 'hinglish') {
      switch (breathStage) {
        case 0: return "Dhire-dhire nose se positive energy andar pull karein.";
        case 1: return "Saans ko hold karein. Is silent space me relax karein.";
        case 2: return "Gently saans bahar chhodo, cutoff aur mock test stress release karo.";
        case 3: return "Khali space hold karein. Mind ko bilkul blank aur shaant rakho.";
        default: return "Taiyar ho jao focus aur breathing restart karne ke liye.";
      }
    } else if (lang === 'ta') {
      switch (breathStage) {
        case 0: return "மூக்கு வழியாக மெதுவாக அமைதியான ஆற்றலை உள்ளிழுக்கவும்.";
        case 1: return "மூச்சை நிறுத்துங்கள். இந்த முழுமையான அமைதிக்குள்ளே ஓய்வெடுங்கள்.";
        case 2: return "மெதுவாக மூச்சை வெளிவிடுங்கள், தேர்வு பயத்தை கரைத்து விடுங்கள்.";
        case 3: return "வெற்று சுவாசத்தை நிறுத்துங்கள். முழு அமைதியை அனுபவியுங்கள்.";
        default: return "தயாராக இருங்கள்.";
      }
    } else {
      switch (breathStage) {
        case 0: return "Slowly draw in calm energy through your nose.";
        case 1: return "Suspend your breath. Rest in this space of fullness.";
        case 2: return "Gently let it go, releasing exam triggers and cutoff worries.";
        case 3: return "Hold the empty space. Appreciate the complete stillness.";
        default: return "Prepare yourself for a moment of quiet focus.";
      }
    }
  };

  return (
    <div className="tab-pane" id="mindfulness-pane">
      {/* Sub-navigation Tabs — Stitch-style segmented pill control */}
      <div className="mindfulness-tabs" id="mindfulness-sub-navigation">
        <button
          className={`mindfulness-tab-btn ${activeMode === 'breathing' ? 'active' : ''}`}
          onClick={() => setActiveMode('breathing')}
          id="subnav-breathing-btn"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>air</span>
          {lang === 'hi' ? 'श्वास क्रिया' : lang === 'ta' ? 'சதுர சுவாசம்' : 'Box Breathing'}
        </button>
        <button
          className={`mindfulness-tab-btn ${activeMode === 'pmr' ? 'active' : ''}`}
          onClick={() => setActiveMode('pmr')}
          id="subnav-pmr-btn"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>accessibility_new</span>
          {lang === 'hi' ? 'मांसपेशी विश्राम' : lang === 'ta' ? 'தசை தளர்வு' : 'Muscle Relax'}
        </button>
        <button
          className={`mindfulness-tab-btn ${activeMode === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveMode('scan')}
          id="subnav-scan-btn"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>self_improvement</span>
          {lang === 'hi' ? 'बॉडी स्कैन' : lang === 'ta' ? 'உடல் கவனம்' : 'Body Scan'}
        </button>
      </div>

      <div className="mindfulness-grid">
        {/* Mode 1: Box Breathing & Soundscapes */}
        {activeMode === 'breathing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="glass-panel breathing-box" id="box-breathing-visualizer">
              <h2>{getTranslationText(lang, 'breathingTitle')}</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 24px auto', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 300 }}>
                {getTranslationText(lang, 'breathingDesc')}
              </p>

              <div className="breathing-circle-wrapper">
                <div 
                  className="breathing-circle-bg"
                  style={{ 
                    animation: breathingActive ? 'pulse-light 4s infinite' : 'none' 
                  }}
                ></div>
                <div 
                  className={`breathing-circle ${
                    breathingActive && (breathStage === 0 || breathStage === 1) ? 'inhale-stage' : ''
                  }`}
                  style={{ 
                    transform: `scale(${getBreathingScale()})`,
                    backgroundColor: breathStage === 0 || breathStage === 1 ? 'rgba(157, 129, 137, 0.95)' : 'rgba(144, 219, 244, 0.95)',
                    transition: 'background-color 1.2s ease-in-out'
                  }}
                  id="breathing-circle-element"
                >
                  <span className="breathing-instruction" id="breathing-stage-text" style={{ fontSize: lang === 'ta' ? '0.9rem' : '1.2rem' }}>
                    {breathingActive ? getBreathStageText() : getTranslationText(lang, 'breathingStageReady')}
                  </span>
                  <span className="breathing-timer" id="breathing-count-text">
                    {breathingActive ? `${secondsLeft}s` : 'Start'}
                  </span>
                </div>
              </div>

              <div className="breathing-phase-indicator" id="breathing-stage-indicator">
                {breathingActive ? 
                  (lang === 'hi' ? `चरण ${breathStage + 1} / 4` : lang === 'ta' ? `நிலை ${breathStage + 1} / 4` : `Stage ${breathStage + 1} of 4`) : 
                  (lang === 'hi' ? 'माइंडमित्रा के साथ श्वास क्रिया' : lang === 'ta' ? 'மைண்ட்மித்ராவுடன் சுவாசிக்கவும்' : 'Breathe with MindMitra')
                }
              </div>
              
              <p className="breathing-phrase-desc" id="breathing-phrase-descriptor">
                {breathingActive ? getBreathDescriptor() : (lang === 'hi' ? 'शुरू करने के लिए नीचे क्लिक करें।' : lang === 'ta' ? 'தொடங்குவதற்கு கீழே கிளிக் செய்யவும்.' : 'Click below to begin.')}
              </p>

              <button 
                className="glass-button active"
                onClick={handleBreathingToggle}
                id="toggle-breathing-btn"
                style={{
                  background: breathingActive ? 'var(--danger)' : 'var(--secondary)',
                  borderColor: breathingActive ? 'var(--danger)' : 'var(--secondary)',
                  color: 'var(--bg-deep)'
                }}
              >
                {breathingActive ? getTranslationText(lang, 'breathingStop') : getTranslationText(lang, 'breathingStart')}
              </button>
            </div>

            {/* Soundscapes Control Deck */}
            <div className="glass-panel" id="soundscape-panel" style={{ textAlign: 'center' }}>
              <h3>{getTranslationText(lang, 'breathingAudioTitle')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 300 }}>
                {getTranslationText(lang, 'breathingAudioDesc')}
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className={`glass-button ${activeSound === 'rain' ? 'active' : ''}`}
                  onClick={() => handleToggleSound('rain')}
                  id="btn-sound-rain"
                  style={{ borderRadius: '24px', padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  {getTranslationText(lang, 'soundRain')}
                </button>
                <button
                  className={`glass-button ${activeSound === 'wind' ? 'active' : ''}`}
                  onClick={() => handleToggleSound('wind')}
                  id="btn-sound-wind"
                  style={{ borderRadius: '24px', padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  {getTranslationText(lang, 'soundWind')}
                </button>
                <button
                  className={`glass-button ${activeSound === 'hum' ? 'active' : ''}`}
                  onClick={() => handleToggleSound('hum')}
                  id="btn-sound-hum"
                  style={{ borderRadius: '24px', padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  {getTranslationText(lang, 'soundHum')}
                </button>
                <button
                  className={`glass-button ${activeSound === 'forest' ? 'active' : ''}`}
                  onClick={() => handleToggleSound('forest')}
                  id="btn-sound-forest"
                  style={{ borderRadius: '24px', padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  {getTranslationText(lang, 'soundForest')}
                </button>
              </div>

              {activeSound && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
                  <div className={`soundwave-container active`} id="rain-soundwave">
                    <span className="soundwave-bar"></span>
                    <span className="soundwave-bar"></span>
                    <span className="soundwave-bar"></span>
                    <span className="soundwave-bar"></span>
                    <span className="soundwave-bar"></span>
                  </div>
                  <button
                    className="glass-button"
                    onClick={stopAllSounds}
                    style={{ fontSize: '0.75rem', marginTop: '12px', padding: '6px 14px', borderRadius: '12px', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    {lang === 'hi' ? 'आवाज़ बंद करें 🤫' : lang === 'ta' ? 'ஒலியை நிறுத்து 🤫' : 'Mute Audio 🤫'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode 2: Progressive Muscle Relaxation */}
        {activeMode === 'pmr' && (
          <div className="glass-panel pmr-guide" id="pmr-relaxation-guide">
            <h2>{getTranslationText(lang, 'pmrTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px', lineHeight: '1.45', fontWeight: 300 }}>
              {getTranslationText(lang, 'pmrDesc')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="pmr-steps-container">
              {pmrSteps.map((step, idx) => (
                <div 
                  key={step.title} 
                  className={`pmr-step-card ${pmrStep === idx ? 'active' : ''}`}
                  onClick={() => setPmrStep(idx)}
                  id={`pmr-card-step-${idx}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="pmr-step-num">{idx + 1}</div>
                    <div className="pmr-step-content">
                      <span className="pmr-step-title">{step.title}</span>
                      <span className="pmr-step-desc">{step.desc}</span>
                      <button
                        className={`glass-button speaker-button ${activeUtterance?.text === step.desc && window.speechSynthesis.speaking ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); readText(step.desc); }}
                        style={{ marginLeft: '8px', fontSize: '0.75rem', transition: 'background 0.3s' }}
                        aria-label="Read aloud"
                      >
                        🔊
                      </button>
                    </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <button 
                className="glass-button" 
                onClick={() => setPmrStep((p) => Math.max(0, p - 1))}
                disabled={pmrStep === 0}
                id="pmr-prev-btn"
              >
                ◀️ {lang === 'hi' ? 'पिछला' : lang === 'ta' ? 'முந்தைய' : 'Previous'}
              </button>
              <button 
                className="glass-button active" 
                onClick={() => setPmrStep((p) => Math.min(pmrSteps.length - 1, p + 1))}
                disabled={pmrStep === pmrSteps.length - 1}
                id="pmr-next-btn"
                style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--bg-deep)' }}
              >
                {lang === 'hi' ? 'अगला कदम' : lang === 'ta' ? 'அடுத்தது' : 'Next Step'} ▶️
              </button>
            </div>
          </div>
        )}

        {/* Mode 3: 5-Minute Body Scan */}
        {activeMode === 'scan' && (
          <div className="glass-panel" id="body-scan-guide">
            <h2>{getTranslationText(lang, 'scanTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.45', fontWeight: 300 }}>
              {getTranslationText(lang, 'scanDesc')}
            </p>

            {scanActive ? (
              <div style={{ textAlign: 'center', padding: '20px' }} id="active-scan-container">
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                  {scanTimer}s
                </div>
                <div 
                  className="glass-panel" 
                  style={{ 
                    maxWidth: '450px', 
                    margin: '0 auto', 
                    borderLeft: '4px solid var(--secondary)',
                    textAlign: 'left'
                  }}
                  id="active-scan-text-panel"
                >
                  <h3 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>
                    {scanSections[scanSection].title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.65', fontWeight: 300 }}>
                    {scanSections[scanSection].instructions}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
                  {scanSections.map((_, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        width: '32px', 
                        height: '6px', 
                        borderRadius: '3px',
                        background: scanSection === idx ? 'var(--secondary)' : 'rgba(255,255,255,0.06)',
                        transition: 'all 0.4s'
                      }}
                    ></div>
                  ))}
                </div>

                <button 
                  className="glass-button" 
                  onClick={handleScanToggle} 
                  style={{ marginTop: '24px', background: 'var(--danger)', borderColor: 'var(--danger)', color: 'var(--bg-deep)' }}
                  id="stop-scan-btn"
                >
                  {getTranslationText(lang, 'scanStop')}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }} id="inactive-scan-container">
                <div style={{ fontSize: '3.5rem', marginBottom: '16px', animation: 'floating-logo 5s ease-in-out infinite' }}>🧘‍♀️</div>
                <h3>{lang === 'hi' ? 'अपने शरीर को शांत करें' : lang === 'ta' ? 'உடலை ஒருமுகப்படுத்து' : 'Ground Your Senses'}</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 24px auto', fontSize: '0.9rem', fontWeight: 300 }}>
                  {lang === 'hi' ? '60 सेकंड का निर्देशित स्कैन चक्र जो आपकी रीढ़ और कंधों में जमे तनाव को तुरंत शांत करता है।' :
                   lang === 'ta' ? '60 வினாடிக்குள் உங்கள் உடலில் தேங்கியிருக்கும் அழுத்தத்தைக் குறைக்கும் எளிய தியானம்.' :
                   'A brief guided scanning cycle designed to release residual cognitive tension in under 60 seconds.'}
                </p>
                <button 
                  className="glass-button active" 
                  onClick={handleScanToggle}
                  id="start-scan-btn"
                  style={{ background: 'var(--secondary)', borderColor: 'var(--secondary)', color: 'var(--bg-deep)' }}
                >
                  {getTranslationText(lang, 'scanStart')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
