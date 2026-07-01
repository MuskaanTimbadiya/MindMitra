import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import VentWall from './VentWall';
import Mindfulness from './Mindfulness';

const translations = {
  en: {
    ventTitle: 'The MindMitra Vent Wall',
    mindfulnessTitle: 'Square Box Breathing'
  },
  hi: {
    ventTitle: 'माइंडमित्रा विसर्जन दीवार',
    mindfulnessTitle: 'स्क्वायर बॉक्स ब्रीदिंग'
  },
  hinglish: {
    ventTitle: 'MindMitra Vent Wall',
    mindfulnessTitle: 'Square Box Breathing'
  },
  ta: {
    ventTitle: 'மைண்ட்மித்ரா கவலை கரைப்பான்',
    mindfulnessTitle: 'சதுர பெட்டி சுவாசம் (Box Breathing)'
  }
};

describe('Language Switching UI', () => {
  Object.entries(translations).forEach(([lang, { ventTitle, mindfulnessTitle }]) => {
    test(`renders correct UI strings for language ${lang}`, () => {
      const profile = { language: lang };
      render(
        <>
          <VentWall profile={profile} />
          <Mindfulness profile={profile} />
        </>
      );

      // Check vent title exists (Vent component uses translation key 'ventTitle')
      expect(screen.getByText(ventTitle)).toBeInTheDocument();
      // Check mindfulness title exists
      expect(screen.getByText(mindfulnessTitle)).toBeInTheDocument();
    });
  });
});
