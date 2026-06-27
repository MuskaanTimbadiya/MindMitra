import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VentWall from '../../components/VentWall';
import Mindfulness from '../../components/Mindfulness';

const translations = {
  en: {
    ventTitle: 'Vent',
    mindfulnessTitle: 'Square Box Breathing'
  },
  hi: {
    ventTitle: 'वेंट',
    mindfulnessTitle: 'स्क्वायर बॉक्स ब्रीदिंग'
  },
  hinglish: {
    ventTitle: 'Vent',
    mindfulnessTitle: 'Square Box Breathing'
  },
  ta: {
    ventTitle: 'வெண்ட்',
    mindfulnessTitle: 'சதுர பெட்டியில் மூச்சு'
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
      expect(screen.getByText(new RegExp(ventTitle, 'i'))).toBeInTheDocument();
      // Check mindfulness title exists
      expect(screen.getByText(new RegExp(mindfulnessTitle, 'i'))).toBeInTheDocument();
    });
  });
});
