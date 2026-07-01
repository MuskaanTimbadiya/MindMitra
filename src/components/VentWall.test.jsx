import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VentWall from './VentWall';

// Mock canvas
import 'jest-canvas-mock';

describe('VentWall Component', () => {
  test('dissolve button triggers animation and shows reframed text', async () => {
    const profile = { language: 'en' };
    render(<VentWall profile={profile} />);

    const textarea = screen.getByPlaceholderText(/I am terrified I won't clear/i);
    fireEvent.change(textarea, { target: { value: 'I am feeling stressed' } });

    const dissolveBtn = screen.getByRole('button', { name: /Release & Dissolve/i });
    fireEvent.click(dissolveBtn);

    // Canvas should appear
    expect(screen.getByTestId('vent-dissolve-canvas')).toBeInTheDocument();

    // Wait for reframing text to appear after animation completes
    await waitFor(() => {
      const reframe = screen.getByText(/Let it go|Release the burden|Let that worry float away/i);
      expect(reframe).toBeInTheDocument();
    });
  });
});
