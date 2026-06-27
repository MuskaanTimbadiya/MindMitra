import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('Header UI – data-testid attributes', () => {
  test('renders all header test IDs', () => {
    render(<App />);
    // Brand name
    expect(screen.getByText(/MindMitra/i)).toBeInTheDocument();
    // Nav links
    expect(screen.getByTestId('nav-link-home')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-dailytools')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-mindfulness')).toBeInTheDocument();
    expect(screen.getByTestId('nav-link-helplines')).toBeInTheDocument();
    // Badges
    expect(screen.getByTestId('badge-exam')).toBeInTheDocument();
    expect(screen.getByTestId('badge-streak')).toBeInTheDocument();
    // Action buttons
    expect(screen.getByTestId('btn-notifications')).toBeInTheDocument();
    expect(screen.getByTestId('btn-settings')).toBeInTheDocument();
    // Avatar ring
    expect(screen.getByTestId('avatar-ring')).toBeInTheDocument();
  });
});

// Simple task toggle test – uses Dashboard component directly
import Dashboard from './components/Dashboard';

describe('Dashboard mini‑tasks', () => {
  test('toggles task completion', () => {
    const mockOnToggle = jest.fn();
    render(
      <Dashboard
        tasks={[{ id: 1, text: 'Test task', completed: false }]} 
        onToggleTask={mockOnToggle}
        onSelectTab={() => {}}
        lang="en"
        streak={0}
        profile={{ name: 'User', exam: 'JEE' }}
        setShowHelpline={() => {}}
        setShowSettings={() => {}}
        setActiveTab={() => {}}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });
});
