"""
RFP.quest Agent Backend
FastAPI + CopilotKit + LangGraph for tender analysis
"""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
        "endpoints": ["/health", "/copilotkit", "/parse-pdf", "/analyze-pdf"],
    }


class PDFAnalysisRequest(BaseModel):
    """Request for PDF analysis with optional parameters."""
    user_id: str | None = None
    analyze: bool = True  # Whether to run full analysis after parsing


@app.post("/parse-pdf")
async def parse_pdf_endpoint(file: UploadFile = File(...)):
    """
    Parse a PDF document and extract text content.

    Returns extracted text, metadata, and identified sections.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        from tools.pdf_parser import parse_pdf, extract_tender_sections

        # Read file content
        content = await file.read()

        # Parse PDF
        result = parse_pdf(content)

        # Extract sections
        if result.get("text"):
            result["sections"] = extract_tender_sections(result["text"])

        return {
            "success": True,
            "filename": file.filename,
            "page_count": result.get("page_count", 0),
            "char_count": len(result.get("text", "")),
            "extraction_method": result.get("extraction_method"),
            "metadata": result.get("metadata"),
            "sections": result.get("sections", {}),
            "tables_found": len(result.get("tables", [])),
            "text": result.get("text", "")[:10000],  # First 10k chars for preview
            "full_text_available": len(result.get("text", "")) > 10000,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF parsing failed: {str(e)}")


@app.post("/analyze-pdf")
async def analyze_pdf_endpoint(
    file: UploadFile = File(...),
    user_id: str | None = None,
):
    """
    Parse a PDF and run full tender analysis pipeline.

    Combines PDF parsing with LangGraph analysis for complete results.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        from tools.pdf_parser import parse_pdf, summarize_pdf_for_analysis
        from agents.tender_analyzer import create_tender_analyzer_agent

        # Read and parse PDF
        content = await file.read()
        pdf_result = parse_pdf(content)

        if not pdf_result.get("text"):
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # Create summary for analysis
        rfp_text = summarize_pdf_for_analysis(pdf_result)

        # Run analysis pipeline
        agent = create_tender_analyzer_agent()
        result = agent.invoke({
            "tender_ocid": None,
            "rfp_text": rfp_text,
            "user_id": user_id,
            "status": "pending",
            "messages": [],
        })

        return {
            "success": True,
            "filename": file.filename,
            "pdf_info": {
                "page_count": pdf_result.get("page_count", 0),
                "char_count": len(pdf_result.get("text", "")),
                "extraction_method": pdf_result.get("extraction_method"),
            },
            "analysis": {
                "status": result.get("status"),
                "summary": result.get("summary"),
                "compliance": result.get("compliance"),
                "gap_analysis": result.get("gap_analysis"),
                "error": result.get("error"),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


def setup_copilotkit():
    """Set up CopilotKit endpoint with LangGraph agent."""
    try:
        from copilotkit.integrations.fastapi import add_fastapi_endpoint
        from copilotkit import CopilotKitRemoteEndpoint, Action as CopilotAction

        # Import the LangGraph agent
        from agents.tender_analyzer import create_tender_analyzer_agent

        # Create the agent graph
        tender_agent = create_tender_analyzer_agent()

        # CopilotKit Actions
        async def analyze_tender_action(ocid: str = None, rfp_text: str = None, user_id: str = None):
            """Analyze a tender using the LangGraph pipeline."""
            try:
                # Run the agent with input state
                result = tender_agent.invoke({
                    "tender_ocid": ocid,
                    "rfp_text": rfp_text,
                    "user_id": user_id,
                    "status": "pending",
                    "messages": [],
                })

                return {
                    "status": result.get("status", "unknown"),
                    "summary": result.get("summary"),
                    "compliance": result.get("compliance"),
                    "gap_analysis": result.get("gap_analysis"),
                    "error": result.get("error"),
                }
            except Exception as e:
                return {
                    "status": "error",
                    "error": str(e),
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

        async def get_summary_action(tender_data: dict, framework_type: str = None):
            """Get tender summary analysis."""
            try:
                from agents.summary_agent import analyze_summary
                summary = analyze_summary(tender_data, framework_type)
                return {"summary": summary}
            except Exception as e:
                return {"error": str(e)}

        async def get_compliance_action(tender_data: dict, framework_type: str = None, company_profile: dict = None):
            """Get compliance analysis."""
            try:
                from agents.compliance_agent import analyze_compliance
                compliance = analyze_compliance(tender_data, framework_type, company_profile)
                return {"compliance": compliance}
            except Exception as e:
                return {"error": str(e)}

        async def get_gap_analysis_action(tender_data: dict, company_profile: dict = None, compliance: dict = None):
            """Get gap analysis."""
            try:
                from agents.gap_analysis_agent import analyze_gaps
                gaps = analyze_gaps(tender_data, company_profile, compliance)
                return {"gap_analysis": gaps}
            except Exception as e:
                return {"error": str(e)}

        # Define CopilotKit actions
        actions = [
            CopilotAction(
                name="analyzeTender",
                description="Run full tender analysis pipeline (summary, compliance, gap analysis)",
                parameters=[
                    {
                        "name": "ocid",
                        "type": "string",
                        "description": "The OCID of the tender to analyze",
                        "required": False,
                    },
                    {
                        "name": "rfp_text",
                        "type": "string",
                        "description": "Raw RFP text if no OCID available",
                        "required": False,
                    },
                    {
                        "name": "user_id",
                        "type": "string",
                        "description": "User ID for company profile lookup",
                        "required": False,
                    },
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
                description="Detect the UK procurement framework type from tender description",
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
            CopilotAction(
                name="getSummary",
                description="Get structured summary of a tender",
                parameters=[
                    {
                        "name": "tender_data",
                        "type": "object",
                        "description": "Tender data object with title, description, etc.",
                        "required": True,
                    },
                    {
                        "name": "framework_type",
                        "type": "string",
                        "description": "Framework type if known",
                        "required": False,
                    },
                ],
                handler=get_summary_action,
            ),
            CopilotAction(
                name="getCompliance",
                description="Get compliance checklist for a tender",
                parameters=[
                    {
                        "name": "tender_data",
                        "type": "object",
                        "description": "Tender data object",
                        "required": True,
                    },
                    {
                        "name": "framework_type",
                        "type": "string",
                        "description": "Framework type if known",
                        "required": False,
                    },
                    {
                        "name": "company_profile",
                        "type": "object",
                        "description": "Company profile for compliance evaluation",
                        "required": False,
                    },
                ],
                handler=get_compliance_action,
            ),
            CopilotAction(
                name="getGapAnalysis",
                description="Get gap analysis comparing company to tender requirements",
                parameters=[
                    {
                        "name": "tender_data",
                        "type": "object",
                        "description": "Tender data object",
                        "required": True,
                    },
                    {
                        "name": "company_profile",
                        "type": "object",
                        "description": "Company profile for gap analysis",
                        "required": False,
                    },
                    {
                        "name": "compliance",
                        "type": "object",
                        "description": "Compliance results for context",
                        "required": False,
                    },
                ],
                handler=get_gap_analysis_action,
            ),
        ]

        # Initialize CopilotKit SDK
        sdk = CopilotKitRemoteEndpoint(actions=actions)

        # Add CopilotKit endpoint
        add_fastapi_endpoint(app, sdk, "/copilotkit")
        print("CopilotKit endpoint registered with 6 actions:")
        print("  - analyzeTender (full pipeline)")
        print("  - searchBuyer")
        print("  - detectFramework")
        print("  - getSummary")
        print("  - getCompliance")
        print("  - getGapAnalysis")

    except ImportError as e:
        print(f"Warning: CopilotKit not available: {e}")
    except Exception as e:
        print(f"Warning: CopilotKit setup failed: {e}")
        import traceback
        traceback.print_exc()
