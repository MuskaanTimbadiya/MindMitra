import React, { useState, useEffect, useRef } from 'react';
import { getTranslationText } from '../utils/translations';

export default function VentWall({ profile }) {
  const [text, setText] = useState('');
  const [isDissolving, setIsDissolving] = useState(false);
  const [showReframing, setShowReframing] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const lang = profile?.language || 'en';

  const handleDissolve = () => {
    if (!text.trim()) return;
    setIsDissolving(true);
    setShowReframing(false);

    // Initialize and run Canvas particles disintegration
    setTimeout(() => {
      initDisintegration();
    }, 100);
  };

  const initDisintegration = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Match dimensions to container
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 240;

    // Draw the text on the canvas to extract its pixels
    ctx.font = '300 20px Inter, sans-serif';
    ctx.fillStyle = '#f8f9fa';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = canvas.width - 40;

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const startY = (canvas.height - (lines.length * 28)) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), canvas.width / 2, startY + (index * 28));
    });

    // Get pixels and create particles
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const particles = [];

    // Sample every 3rd pixel to keep performance optimal
    for (let y = 0; y < canvas.height; y += 3) {
      for (let x = 0; x < canvas.width; x += 3) {
        const idx = (y * canvas.width + x) * 4;
        const alpha = data[idx + 3];
        if (alpha > 128) {
          particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.6,
            vy: -Math.random() * 2.2 - 0.4, // Drift upwards (float away)
            alpha: 1.0,
            size: Math.random() * 1.5 + 0.6,
            color: Math.random() > 0.45 ? '#90dbf4' : '#9d8189' // Cyan or Lavender particles
          });
        }
      }
    }

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.014; // Fade out rate

        if (p.alpha > 0) {
          activeParticles = true;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1.0;

      if (activeParticles && frameCount < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationFrameRef.current);
        setText('');
        setIsDissolving(false);
        setShowReframing(true);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getSiblingReframes = () => {
    switch (lang) {
      case 'hi':
        return [
          "इसे जाने दें। एक सिंगल रैंक लिस्ट आपकी क्षमताओं को परिभाषित नहीं करती। एक गहरी साँस लें।",
          "इस बोझ को मुक्त करें। आप प्रयास कर रहे हैं, और यही पर्याप्त है। एक समय में एक कदम।",
          "चिंता को दूर जाने दें। एक व्यक्ति के रूप में आपका मूल्य किसी ओएमआर शीट से नहीं बंधा है।",
          "शर्मा जी के बेटे का अपना सफर है, और आपका अपना। अपने विकास पर ध्यान दें।",
          "मॉक टेस्ट का स्कोर बदलता रहता है। यह केवल अभ्यास है। इसे भूलकर आगे बढ़ें।"
        ];
      case 'hinglish':
        return [
          "Is stress ko chhor do. Ek single rank list se tumhari value decide nahi hoti. Deep breath lo.",
          "Load mat lo. Tum mehnat kar rahe ho, and yahi sabse badi baat hai. Ek baar me ek hi step lo.",
          "Is tension ko bilkul bhool jao. Ek student ke roop me tumhari value OMR sheet decide nahi karegi.",
          "Sharma ji ke bete ki alag journey hai aur tumhari alag. Apne goals par focus karo.",
          "Mock test scores to up-down hote rehte hain. Ye bas practice hai. Aage badho!"
        ];
      case 'ta':
        return [
          "அதை விட்டுவிடுங்கள். ஒரு மதிப்பெண் பட்டியல் உங்கள் திறமைகளை தீர்மானிக்காது. ஆழமாக சுவாசியுங்கள்.",
          "பாரத்தை குறைத்துக் கொள்ளுங்கள். நீங்கள் முயற்சி செய்கிறீர்கள், அதுவே போதுமானது. ஒரு நேரத்தில் ஒரு படி.",
          "கவலைகளை பறக்க விடுங்கள். ஒரு மனிதனாக உங்கள் மதிப்பு OMR தாளோடு முடிந்துவிடுவதில்லை.",
          "அடுத்தவர்களின் பயணமும் உங்கள் பயணமும் வேறுபட்டது. உங்கள் வளர்ச்சியில் மட்டும் கவனம் செலுத்துங்கள்.",
          "மாதிரித் தேர்வு மதிப்பெண்கள் மாறக்கூடியவை. அது வெறும் பயிற்சி மட்டுமே. தொடர்ந்து முன்னேறுங்கள்."
        ];
      default:
        return [
          "Let it go. A single rank list does not define your capabilities. Take a deep breath.",
          "Release the burden. You are doing the work, and that is more than enough. One step at a time.",
          "Let that worry float away. Your value as a person isn't tied to an OMR sheet.",
          "Sharma ji ka beta has his own journey, and you have yours. Focus on your own growth.",
          "Mock test scores fluctuate. It's just practice. Shake it off and keep pushing."
        ];
    }
  };

  const [reframeText, setReframeText] = useState('');

  useEffect(() => {
    if (showReframing) {
      const reframes = getSiblingReframes();
      const idx = Math.floor(Math.random() * reframes.length);
      setReframeText(reframes[idx]);
    }
  }, [showReframing, lang]);

  return (
    <div className="tab-pane vent-wall-container" id="vent-wall-pane">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <h2>{getTranslationText(lang, 'ventTitle')}</h2>
        <p className="vent-wall-description" style={{ margin: '12px auto' }}>
          {getTranslationText(lang, 'ventDesc')}
        </p>
      </div>

      <div className="vent-input-container" style={{ minHeight: '300px', justifyContent: 'center' }}>
        {isDissolving ? (
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', background: 'rgba(0,0,0,0.3)' }}>
            <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} id="vent-dissolve-canvas" />
          </div>
        ) : (
          <>
            <textarea
              className="glass-textarea vent-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={getTranslationText(lang, 'ventPlaceholder')}
              id="vent-thought-textarea"
            />

            <button
              className="glass-button active"
              onClick={handleDissolve}
              disabled={!text.trim()}
              id="dissolve-thought-btn"
              style={{
                background: 'var(--accent-warm)',
                borderColor: 'var(--accent-warm)',
                boxShadow: '0 0 15px var(--accent-glow)',
                color: 'var(--bg-deep)',
                fontSize: '1.05rem',
                padding: '12px 28px'
              }}
            >
              {getTranslationText(lang, 'ventButton')}
            </button>
          </>
        )}
      </div>

      {showReframing && (
        <div 
          className="glass-panel tab-pane" 
          style={{ 
            maxWidth: '500px', 
            textAlign: 'center', 
            borderLeft: '4px solid var(--secondary)',
            marginTop: '20px'
          }}
          id="vent-reframe-panel"
        >
          <span style={{ fontSize: '2rem' }}>😌</span>
          <h3 style={{ color: 'var(--secondary)', margin: '8px 0' }}>
            {getTranslationText(lang, 'ventReframeTitle')}
          </h3>
          <p style={{ fontStyle: 'italic', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            "{reframeText}"
          </p>
        </div>
      )}
    </div>
  );
}
