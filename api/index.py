"""
Vercel FastAPI Entry Point
This file imports your FastAPI app and makes it available to Vercel's serverless functions.
"""

import sys
import os

# Add the project root to Python path so we can import from backend
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

try:
    # Import your actual FastAPI app from backend
    from backend.src.api.main import app
    
    print("✅ Successfully imported FastAPI app from backend/src/api/main.py")
    
except ImportError as e:
    print(f"⚠️  Warning: Could not import from backend: {e}")
    print("Creating fallback FastAPI app for debugging...")
    
    # Fallback app for debugging
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    from typing import Dict, Any
    
    app = FastAPI(
        title="Autodoc API (Fallback Mode)",
        description="Running in fallback mode - check imports",
        version="1.0.0"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Define the same models
    class FixRequest(BaseModel):
        alert_id: str
        repository: str
        alert_source: str
        alert_data: Dict[str, Any]
        auto_merge: bool = False
        add_tests: bool = True
    
    # Root endpoint
    @app.get("/")
    async def root():
        return {
            "message": "Autodoc API - Running in fallback mode",
            "status": "check_imports",
            "python_path": sys.path,
            "note": "The backend/src/api/main.py import failed. Check Vercel logs."
        }
    
    # Health check
    @app.get("/v1/health")
    async def health_check():
        return {
            "status": "fallback_mode",
            "version": "1.0.0-fallback",
            "message": "Running fallback app - original import failed"
        }
    
    # Fix creation endpoint
    @app.post("/v1/fix/create")
    async def create_fix(request: FixRequest):
        return {
            "success": False,
            "message": "Running in fallback mode - backend not imported",
            "error": "Check Vercel build logs for import errors",
            "received_data": {
                "alert_id": request.alert_id,
                "repository": request.repository,
                "alert_source": request.alert_source
            }
        }

# Export the app for Vercel
__all__ = ["app"]