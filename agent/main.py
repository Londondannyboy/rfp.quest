"""
RFP.quest Agent Backend
FastAPI + CopilotKit for tender analysis
"""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize on startup."""
    print("Agent backend starting...")
    setup_copilotkit()
    yield
    print("Agent backend shutting down...")


app = FastAPI(
    title="RFP.quest Agent API",
    description="LangGraph agents for UK tender analysis",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://rfp.quest",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "rfp-quest-agent"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": "RFP.quest Agent",
        "version": "0.1.0",
        "endpoints": ["/health", "/copilotkit"],
    }


def setup_copilotkit():
    """Set up CopilotKit endpoint."""
    try:
        from copilotkit.integrations.fastapi import add_fastapi_endpoint
        from copilotkit import CopilotKitRemoteEndpoint, Action as CopilotAction

        # CopilotKit Actions
        async def analyze_tender_action(ocid: str):
            """Analyze a tender by OCID."""
            return {
                "ocid": ocid,
                "status": "analysis_started",
                "message": f"Analysis started for tender {ocid}",
            }

        async def search_buyer_action(buyer_name: str):
            """Search for buyer information."""
            try:
                from tools.tavily_search import tavily_search
                result = tavily_search.invoke(f'"{buyer_name}" UK government contracts')
                return {"buyer": buyer_name, "research": result}
            except Exception as e:
                return {"buyer": buyer_name, "error": str(e)}

        async def detect_framework_action(tender_text: str):
            """Detect the framework type from tender text."""
            try:
                from tools.framework_detector import detect_framework_type
                framework = detect_framework_type({"description": tender_text})
                return {"framework": framework}
            except Exception as e:
                return {"error": str(e)}

        # Define CopilotKit actions
        actions = [
            CopilotAction(
                name="analyzeTender",
                description="Start analysis of a UK government tender",
                parameters=[
                    {
                        "name": "ocid",
                        "type": "string",
                        "description": "The OCID of the tender to analyze",
                        "required": True,
                    }
                ],
                handler=analyze_tender_action,
            ),
            CopilotAction(
                name="searchBuyer",
                description="Search for information about a buyer organization",
                parameters=[
                    {
                        "name": "buyer_name",
                        "type": "string",
                        "description": "Name of the buying organization",
                        "required": True,
                    }
                ],
                handler=search_buyer_action,
            ),
            CopilotAction(
                name="detectFramework",
                description="Detect the UK procurement framework type",
                parameters=[
                    {
                        "name": "tender_text",
                        "type": "string",
                        "description": "Tender description text",
                        "required": True,
                    }
                ],
                handler=detect_framework_action,
            ),
        ]

        # Initialize CopilotKit SDK
        sdk = CopilotKitRemoteEndpoint(actions=actions)

        # Add CopilotKit endpoint
        add_fastapi_endpoint(app, sdk, "/copilotkit")
        print("CopilotKit endpoint registered at /copilotkit")
    except ImportError as e:
        print(f"Warning: CopilotKit not available: {e}")
    except Exception as e:
        print(f"Warning: CopilotKit setup failed: {e}")
