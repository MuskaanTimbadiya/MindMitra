import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import AgentActivityFeed from './AgentActivityFeed';

const mockTrace = [
  {
    agent: "OrchestratorAgent",
    status: "completed",
    summary: "Routed to 3 specialist agents",
    duration_ms: 120
  },
  {
    agent: "StressDetectorAgent",
    status: "completed",
    summary: "Stress levels within baseline bounds",
    duration_ms: 890
  },
  {
    agent: "CrisisGuardAgent",
    status: "completed",
    summary: "No crisis language detected ✓",
    duration_ms: 95
  }
];

describe('AgentActivityFeed Component', () => {
  test('does not render when agentTrace is empty', () => {
    const { container } = render(<AgentActivityFeed agentTrace={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders trace cards and toggles visibility', async () => {
    const { container } = render(<AgentActivityFeed agentTrace={mockTrace} />);
    
    // Stagger entry timer emulation
    // 3 cards * 150ms = 450ms total stagger delay
    await act(async () => {
      await new Promise(r => setTimeout(r, 500));
    });

    // Check header is present
    expect(screen.getByText(/Multi-Agent Activity Trace/i)).toBeInTheDocument();

    // Check agent names are present
    expect(screen.getByText('Orchestrator')).toBeInTheDocument();
    expect(screen.getByText('StressDetector')).toBeInTheDocument();
    expect(screen.getByText('CrisisGuard')).toBeInTheDocument();

    // Check statuses are present
    const completedBadges = screen.getAllByText('completed');
    expect(completedBadges.length).toBe(3);

    // Check summaries are present
    expect(screen.getByText('Routed to 3 specialist agents')).toBeInTheDocument();

    // Click Hide Agent Activity
    const toggleBtn = screen.getByText(/Hide Agent Activity/i);
    fireEvent.click(toggleBtn);

    // Feed should now be hidden
    expect(screen.queryByText(/Multi-Agent Activity Trace/i)).not.toBeInTheDocument();

    // Click Show Agent Activity
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Multi-Agent Activity Trace/i)).toBeInTheDocument();
  });
});
