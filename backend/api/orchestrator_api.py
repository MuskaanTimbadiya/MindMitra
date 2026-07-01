import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from ..agents.orchestrator import OrchestratorAgent

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate orchestrator (could inject config)
orchestrator = OrchestratorAgent()

class JournalRequest(BaseModel):
    journal_text: str
    mood_score: int | None = None
    timestamp: str | None = None

@app.post("/process_journal")
def process_journal(req: JournalRequest):
    try:
        result = orchestrator.run({
            "journal_text": req.journal_text,
            "mood_score": req.mood_score,
            "timestamp": req.timestamp,
        })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
