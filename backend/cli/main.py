import click
import os
from pathlib import Path
from dotenv import load_dotenv

# Helper to load environment variables from .env if present
def load_env():
    env_path = Path(__file__).parents[2] / '.env'
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)

@click.group()
def cli():
    """MindMitra Agent CLI"""
    load_env()

@cli.command()
@click.argument('journal_text')
def analyze_journal(journal_text):
    """Run full agent pipeline on a journal entry"""
    # Call the orchestrator API locally
    import requests
    url = os.getenv('ORCHESTRATOR_URL', 'http://localhost:8001/process_journal')
    resp = requests.post(url, json={"journal_text": journal_text})
    click.echo(resp.json())

@cli.command()
def mood_checkin():
    """Quick 1‑question mood check + trend update"""
    mood = click.prompt('How do you feel today? (0‑10)', type=int)
    # Log mood as a journal entry with minimal text
    import requests
    url = os.getenv('MCP_URL', 'http://localhost:8000/log_journal')
    resp = requests.post(url, json={"text": f"Mood checkin: {mood}", "mood_score": mood})
    click.echo(resp.json())

@cli.command()
@click.argument('hours', type=float)
@click.argument('subject')
def study_log(hours, subject):
    """Log today's study session"""
    import requests
    url = os.getenv('MCP_URL', 'http://localhost:8000/log_study')
    resp = requests.post(url, json={"hours": hours, "subject": subject})
    click.echo(resp.json())

@cli.command()
def crisis_support():
    """Directly invoke CrisisGuardAgent"""
    # For demo, simply send a crisis journal entry
    import requests
    url = os.getenv('ORCHESTRATOR_URL', 'http://localhost:8001/process_journal')
    resp = requests.post(url, json={"journal_text": "I want to kill myself"})
    click.echo(resp.json())

@cli.command()
def weekly_report():
    """Generate weekly wellness summary"""
    import requests
    # Gather mood and study history then summarize (placeholder)
    m_url = os.getenv('MCP_URL', 'http://localhost:8000/mood_history')
    s_url = os.getenv('MCP_URL', 'http://localhost:8000/study_history')
    mood = requests.get(m_url, params={"days": 7}).json()
    study = requests.get(s_url, params={"days": 7}).json()
    click.echo({"mood_history": mood, "study_history": study})

if __name__ == '__main__':
    cli()
