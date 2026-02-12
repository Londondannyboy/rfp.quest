"""
RFP.quest Agent Backend
FastAPI + CopilotKit + LangGraph for tender analysis
"""

import os
import json
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
        "endpoints": [
            "/health",
            "/copilotkit",
            "/parse-pdf",
            "/analyze-pdf",
            # Companies House / Buyer Intelligence
            "/company/{company_number}",
            "/company/{company_number}/officers",
            "/company/{company_number}/filings",
            "/company/{company_number}/news",
            "/company/{company_number}/decision-makers",
            "/buyer-intel/{company_number}",
            "/buyer-intel-enhanced/{company_number}",
            "/search/company?q={query}",
            # Signal Detection
            "/signals/{company_number}",
            "/threshold-watch/{company_number}?turnover=X&employees=Y&balance_sheet=Z",
            # Decision Maker Profiling (LinkedIn via Apify)
            "/decision-makers/{company_number}/profile",
        ],
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


# ============================================================================
# Companies House / Buyer Intelligence Endpoints
# ============================================================================

@app.get("/company/{company_number}")
async def get_company(company_number: str):
    """
    Get basic company information from Companies House.

    Args:
        company_number: UK company registration number (e.g., "07524813")
    """
    try:
        from tools.companies_house import get_company_info
        result = get_company_info.invoke(company_number)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Company lookup failed: {str(e)}")


@app.get("/company/{company_number}/officers")
async def get_officers(company_number: str):
    """
    Get company officers (directors, secretaries) for decision maker discovery.

    Args:
        company_number: UK company registration number
    """
    try:
        from tools.companies_house import get_company_officers
        result = get_company_officers.invoke(company_number)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Officers lookup failed: {str(e)}")


@app.get("/company/{company_number}/filings")
async def get_filings(company_number: str, category: str = "accounts", max_results: int = 5):
    """
    Get company filing history.

    Args:
        company_number: UK company registration number
        category: Filing category (accounts, confirmation-statement, etc.)
        max_results: Maximum number of filings to return
    """
    try:
        from tools.companies_house import get_filing_history
        result = get_filing_history.invoke(company_number, category=category, max_results=max_results)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Filing history lookup failed: {str(e)}")


@app.get("/buyer-intel/{company_number}")
async def get_buyer_intel(company_number: str):
    """
    Get comprehensive buyer intelligence for bid writing.

    Combines company profile, officers, and accounts analysis to provide
    insights for tailoring bid responses.

    Args:
        company_number: UK company registration number
    """
    try:
        from tools.companies_house import get_buyer_intelligence
        result = get_buyer_intelligence.invoke(company_number)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Buyer intelligence failed: {str(e)}")


@app.get("/search/company")
async def search_company(q: str):
    """
    Search for a company by name.

    Args:
        q: Search query (company name)
    """
    try:
        from tools.companies_house import search_company_by_name
        result = search_company_by_name(q)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Company search failed: {str(e)}")


@app.get("/buyer-intel-enhanced/{company_number}")
async def get_enhanced_buyer_intel(company_number: str):
    """
    Get comprehensive buyer intelligence with web enrichment.

    Includes Companies House data PLUS:
    - Recent news from Tavily
    - LinkedIn decision maker search
    - Web-verified data points

    Args:
        company_number: UK company registration number
    """
    try:
        from tools.companies_house import get_enhanced_buyer_intelligence
        result = get_enhanced_buyer_intelligence.invoke(company_number)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhanced buyer intelligence failed: {str(e)}")


@app.get("/company/{company_number}/news")
async def get_news(company_number: str):
    """
    Get recent news about a company.

    Args:
        company_number: UK company registration number
    """
    try:
        from tools.companies_house import get_company_info, get_company_news

        # First get company name
        company = get_company_info.invoke(company_number)
        if "error" in company:
            raise HTTPException(status_code=404, detail=company["error"])

        company_name = company.get("company_name")
        if not company_name:
            raise HTTPException(status_code=404, detail="Company name not found")

        # Get news
        result = get_company_news(company_name)
        result["company_number"] = company_number
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"News search failed: {str(e)}")


@app.get("/company/{company_number}/decision-makers")
async def get_decision_makers(company_number: str, roles: str = None):
    """
    Get decision makers from Companies House + LinkedIn search.

    Args:
        company_number: UK company registration number
        roles: Comma-separated list of roles to search (optional)
    """
    try:
        from tools.companies_house import (
            get_company_info,
            get_company_officers,
            search_decision_makers
        )

        # Get company info and officers
        company = get_company_info.invoke(company_number)
        if "error" in company:
            raise HTTPException(status_code=404, detail=company["error"])

        officers = get_company_officers.invoke(company_number)

        result = {
            "company_number": company_number,
            "company_name": company.get("company_name"),
            "decision_makers": []
        }

        # Add Companies House officers
        if "error" not in officers:
            for officer in officers.get("officers", []):
                result["decision_makers"].append({
                    **officer,
                    "source": "companies_house",
                    "confidence": "high"
                })

        # Search LinkedIn via Tavily
        company_name = company.get("company_name")
        if company_name:
            role_list = roles.split(",") if roles else None
            linkedin_results = search_decision_makers(company_name, role_list)

            if linkedin_results.get("decision_makers"):
                existing_names = {dm.get("name", "").lower() for dm in result["decision_makers"]}
                for dm in linkedin_results["decision_makers"]:
                    if dm.get("name", "").lower() not in existing_names:
                        result["decision_makers"].append(dm)

                result["linkedin_search"] = {
                    "profiles_found": len(linkedin_results["decision_makers"]),
                    "roles_searched": linkedin_results.get("roles_searched", [])
                }

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision maker search failed: {str(e)}")


@app.get("/signals/{company_number}")
async def get_signals(company_number: str):
    """
    Get opportunity signals for a company.

    Detects growth signals, risk indicators, and leadership changes
    to identify sales opportunities and timing.

    Args:
        company_number: UK company registration number
    """
    try:
        from tools.companies_house import get_opportunity_signals
        result = get_opportunity_signals.invoke(company_number)
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signal detection failed: {str(e)}")


@app.get("/threshold-watch/{company_number}")
async def threshold_watch(
    company_number: str,
    turnover: float = None,
    employees: int = None,
    balance_sheet: float = None
):
    """
    Check how close a company is to regulatory thresholds.

    Analyzes proximity to SECR, Gender Pay Gap, Modern Slavery,
    and Mandatory Audit thresholds.

    Args:
        company_number: UK company registration number
        turnover: Estimated annual turnover in GBP
        employees: Estimated employee count
        balance_sheet: Estimated balance sheet total in GBP
    """
    try:
        from tools.companies_house import detect_threshold_signals
        result = detect_threshold_signals(
            company_number=company_number,
            estimated_turnover=turnover,
            estimated_employees=employees,
            estimated_balance_sheet=balance_sheet
        )
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Threshold analysis failed: {str(e)}")


@app.post("/decision-makers/{company_number}/profile")
async def profile_decision_makers_endpoint(company_number: str, max_directors: int = 5):
    """
    Profile decision makers using LinkedIn data via Apify.

    Searches for LinkedIn profiles of top directors and analyzes their
    recent posts to extract topics, priorities, and bid writing insights.

    Args:
        company_number: UK company registration number
        max_directors: Maximum number of directors to profile (default 5)
    """
    try:
        from tools.companies_house import get_buyer_intelligence
        from tools.apify_linkedin import profile_decision_maker

        # Get buyer intelligence with decision makers
        intel = get_buyer_intelligence.invoke(company_number)
        if "error" in intel:
            raise HTTPException(status_code=404, detail=intel["error"])

        # Filter to directors only
        directors = [
            dm for dm in intel.get("decision_makers", [])
            if "director" in dm.get("role", "").lower()
        ][:max_directors]

        # Get company name from profile (nested structure)
        company_name = intel.get("profile", {}).get("company_name") or intel.get("company_name", "")

        if not directors:
            return {
                "company_number": company_number,
                "company_name": company_name,
                "decision_maker_profiles": [],
                "message": "No directors found for this company"
            }

        # Profile each director
        profiles = []
        for director in directors:
            profile = await profile_decision_maker(
                name=director.get("name", ""),
                role=director.get("role", ""),
                company_name=company_name
            )
            profiles.append(profile)

        return {
            "company_number": company_number,
            "company_name": company_name,
            "decision_maker_profiles": profiles,
            "directors_found": len(directors),
            "profiles_with_linkedin": sum(1 for p in profiles if p.get("linkedin_url")),
            "profiles_with_posts": sum(1 for p in profiles if p.get("post_count", 0) > 0)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision maker profiling failed: {str(e)}")


def setup_copilotkit():
    """Set up CopilotKit endpoint with LangGraph agent."""
    try:
        from copilotkit.integrations.fastapi import add_fastapi_endpoint
        from copilotkit import CopilotKitRemoteEndpoint, Action as CopilotAction

        # Import the LangGraph agent
        from agents.tender_analyzer import create_tender_analyzer_agent

        # Create the agent graph
        tender_agent = create_tender_analyzer_agent()

        # CopilotKit Actions - return JSON strings for proper message formatting
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

                return json.dumps({
                    "status": result.get("status", "unknown"),
                    "summary": result.get("summary"),
                    "compliance": result.get("compliance"),
                    "gap_analysis": result.get("gap_analysis"),
                    "error": result.get("error"),
                })
            except Exception as e:
                return json.dumps({
                    "status": "error",
                    "error": str(e),
                })

        async def search_buyer_action(buyer_name: str):
            """Search for buyer information."""
            try:
                from tools.tavily_search import tavily_search
                result = tavily_search.invoke(f'"{buyer_name}" UK government contracts')
                return json.dumps({"buyer": buyer_name, "research": result})
            except Exception as e:
                return json.dumps({"buyer": buyer_name, "error": str(e)})

        async def detect_framework_action(tender_text: str):
            """Detect the framework type from tender text."""
            try:
                from tools.framework_detector import detect_framework_type
                framework = detect_framework_type({"description": tender_text})
                return json.dumps({"framework": framework})
            except Exception as e:
                return json.dumps({"error": str(e)})

        async def get_summary_action(tender_data: dict, framework_type: str = None):
            """Get tender summary analysis."""
            try:
                from agents.summary_agent import analyze_summary
                summary = analyze_summary(tender_data, framework_type)
                return json.dumps({"summary": summary})
            except Exception as e:
                return json.dumps({"error": str(e)})

        async def get_compliance_action(tender_data: dict, framework_type: str = None, company_profile: dict = None):
            """Get compliance analysis."""
            try:
                from agents.compliance_agent import analyze_compliance
                compliance = analyze_compliance(tender_data, framework_type, company_profile)
                return json.dumps({"compliance": compliance})
            except Exception as e:
                return json.dumps({"error": str(e)})

        async def get_gap_analysis_action(tender_data: dict, company_profile: dict = None, compliance: dict = None):
            """Get gap analysis."""
            try:
                from agents.gap_analysis_agent import analyze_gaps
                gaps = analyze_gaps(tender_data, company_profile, compliance)
                return json.dumps({"gap_analysis": gaps})
            except Exception as e:
                return json.dumps({"error": str(e)})

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
