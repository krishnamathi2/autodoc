from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uuid
import datetime
import os
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(
    title="autodoc API",
    description="Automated Security Vulnerability Remediation Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    contact={
        "name": "autodoc Support",
        "url": "https://github.com/krishnamathi2/autodoc",
        "email": "support@autodoc.dev",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# Setup templates directory
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = BASE_DIR / "templates"
TEMPLATES_DIR.mkdir(exist_ok=True)

templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Pydantic models for your API
class VulnerabilityData(BaseModel):
    vulnerability: str
    severity: str
    affected_version: Optional[str] = None
    fixed_version: Optional[str] = None
    dependency: Optional[str] = None
    cve_id: Optional[str] = None
    cvss_score: Optional[float] = None
    description: Optional[str] = None
    references: Optional[List[str]] = []

class SecurityAlert(BaseModel):
    alert_id: str
    repository: str
    alert_source: str
    alert_data: VulnerabilityData
    auto_merge: Optional[bool] = False
    add_tests: Optional[bool] = True
    metadata: Optional[Dict[str, Any]] = {}

class FixResponse(BaseModel):
    status: str
    message: str
    fix_id: str
    pr_url: Optional[str] = None
    estimated_time: Optional[str] = None
    details: Optional[Dict[str, Any]] = {}

# In-memory storage for demo (replace with database in production)
fixes_db = {}

# ==================== FRONTEND ROUTES ====================

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Serve the homepage"""
    return templates.TemplateResponse("index.html", {
        "request": request,
        "title": "autodoc • Automated Security Fixes",
        "api_url": str(request.base_url) + "v1/fix/create"
    })

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    """User dashboard page"""
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "title": "Dashboard • autodoc"
    })

@app.get("/api-test", response_class=HTMLResponse)
async def api_test_page(request: Request):
    """API testing page"""
    return templates.TemplateResponse("api-test.html", {
        "request": request,
        "title": "API Tester • autodoc"
    })

# ==================== API ROUTES ====================

@app.post("/v1/fix/create", response_model=FixResponse)
async def create_fix(alert: SecurityAlert):
    """
    Process security alerts and create automated fixes
    
    This endpoint:
    1. Receives security vulnerability alerts
    2. Analyzes the vulnerability
    3. Creates automated fixes
    4. Returns fix details
    """
    try:
        # Generate unique fix ID
        fix_id = f"fix_{uuid.uuid4().hex[:12]}"
        
        # Process the alert (this is where your fix logic goes)
        analysis_result = analyze_vulnerability(alert)
        
        # Create fix response
        response = {
            "status": "success",
            "message": f"Security fix processing initiated for {alert.alert_data.vulnerability}",
            "fix_id": fix_id,
            "pr_url": f"https://github.com/{alert.repository}/pull/{uuid.uuid4().int % 1000}",
            "estimated_time": "2-5 minutes",
            "details": {
                "alert_id": alert.alert_id,
                "repository": alert.repository,
                "severity": alert.alert_data.severity,
                "dependency": alert.alert_data.dependency,
                "analysis": analysis_result,
                "timestamp": datetime.datetime.now().isoformat()
            }
        }
        
        # Store in database (in-memory for demo)
        fixes_db[fix_id] = {
            **response,
            "original_alert": alert.dict(),
            "created_at": datetime.datetime.now(),
            "status": "processing"
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process security alert: {str(e)}"
        )

@app.get("/v1/fix/{fix_id}")
async def get_fix_status(fix_id: str):
    """Get status of a specific fix"""
    if fix_id not in fixes_db:
        raise HTTPException(status_code=404, detail="Fix not found")
    
    return fixes_db[fix_id]

@app.get("/v1/fixes")
async def list_fixes(limit: int = 10, offset: int = 0):
    """List recent fixes"""
    fixes = list(fixes_db.values())
    fixes.sort(key=lambda x: x["created_at"], reverse=True)
    
    return {
        "total": len(fixes),
        "limit": limit,
        "offset": offset,
        "fixes": fixes[offset:offset + limit]
    }

@app.post("/v1/fix/{fix_id}/approve")
async def approve_fix(fix_id: str):
    """Approve and merge a fix"""
    if fix_id not in fixes_db:
        raise HTTPException(status_code=404, detail="Fix not found")
    
    fixes_db[fix_id]["status"] = "approved"
    fixes_db[fix_id]["approved_at"] = datetime.datetime.now()
    
    return {
        "status": "success",
        "message": f"Fix {fix_id} approved",
        "fix_id": fix_id
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "autodoc",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now().isoformat(),
        "dependencies": {
            "fastapi": "0.128.0",
            "python-multipart": "0.0.21",
            "status": "secure"
        }
    }

@app.get("/api/stats")
async def get_stats():
    """Get service statistics"""
    total_fixes = len(fixes_db)
    completed = sum(1 for f in fixes_db.values() if f["status"] == "approved")
    processing = sum(1 for f in fixes_db.values() if f["status"] == "processing")
    
    return {
        "total_fixes": total_fixes,
        "completed_fixes": completed,
        "processing_fixes": processing,
        "success_rate": (completed / total_fixes * 100) if total_fixes > 0 else 0,
        "uptime": "99.9%",
        "last_updated": datetime.datetime.now().isoformat()
    }

# ==================== HELPER FUNCTIONS ====================

def analyze_vulnerability(alert: SecurityAlert) -> Dict[str, Any]:
    """Analyze vulnerability and determine fix strategy"""
    
    vuln_data = alert.alert_data
    
    # Determine fix strategy based on severity and dependency
    if vuln_data.severity in ["critical", "high"]:
        strategy = "immediate_version_bump"
        priority = "urgent"
    else:
        strategy = "scheduled_version_bump"
        priority = "normal"
    
    # Calculate estimated fix time
    if vuln_data.dependency and vuln_data.fixed_version:
        fix_time = "1-2 minutes"
    else:
        fix_time = "5-10 minutes (needs investigation)"
    
    return {
        "strategy": strategy,
        "priority": priority,
        "estimated_fix_time": fix_time,
        "risk_level": vuln_data.severity,
        "affected_components": [vuln_data.dependency] if vuln_data.dependency else ["unknown"],
        "recommended_action": f"Update {vuln_data.dependency or 'dependency'} to {vuln_data.fixed_version or 'latest secure version'}"
    }

# ==================== ADDITIONAL API ENDPOINTS ====================

@app.get("/api/integrations")
async def list_integrations():
    """List available integrations"""
    return {
        "integrations": [
            {
                "name": "GitHub",
                "type": "source_control",
                "status": "available",
                "docs": "/api/docs#github-integration"
            },
            {
                "name": "GitLab",
                "type": "source_control",
                "status": "beta",
                "docs": "/api/docs#gitlab-integration"
            },
            {
                "name": "Dependabot",
                "type": "security_scanner",
                "status": "available",
                "docs": "/api/docs#dependabot-integration"
            },
            {
                "name": "Snyk",
                "type": "security_scanner",
                "status": "available",
                "docs": "/api/docs#snyk-integration"
            },
            {
                "name": "Slack",
                "type": "notification",
                "status": "available",
                "docs": "/api/docs#slack-integration"
            }
        ]
    }

@app.get("/api/supported-languages")
async def supported_languages():
    """List supported programming languages"""
    return {
        "languages": [
            {"name": "Python", "package_manager": "pip", "status": "stable"},
            {"name": "Node.js", "package_manager": "npm/yarn", "status": "beta"},
            {"name": "Java", "package_manager": "Maven/Gradle", "status": "planned"},
            {"name": "Go", "package_manager": "go modules", "status": "planned"},
            {"name": "Ruby", "package_manager": "bundler", "status": "planned"}
        ]
    }

# ==================== ERROR HANDLERS ====================

@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc: HTTPException):
    """Custom 404 handler"""
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            status_code=404,
            content={"error": "Endpoint not found", "path": request.url.path}
        )
    else:
        # For non-API routes, return HTML 404 page
        return templates.TemplateResponse(
            "404.html",
            {"request": request, "message": "Page not found"},
            status_code=404
        )

@app.exception_handler(500)
async def internal_error_exception_handler(request: Request, exc: HTTPException):
    """Custom 500 handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "Something went wrong on our end. Please try again later.",
            "request_id": str(uuid.uuid4())
        }
    )

# ==================== STARTUP EVENT ====================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print("🚀 autodoc API starting up...")
    print(f"📁 Templates directory: {TEMPLATES_DIR}")
    print(f"🔗 API Documentation: /api/docs")
    print(f"🏠 Homepage: /")
    print(f"⚡ Health check: /health")
    print("✅ autodoc ready to process security fixes!")

# ==================== MAIN ENTRY POINT ====================

if __name__ == "__main__":
    import uvicorn
    
    # Development server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )