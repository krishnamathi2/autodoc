# api/index.py
import sys
import os

# Add backend/src to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend', 'src'))

from api.main import app

# Export the FastAPI app for Vercel
__all__ = ["app"]