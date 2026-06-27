import React from 'react';
import { getTranslationText } from '../utils/translations';

export default function SafetyCard({ profile }) {
  const lang = profile?.language || 'en';

  return (
    <div className="safety-alert-card tab-pane" id="safety-card">
      <div className="safety-header">
        <span className="safety-icon">🤍</span>
        <h2 className="safety-title">{getTranslationText(lang, 'safetyTitle')}</h2>
      </div>
      
      <p className="safety-text">
        {getTranslationText(lang, 'safetyDesc')}
      </p>

      <div className="helpline-grid" id="helplines">
        <div className="helpline-item">
          <div className="helpline-name">{getTranslationText(lang, 'helplineGovernment')}</div>
          <div className="helpline-phone">14416</div>
          <div className="helpline-note">Toll-free, 24/7 mental health support</div>
        </div>

        <div className="helpline-item">
          <div className="helpline-name">{getTranslationText(lang, 'helplineVandrevala')}</div>
          <div className="helpline-phone">+91 9999 666 555</div>
          <div className="helpline-note">Free, confidential 24/7 helpline</div>
        </div>

        <div className="helpline-item">
          <div className="helpline-name">{getTranslationText(lang, 'helplineAasra')}</div>
          <div className="helpline-phone">+91 98204 66726</div>
          <div className="helpline-note">Professional suicide prevention support</div>
        </div>
      </div>

      <p className="safety-text" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
        👉 {lang === 'hi' ? (
          <><strong>कदम उठाएं:</strong> अपनी स्क्रीन बंद करें। अपने माता-पिता, मित्र या शिक्षक से कहें: <em>"मैं बहुत परेशान महसूस कर रहा हूँ और मुझे मदद की ज़रूरत है।"</em> वे आपकी परवाह करते हैं, आपके नंबरों की नहीं।</>
        ) : lang === 'hinglish' ? (
          <><strong>Action point:</strong> Ek baar screen band karo. Apne parents, room partner, ya dost ke paas jao aur bolo: <em>"Yaar mai bohot heavy and stressed feel kar raha hu, please thodi baat karo."</em> Vo aapki care karte hain, aapke score ki nahi.</>
        ) : lang === 'ta' ? (
          <><strong>உடனடி நடவடிக்கை:</strong> திரையை அணைத்து விட்டு உங்கள் பெற்றோர் அல்லது நண்பரிடம் கூறுங்கள்: <em>"நான் மிகவும் மன அழுத்தத்தில் இருக்கிறேன், எனக்கு உதவி தேவை."</em> அவர்கள் உங்கள் மீது அன்பு கொண்டவர்கள், உங்கள் மதிப்பெண்களை விட முக்கியம்.</>
        ) : (
          <><strong>Action to take:</strong> Turn off your screen. Go to your parents, friend, or teacher and tell them: <em>"I am feeling really overwhelmed and I need some help."</em> They care about you, not your test scores.</>
        )}
      </p>
    </div>
  );
}
