"""
RFP.quest Agent Backend - Minimal FastAPI for testing
"""
import os
from fastapi import FastAPI

app = FastAPI(title="RFP.quest Agent")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "rfp-quest-agent"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {"service": "RFP.quest Agent", "version": "0.1.0"}
