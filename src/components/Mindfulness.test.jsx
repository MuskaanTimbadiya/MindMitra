import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Mindfulness from './Mindfulness';

describe('Mindfulness Component', () => {
  test('renders breathing title and toggles breathing session', async () => {
    const profile = { language: 'en' };
    render(<Mindfulness profile={profile} />);

    // Verify breathing title is present
    expect(screen.getByText(/Square Box Breathing/i)).toBeInTheDocument();

    // Find and click the start button
    const startButton = screen.getByRole('button', { name: /Begin 4-4-4-4 Cycle ▶️/i });
    fireEvent.click(startButton);

    // After click, button text should change to stop session
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Stop Session 🛑/i })).toBeInTheDocument();
    });
  });
});
