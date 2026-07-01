import os
from typing import Dict, Any
from google_antigravity_sdk import Agent, AgentConfig, Tool

class CrisisGuardAgent(Agent):
    """High‑priority watchdog that scans journal text for crisis language.
    If a crisis is detected, it returns an emergency response immediately.
    """

    CRISIS_KEYWORDS = [
        "suicide",
        "kill myself",
        "self harm",
        "self-harm",
        "I'm going to kill",
        "can't go on",
        "panic attack",
        "depressed",
        "hopeless",
    ]

    def __init__(self, config: AgentConfig = None):
        super().__init__(config or AgentConfig())
        # No extra tools needed for now

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        journal = input_data.get("journal_text", "").lower()
        detected = any(keyword in journal for keyword in self.CRISIS_KEYWORDS)
        if detected:
            # In a real system we would look up local helpline numbers from a config
            response = (
                "**⚠️ Crisis Detected**\n"
                "If you are thinking about harming yourself or feel unsafe, please reach out immediately.\n"
                "Here are some trusted Indian helplines: \n"
                "- iCall: 022-25521111\n"
                "- Vandrevala Foundation: 1800-425-2736\n"
                "You are not alone—consider a grounding exercise: breathe in for 4 seconds, hold for 4, exhale for 4, repeat."
            )
            return {"crisis_detected": True, "response": response}
        return {"crisis_detected": False}
