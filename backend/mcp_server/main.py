from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import datetime
from ..security.encryption import get_db_connection

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class JournalEntry(BaseModel):
    text: str
    mood_score: Optional[int] = None
    timestamp: Optional[datetime.datetime] = None

class StudySession(BaseModel):
    hours: float
    subject: str
    date: Optional[datetime.date] = None

class StudentProfile(BaseModel):
    name: str
    exam_type: str
    exam_date: datetime.date

# Helper to get DB connection (encrypted)
def _db():
    return get_db_connection()

@app.post("/log_journal")
def log_journal(entry: JournalEntry):
    conn = _db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO journal (text, mood_score, timestamp) VALUES (?,?,?)",
        (entry.text, entry.mood_score, entry.timestamp or datetime.datetime.utcnow()),
    )
    conn.commit()
    return {"status": "ok"}

@app.get("/mood_history")
def get_mood_history(days: int = 7):
    conn = _db()
    cur = conn.cursor()
    # Retrieve mood history for the past `days` days
    cur.execute(
        "SELECT mood_score, timestamp FROM journal WHERE timestamp >= datetime('now', ? || ' days') ORDER BY timestamp DESC",
        (-days,)
    )
    rows = cur.fetchall()
    return [{"mood_score": r[0], "timestamp": r[1]} for r in rows]

@app.post("/log_study")
def log_study(session: StudySession):
    conn = _db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO study (hours, subject, date) VALUES (?,?,?)",
        (session.hours, session.subject, session.date or datetime.date.today()),
    )
    conn.commit()
    return {"status": "ok"}

@app.get("/study_history")
def get_study_history(days: int = 7):
    conn = _db()
    cur = conn.cursor()
    cur.execute(
        "SELECT hours, subject, date FROM study WHERE date >= date('now', ?)||' days' ORDER BY date DESC",
        (-days,)
    )
    rows = cur.fetchall()
    return [{"hours": r[0], "subject": r[1], "date": r[2]} for r in rows]

@app.get("/profile")
def get_student_profile():
    # In a real app this would come from a user table; placeholder values here
    return {
        "name": os.getenv("STUDENT_NAME", "John Doe"),
        "exam_type": os.getenv("EXAM_TYPE", "NEET"),
        "exam_date": os.getenv("EXAM_DATE", "2026-08-01"),
    }

@app.get("/exam_countdown")
def get_exam_countdown():
    profile = get_student_profile()
    exam_date = datetime.datetime.strptime(profile["exam_date"], "%Y-%m-%d").date()
    days_left = (exam_date - datetime.date.today()).days
    return {"days_remaining": days_left}

@app.post("/flag_crisis")
def flag_crisis(summary: str, timestamp: Optional[datetime.datetime] = None):
    conn = _db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO crisis_events (summary, timestamp) VALUES (?,?)",
        (summary, timestamp or datetime.datetime.utcnow()),
    )
    conn.commit()
    return {"status": "logged"}

@app.get("/health")
def health_check():
    try:
        _ = _db()
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
