from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import Base, engine
from routers import users, employees
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="First Task API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(users.router)
app.include_router(employees.router)

# Check for static at both relative and absolute paths
if os.path.exists("static") or os.path.exists("/app/backend/static"):
    # Use absolute path to be safe
    static_dir = "/app/backend/static" if os.path.exists("/app/backend/static") else "static"
    
    # Mount assets directory first
    app.mount("/assets", StaticFiles(directory=f"{static_dir}/assets"), name="assets")
    
    # Then mount the static directory
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
    
    # Serve React app at root
    @app.get("/")
    async def read_index():
        return FileResponse(f"{static_dir}/index.html")
    
    # Catch-all route for SPA routing
    @app.get("/{path:path}")
    async def catch_all(path: str):
        # Don't catch requests for API routes
        if path.startswith(("users/", "employees/", "docs/", "redoc/", "openapi.json")):
            # Let FastAPI handle API routes normally
            raise HTTPException(status_code=404, detail="Not found")
        
        # Serve React app for all other routes
        return FileResponse(f"{static_dir}/index.html")

# API health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}