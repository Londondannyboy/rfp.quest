"""
Tender Analyzer Agent - Main orchestrator for RFP analysis

This agent coordinates the analysis pipeline:
1. Summary Agent - Overview, key dates, buyer info, visuals
2. Compliance Agent - Requirements checklist with pass/fail
3. Gap Analysis Agent - Company profile vs requirements comparison
"""

import os
from typing import Annotated, Any, TypedDict

from copilotkit import CopilotKitMiddleware, CopilotKitState
from deepagents import create_deep_agent
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages

from agents.summary_agent import analyze_summary
from agents.compliance_agent import analyze_compliance
from agents.gap_analysis_agent import analyze_gaps
from tools.tavily_search import tavily_search
from tools.tender_context import get_tender_details
from tools.company_profile import get_company_profile
from tools.framework_detector import detect_framework_type


class TenderAnalysisState(CopilotKitState):
    """State for tender analysis workflow."""

    # Input
    tender_ocid: str | None = None
    rfp_text: str | None = None
    user_id: str | None = None

    # Tender data (fetched or parsed)
    tender_data: dict[str, Any] | None = None

    # Company profile for gap analysis
    company_profile: dict[str, Any] | None = None

    # Detected framework type
    framework_type: str | None = None

    # Analysis results (structured JSON for each tab)
    summary: dict[str, Any] | None = None
    compliance: dict[str, Any] | None = None
    gap_analysis: dict[str, Any] | None = None

    # Processing state
    status: str = "pending"
    error: str | None = None

    # Messages for CopilotKit
    messages: Annotated[list, add_messages] = []


SYSTEM_PROMPT = """You are an expert UK government tender analyst with deep knowledge of:
- Crown Commercial Service (CCS) frameworks (G-Cloud, MCF, Construction, FM)
- Procurement Act 2023 requirements
- Social value evaluation (TOMs framework)
- Quality/price evaluation methodologies

Your role is to analyze tenders and provide:
1. Clear summaries with key dates and buyer information
2. Compliance checklists identifying mandatory requirements
3. Gap analysis comparing company capabilities against requirements

Always be thorough, accurate, and focus on actionable insights.
When analyzing UK public sector tenders, look for:
- Framework type (CCS, open tender, etc.)
- Evaluation weightings (quality vs price vs social value)
- Mandatory certifications (Cyber Essentials, ISO standards)
- Social value requirements (minimum 10% weighting since Procurement Act 2023)
"""


def fetch_tender_node(state: TenderAnalysisState) -> dict:
    """Fetch tender details from database or parse RFP text."""
    tender_ocid = state.tender_ocid
    rfp_text = state.rfp_text

    if tender_ocid:
        # Fetch from Find a Tender database
        tender_data = get_tender_details(tender_ocid)
        if tender_data:
            return {
                "tender_data": tender_data,
                "status": "fetched",
                "messages": [
                    HumanMessage(content=f"Analyzing tender: {tender_data.get('title', tender_ocid)}")
                ],
            }
        else:
            return {
                "error": f"Tender not found: {tender_ocid}",
                "status": "error",
            }
    elif rfp_text:
        # Use the provided RFP text directly
        return {
            "tender_data": {"description": rfp_text, "source": "rfp_upload"},
            "status": "parsed",
            "messages": [HumanMessage(content="Analyzing uploaded RFP document")],
        }
    else:
        return {
            "error": "No tender OCID or RFP text provided",
            "status": "error",
        }


def fetch_company_profile_node(state: TenderAnalysisState) -> dict:
    """Fetch company profile for gap analysis."""
    user_id = state.user_id

    if user_id:
        profile = get_company_profile(user_id)
        if profile:
            return {"company_profile": profile}

    # Return empty profile if not found (gap analysis will note this)
    return {"company_profile": {}}


def detect_framework_node(state: TenderAnalysisState) -> dict:
    """Detect the framework type from tender data."""
    tender_data = state.tender_data

    if not tender_data:
        return {"framework_type": "unknown"}

    framework = detect_framework_type(tender_data)
    return {
        "framework_type": framework,
        "messages": [HumanMessage(content=f"Detected framework: {framework}")],
    }


def summary_analysis_node(state: TenderAnalysisState) -> dict:
    """Run the summary analysis agent."""
    tender_data = state.tender_data
    framework_type = state.framework_type

    if not tender_data:
        return {"error": "No tender data for summary analysis"}

    summary = analyze_summary(tender_data, framework_type)
    return {
        "summary": summary,
        "messages": [HumanMessage(content="Summary analysis complete")],
    }


def compliance_analysis_node(state: TenderAnalysisState) -> dict:
    """Run the compliance analysis agent."""
    tender_data = state.tender_data
    framework_type = state.framework_type
    company_profile = state.company_profile

    if not tender_data:
        return {"error": "No tender data for compliance analysis"}

    compliance = analyze_compliance(tender_data, framework_type, company_profile)
    return {
        "compliance": compliance,
        "messages": [HumanMessage(content="Compliance analysis complete")],
    }


def gap_analysis_node(state: TenderAnalysisState) -> dict:
    """Run the gap analysis agent."""
    tender_data = state.tender_data
    company_profile = state.company_profile
    compliance = state.compliance

    if not tender_data:
        return {"error": "No tender data for gap analysis"}

    gaps = analyze_gaps(tender_data, company_profile, compliance)
    return {
        "gap_analysis": gaps,
        "status": "completed",
        "messages": [HumanMessage(content="Gap analysis complete - all analysis finished!")],
    }


def should_continue(state: TenderAnalysisState) -> str:
    """Determine if we should continue or end due to error."""
    if state.status == "error" or state.error:
        return "error"
    return "continue"


def create_tender_analyzer_agent():
    """Create the tender analyzer LangGraph agent."""

    # Build the graph
    workflow = StateGraph(TenderAnalysisState)

    # Add nodes
    workflow.add_node("fetch_tender", fetch_tender_node)
    workflow.add_node("fetch_company_profile", fetch_company_profile_node)
    workflow.add_node("detect_framework", detect_framework_node)
    workflow.add_node("summary_analysis", summary_analysis_node)
    workflow.add_node("compliance_analysis", compliance_analysis_node)
    workflow.add_node("gap_analysis", gap_analysis_node)

    # Define edges
    workflow.set_entry_point("fetch_tender")

    # After fetching tender, check for errors
    workflow.add_conditional_edges(
        "fetch_tender",
        should_continue,
        {
            "continue": "fetch_company_profile",
            "error": END,
        },
    )

    # Parallel: fetch company profile and detect framework
    workflow.add_edge("fetch_company_profile", "detect_framework")
    workflow.add_edge("detect_framework", "summary_analysis")

    # Sequential analysis: Summary -> Compliance -> Gap Analysis
    workflow.add_edge("summary_analysis", "compliance_analysis")
    workflow.add_edge("compliance_analysis", "gap_analysis")
    workflow.add_edge("gap_analysis", END)

    # Compile with CopilotKit middleware
    graph = workflow.compile()

    return graph


# Alternative: Create using Deep Agents for more advanced features
def create_deep_tender_analyzer():
    """Create tender analyzer using Deep Agents framework."""
    agent = create_deep_agent(
        model="google_genai:gemini-2.0-flash",
        tools=[
            tavily_search,
            get_tender_details,
            get_company_profile,
            detect_framework_type,
        ],
        middleware=[CopilotKitMiddleware()],
        system_prompt=SYSTEM_PROMPT,
    )
    return agent
