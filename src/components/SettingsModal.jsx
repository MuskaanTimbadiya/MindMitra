import React, { useState } from 'react';
import { getTranslationText } from '../utils/translations';

export default function SettingsModal({ profile, onSave, onClose }) {
  const [name, setName] = useState(profile.name || '');
  const [exam, setExam] = useState(profile.exam || 'JEE');
  const [subjects, setSubjects] = useState(profile.subjects || '');
  const [language, setLanguage] = useState(profile.language || 'en');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, exam, subjects, language });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="settings-overlay">
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        id="settings-content"
      >
        <div className="modal-header">
          <h2>{getTranslationText(language, 'settingsTitle')}</h2>
          <button 
            className="glass-button" 
            onClick={onClose}
            style={{ padding: '6px 12px', borderRadius: '50%', fontSize: '1.1rem' }}
            id="close-settings-btn"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" id="settings-form">
          <div className="form-group">
            <label className="form-label" htmlFor="student-name">
              {getTranslationText(language, 'settingsName')}
            </label>
            <input
              type="text"
              id="student-name"
              className="glass-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Rohit"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="student-exam">
              {getTranslationText(language, 'settingsExam')}
            </label>
            <select
              id="student-exam"
              className="glass-select"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
            >
              <option value="JEE">IIT-JEE (Engineering)</option>
              <option value="NEET">NEET (Medical)</option>
              <option value="UPSC">UPSC Civil Services</option>
              <option value="CAT">CAT (Management)</option>
              <option value="GATE">GATE (Post-Grad Engineering)</option>
              <option value="CUET">CUET (Undergrad Admissions)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="student-subjects">
              {getTranslationText(language, 'settingsSubjects')}
            </label>
            <input
              type="text"
              id="student-subjects"
              className="glass-input"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="E.g., Organic Chemistry, Physics Rotation, Quant"
            />
            <p className="form-help">
              {getTranslationText(language, 'welcomeDesc', { name: '', exam: '', subjects: '' }).split('.')[1] || 'MindMitra will customize coping actions.'}
            </p>
          </div>

          {/* Language Selector */}
          <div className="form-group">
            <label className="form-label" htmlFor="student-language">
              {getTranslationText(language, 'settingsLanguage')}
            </label>
            <select
              id="student-language"
              className="glass-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="hinglish">Hinglish (Hindi in English Script)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="glass-button" 
              onClick={onClose}
              id="cancel-settings-btn"
            >
              {getTranslationText(language, 'btnCancel')}
            </button>
            <button 
              type="submit" 
              className="glass-button active"
              id="save-settings-btn"
              style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--bg-deep)' }}
            >
              {getTranslationText(language, 'btnSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
