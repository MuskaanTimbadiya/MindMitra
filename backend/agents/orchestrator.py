import os
from typing import Dict, Any, List
from google_antigravity_sdk import Agent, AgentConfig, Tool

# Placeholder import for other agents
from .stress_detector import StressDetectorAgent
from .coping_coach import CopingCoachAgent
from .study_balance import StudyBalanceAgent
from .crisis_guard import CrisisGuardAgent

class OrchestratorAgent(Agent):
    """Root orchestrator that receives a journal entry, runs specialist agents, and aggregates the response."""

    def __init__(self, config: AgentConfig = None):
        super().__init__(config or AgentConfig())
        # Instantiate specialist agents
        self.stress_detector = StressDetectorAgent()
        self.coping_coach = CopingCoachAgent()
        self.study_balance = StudyBalanceAgent()
        self.crisis_guard = CrisisGuardAgent()
        # Define any tools the orchestrator can expose (e.g., for CLI)
        self.register_tool(Tool(name="run_pipeline", func=self.run_pipeline, description="Run full journal analysis pipeline"))

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Entry point for the orchestrator – expects a dict with at least ``journal_text``.
        Returns a combined response dict.
        """
        # First, let CrisisGuard have priority
        crisis_result = self.crisis_guard.run(input_data)
        if crisis_result.get("crisis_detected"):
            return {
                "status": "crisis",
                "response": crisis_result["response"],
                "metadata": {"agent": "CrisisGuardAgent"},
            }

        # Normal flow – run stress detection and study balance in parallel (simplified sequential here)
        stress_report = self.stress_detector.run(input_data)
        study_suggestion = self.study_balance.run(input_data)
        coping_tips = self.coping_coach.run({**input_data, **stress_report})

        combined = {
            "stress_report": stress_report,
            "study_suggestion": study_suggestion,
            "coping_tips": coping_tips,
        }
        return {"status": "ok", "response": combined}

    # Tool exposed for CLI / external callers
    def run_pipeline(self, journal_text: str) -> Dict[str, Any]:
        return self.run({"journal_text": journal_text})
