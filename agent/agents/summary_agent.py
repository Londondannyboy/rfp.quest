"""
Summary Agent - Tab 1: Tender Overview

Extracts and structures:
- Title, buyer, value, deadline, location
- CPV codes and categories
- Key dates and timeline
- Buyer organization background (via web search)
- Visual data for charts
"""

import os
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from tools.tavily_search import tavily_search
from prompts.framework_templates import get_framework_template


SUMMARY_SYSTEM_PROMPT = """You are an expert UK government tender analyst specializing in tender summaries.

Your task is to extract and structure the following from tender documents:

1. **Basic Information**
   - Title (official tender title)
   - Buyer (organization name and department)
   - Reference number (OCID, notice ID)
   - Publication date
   - Submission deadline (CRITICAL - must be accurate)

2. **Contract Details**
   - Estimated value (min/max range if provided)
   - Contract duration (start/end dates)
   - Contract type (services, goods, works)
   - Procurement procedure (open, restricted, framework call-off)

3. **Classification**
   - CPV codes (Common Procurement Vocabulary)
   - NUTS codes (regions)
   - Sector/industry category

4. **Framework Information** (if applicable)
   - Framework name (G-Cloud, MCF4, etc.)
   - Lot number and description
   - Call-off mechanism

5. **Buyer Context** (research if needed)
   - Organization type (central gov, local authority, NHS, etc.)
   - Recent contract awards
   - Strategic priorities

Always structure your output as JSON with clear sections.
"""


def analyze_summary(
    tender_data: dict[str, Any],
    framework_type: str | None = None,
) -> dict[str, Any]:
    """
    Analyze tender and produce structured summary.

    Args:
        tender_data: Tender document data (from DB or parsed RFP)
        framework_type: Detected framework type (ccs_gcloud, open_tender, etc.)

    Returns:
        Structured summary dict for UI rendering
    """
    # Initialize LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.1,
    )

    # Get framework-specific template if available
    template = get_framework_template(framework_type) if framework_type else None

    # Build context from tender data
    tender_context = _build_tender_context(tender_data)

    # Research buyer if we have buyer name
    buyer_name = tender_data.get("buyer_name") or tender_data.get("buyerName")
    buyer_research = None
    if buyer_name:
        try:
            buyer_research = tavily_search(
                f'"{buyer_name}" UK government contracts strategic priorities',
                max_results=3,
            )
        except Exception:
            buyer_research = None

    # Build prompt
    messages = [
        SystemMessage(content=SUMMARY_SYSTEM_PROMPT),
        HumanMessage(content=f"""Analyze this tender and provide a structured summary:

**Tender Data:**
{tender_context}

{f"**Framework Type:** {framework_type}" if framework_type else ""}

{f"**Buyer Research:**" + chr(10) + buyer_research if buyer_research else ""}

{f"**Framework Template:**" + chr(10) + template if template else ""}

Provide your analysis as a JSON object with the following structure:
{{
    "overview": {{
        "title": "...",
        "buyer": {{
            "name": "...",
            "department": "...",
            "type": "central_gov|local_authority|nhs|other"
        }},
        "reference": "...",
        "publishedDate": "YYYY-MM-DD",
        "deadline": "YYYY-MM-DD HH:MM"
    }},
    "contract": {{
        "valueMin": number|null,
        "valueMax": number|null,
        "currency": "GBP",
        "duration": {{
            "startDate": "YYYY-MM-DD"|null,
            "endDate": "YYYY-MM-DD"|null,
            "months": number|null
        }},
        "type": "services|goods|works|mixed",
        "procedure": "open|restricted|competitive_dialogue|framework_calloff"
    }},
    "classification": {{
        "cpvCodes": ["...", "..."],
        "cpvDescriptions": ["...", "..."],
        "sector": "...",
        "region": "..."
    }},
    "framework": {{
        "name": "..."|null,
        "lot": "..."|null,
        "callOffType": "direct_award|mini_competition|further_competition"|null
    }},
    "keyDates": [
        {{"event": "...", "date": "YYYY-MM-DD", "isPast": boolean}}
    ],
    "buyerInsights": {{
        "organizationType": "...",
        "recentActivity": "...",
        "strategicPriorities": ["...", "..."]
    }},
    "visualData": {{
        "timelineEvents": [...],
        "valueBreakdown": {{...}}
    }}
}}
"""),
    ]

    # Get response
    response = llm.invoke(messages)

    # Parse JSON from response
    try:
        import json
        content = response.content
        # Extract JSON from markdown code block if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        summary = json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        # Fallback to basic structure
        summary = _build_fallback_summary(tender_data)

    return summary


def _build_tender_context(tender_data: dict[str, Any]) -> str:
    """Build context string from tender data."""
    lines = []

    # Map common field names
    field_map = {
        "title": ["title", "tenderTitle"],
        "description": ["description", "tenderDescription", "scope"],
        "buyer": ["buyer_name", "buyerName", "buyer"],
        "value_min": ["value_min", "valueMin", "minValue"],
        "value_max": ["value_max", "valueMax", "maxValue"],
        "deadline": ["tender_end_date", "deadline", "submissionDeadline"],
        "published": ["published_date", "publishedDate", "publicationDate"],
        "cpv_codes": ["cpv_codes", "cpvCodes"],
        "region": ["region", "location"],
        "status": ["status", "stage"],
    }

    for label, keys in field_map.items():
        for key in keys:
            if key in tender_data and tender_data[key]:
                lines.append(f"{label.replace('_', ' ').title()}: {tender_data[key]}")
                break

    # Add full description if available
    desc = tender_data.get("description") or tender_data.get("tenderDescription")
    if desc and len(desc) > 200:
        lines.append(f"\nFull Description:\n{desc[:5000]}")

    return "\n".join(lines)


def _build_fallback_summary(tender_data: dict[str, Any]) -> dict[str, Any]:
    """Build fallback summary when LLM parsing fails."""
    return {
        "overview": {
            "title": tender_data.get("title", "Unknown Tender"),
            "buyer": {
                "name": tender_data.get("buyer_name") or tender_data.get("buyerName", "Unknown"),
                "department": None,
                "type": "other",
            },
            "reference": tender_data.get("ocid", ""),
            "publishedDate": tender_data.get("published_date"),
            "deadline": tender_data.get("tender_end_date") or tender_data.get("deadline"),
        },
        "contract": {
            "valueMin": tender_data.get("value_min") or tender_data.get("valueMin"),
            "valueMax": tender_data.get("value_max") or tender_data.get("valueMax"),
            "currency": "GBP",
            "duration": {"startDate": None, "endDate": None, "months": None},
            "type": "services",
            "procedure": "open",
        },
        "classification": {
            "cpvCodes": tender_data.get("cpv_codes") or tender_data.get("cpvCodes") or [],
            "cpvDescriptions": [],
            "sector": None,
            "region": tender_data.get("region"),
        },
        "framework": {"name": None, "lot": None, "callOffType": None},
        "keyDates": [],
        "buyerInsights": {
            "organizationType": None,
            "recentActivity": None,
            "strategicPriorities": [],
        },
        "visualData": {"timelineEvents": [], "valueBreakdown": {}},
    }
