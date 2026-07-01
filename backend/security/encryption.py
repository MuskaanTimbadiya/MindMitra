import os
import sqlite3
from typing import Any

# Path to the encrypted SQLite database file
DB_PATH = os.getenv("ENCRYPTED_DB_PATH", "./data/encrypted_student.db")

# Derive the encryption key from an environment variable; in a real app this should be a user‑provided passphrase
ENCRYPTION_KEY = os.getenv("ENCRYPTION_PASSPHRASE", "default-passphrase")

def get_db_connection() -> sqlite3.Connection:
    """Return a connection to the encrypted SQLite database.
    Uses SQLCipher if available; otherwise falls back to plain SQLite (not secure).
    """
    # Ensure the directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        # Attempt to set the key for SQLCipher
        conn.execute(f"PRAGMA key = '{ENCRYPTION_KEY}';")
        # Verify that the key works by trying a simple query
        conn.execute('SELECT count(*) FROM sqlite_master;')
    except sqlite3.DatabaseError:
        # If SQLCipher is not available, just return the connection (data will be unencrypted)
        pass
    # Create tables if they do not exist
    _ensure_schema(conn)
    return conn

def _ensure_schema(conn: sqlite3.Connection) -> None:
    cur = conn.cursor()
    # Journal table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS journal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            mood_score INTEGER,
            timestamp DATETIME NOT NULL
        );
    ''')
    # Study session table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS study (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hours REAL NOT NULL,
            subject TEXT NOT NULL,
            date DATE NOT NULL
        );
    ''')
    # Crisis events table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS crisis_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            summary TEXT NOT NULL,
            timestamp DATETIME NOT NULL
        );
    ''')
    conn.commit()

    # Seed mock database if empty
    cur.execute("SELECT count(*) FROM journal;")
    if cur.fetchone()[0] == 0:
        import datetime
        import random
        base_time = datetime.datetime.utcnow()
        # Seed 15 entries over the past 30 days
        mood_examples = [
            ("Did a mock test today, physics was tough but chemistry went well.", 7),
            ("Feeling a bit anxious about the upcoming revision test.", 4),
            ("Burned out after 10 hours of study. Need sleep.", 3),
            ("Had a great discussion with a friend. Feeling motivated!", 9),
            ("Revised all organic naming reactions. Super calm now.", 8),
            ("Syllabus is overwhelming. Too many topics left.", 3),
            ("Cleared all coordinate geometry doubts today.", 9),
            ("Woke up early, meditated for 10 minutes. Very peaceful.", 8),
            ("Struggling with organic reaction mechanisms.", 5),
            ("Took a full mock test, scored below my expectation. Demotivated.", 4),
            ("Chai break helped a lot. Back to studying physics.", 7),
            ("Feeling extremely exhausted today, taking it light.", 2),
            ("Solved 20 hard integration questions, feeling on fire!", 10),
            ("Had a minor panic attack about NEET cutoff, but did box breathing.", 5),
            ("Parents encouraged me today, feeling supported and calm.", 8)
        ]
        for idx, (text, score) in enumerate(mood_examples):
            # Spread them out: e.g. idx * 2 days ago
            days_ago = idx * 2
            ts = base_time - datetime.timedelta(days=days_ago)
            ts_str = ts.strftime('%Y-%m-%d %H:%M:%S')
            cur.execute(
                "INSERT INTO journal (text, mood_score, timestamp) VALUES (?,?,?)",
                (text, score, ts_str)
            )
        conn.commit()

