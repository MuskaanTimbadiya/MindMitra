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
