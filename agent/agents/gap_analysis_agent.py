"""
Gap Analysis Agent - Tab 3: Company Profile vs Requirements (UNIQUE DIFFERENTIATOR)

Provides visual comparison:
- Capability matches (what you have vs what's needed)
- Gaps identified (what's missing)
- Match percentages by category
- Action items to address gaps
- Risk assessment
"""

import os
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI


GAP_ANALYSIS_SYSTEM_PROMPT = """You are an expert UK tender bid consultant specializing in gap analysis.

Your task is to compare a company's profile and capabilities against tender requirements to identify:
1. Where the company is STRONG (clear match)
2. Where there are GAPS (missing capabilities or evidence)
3. How to ADDRESS those gaps

**Analysis Dimensions:**

1. **Technical Skills & Experience**
   - Required expertise vs company expertise
   - Sector experience (NHS, Central Gov, Local Authority, etc.)
   - Technology/tool requirements
   - Case study evidence needed

2. **Certifications & Accreditations**
   - Required certifications vs held certifications
   - Time to obtain missing certifications
   - Acceptable alternatives

3. **Capacity & Resources**
   - Team size requirements
   - Key personnel qualifications
   - Geographic coverage
   - Availability/mobilization

4. **Past Performance**
   - Similar contract experience
   - Reference requirements
   - Contract value experience

5. **Social Value Capability**
   - Environmental commitments
   - Skills and employment
   - Community engagement
   - Supply chain practices

**Scoring Guidance:**
- 90-100%: Strong match, clear evidence available
- 70-89%: Good match, may need to strengthen evidence
- 50-69%: Partial match, gaps to address
- 25-49%: Significant gaps, major effort required
- 0-24%: Critical gaps, may not be viable

Always provide actionable recommendations for addressing gaps.
"""


def analyze_gaps(
    tender_data: dict[str, Any],
    company_profile: dict[str, Any] | None,
    compliance_results: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Analyze gaps between company profile and tender requirements.

    Args:
        tender_data: Tender document data
        company_profile: Company capabilities and certifications
        compliance_results: Results from compliance analysis (for context)

    Returns:
        Structured gap analysis with scores and actions
    """
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.2,
    )

    # Build contexts
    tender_context = _build_tender_context(tender_data)
    profile_context = _build_profile_context(company_profile)
    compliance_context = _build_compliance_context(compliance_results)

    # Check if we have enough profile data
    has_profile = bool(company_profile and company_profile.get("company_name"))

    messages = [
        SystemMessage(content=GAP_ANALYSIS_SYSTEM_PROMPT),
        HumanMessage(content=f"""Perform a detailed gap analysis comparing the company profile against tender requirements.

**Tender Requirements:**
{tender_context}

**Company Profile:**
{profile_context}

**Compliance Analysis Results:**
{compliance_context}

{"NOTE: Limited company profile data available. Analysis will focus on identifying what information/evidence is needed." if not has_profile else ""}

Provide your analysis as a JSON object:
{{
    "overallScore": 0-100,
    "overallStatus": "strong_match|good_match|partial_match|significant_gaps|not_viable",
    "bidRecommendation": "proceed|proceed_with_caution|needs_work|do_not_bid",
    "summary": "Brief executive summary of the gap analysis",

    "dimensions": [
        {{
            "name": "Technical Skills & Experience",
            "score": 0-100,
            "status": "strong|good|partial|gap|critical_gap",
            "matches": [
                {{
                    "requirement": "What the tender requires",
                    "capability": "What the company has",
                    "evidence": "How to demonstrate this"
                }}
            ],
            "gaps": [
                {{
                    "requirement": "What's required",
                    "gap": "What's missing",
                    "impact": "high|medium|low",
                    "remediation": "How to address this gap",
                    "timeframe": "immediate|short_term|long_term"
                }}
            ]
        }},
        {{
            "name": "Certifications & Accreditations",
            "score": 0-100,
            "status": "...",
            "matches": [...],
            "gaps": [...]
        }},
        {{
            "name": "Past Performance & References",
            "score": 0-100,
            "status": "...",
            "matches": [...],
            "gaps": [...]
        }},
        {{
            "name": "Capacity & Resources",
            "score": 0-100,
            "status": "...",
            "matches": [...],
            "gaps": [...]
        }},
        {{
            "name": "Social Value Capability",
            "score": 0-100,
            "status": "...",
            "matches": [...],
            "gaps": [...]
        }}
    ],

    "actionPlan": [
        {{
            "action": "Specific action to take",
            "category": "Which dimension this addresses",
            "priority": "critical|high|medium|low",
            "deadline": "Suggested timeline",
            "owner": "Who should do this",
            "impact": "How this improves the bid"
        }}
    ],

    "strengthsToHighlight": [
        {{
            "strength": "Key strength",
            "evidence": "How to demonstrate it",
            "whereToUse": "Which tender section"
        }}
    ],

    "riskAssessment": {{
        "winProbability": "high|medium|low",
        "keyRisks": [
            {{
                "risk": "...",
                "likelihood": "high|medium|low",
                "impact": "high|medium|low",
                "mitigation": "..."
            }}
        ],
        "dealBreakers": ["Any showstopper issues"]
    }},

    "visualData": {{
        "radarChart": [
            {{"dimension": "Technical Skills", "score": 75, "benchmark": 70}},
            {{"dimension": "Certifications", "score": 90, "benchmark": 80}},
            {{"dimension": "Past Performance", "score": 40, "benchmark": 70}},
            {{"dimension": "Capacity", "score": 60, "benchmark": 65}},
            {{"dimension": "Social Value", "score": 25, "benchmark": 50}}
        ],
        "gapSeverity": {{
            "critical": 1,
            "high": 2,
            "medium": 3,
            "low": 2
        }}
    }}
}}
"""),
    ]

    response = llm.invoke(messages)

    try:
        import json
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]

        gap_analysis = json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        gap_analysis = _build_fallback_gap_analysis(company_profile)

    return gap_analysis


def _build_tender_context(tender_data: dict[str, Any]) -> str:
    """Build context focusing on requirements."""
    lines = []

    if title := tender_data.get("title"):
        lines.append(f"Tender: {title}")

    if buyer := tender_data.get("buyer_name") or tender_data.get("buyerName"):
        lines.append(f"Buyer: {buyer}")

    # Value (indicates scale/complexity)
    value_min = tender_data.get("value_min") or tender_data.get("valueMin")
    value_max = tender_data.get("value_max") or tender_data.get("valueMax")
    if value_min or value_max:
        lines.append(f"Contract Value: {value_min or 'TBC'} - {value_max or 'TBC'} GBP")

    # CPV codes (indicates sector)
    if cpv := tender_data.get("cpv_codes") or tender_data.get("cpvCodes"):
        lines.append(f"CPV Codes: {', '.join(cpv) if isinstance(cpv, list) else cpv}")

    # Full description
    desc = tender_data.get("description") or tender_data.get("tenderDescription") or ""
    if desc:
        lines.append(f"\nRequirements:\n{desc[:6000]}")

    return "\n".join(lines)


def _build_profile_context(company_profile: dict[str, Any] | None) -> str:
    """Build comprehensive profile context."""
    if not company_profile:
        return """No company profile available.

To perform accurate gap analysis, please complete your company profile with:
- Company description and core services
- Certifications held (ISO, Cyber Essentials, etc.)
- Areas of expertise
- Target sectors and regions
- Sustainability commitments"""

    lines = []

    if name := company_profile.get("company_name"):
        lines.append(f"**Company:** {name}")

    if desc := company_profile.get("description"):
        lines.append(f"**Description:** {desc}")

    if website := company_profile.get("website"):
        lines.append(f"**Website:** {website}")

    if services := company_profile.get("products_services"):
        lines.append(f"**Services/Products:** {', '.join(services)}")

    if expertise := company_profile.get("expertise_areas"):
        lines.append(f"**Expertise Areas:** {', '.join(expertise)}")

    if certs := company_profile.get("certifications"):
        lines.append(f"**Certifications:** {', '.join(certs)}")

    if regions := company_profile.get("target_regions"):
        lines.append(f"**Target Regions:** {', '.join(regions)}")

    if cpv := company_profile.get("target_cpv_divisions"):
        lines.append(f"**Target Sectors (CPV):** {', '.join(cpv)}")

    min_val = company_profile.get("min_contract_value")
    max_val = company_profile.get("max_contract_value")
    if min_val or max_val:
        lines.append(f"**Contract Value Range:** {min_val or 'Any'} - {max_val or 'Any'} GBP")

    if company_profile.get("sustainability_focus"):
        lines.append("**Sustainability Focus:** Yes")
        if keywords := company_profile.get("sustainability_keywords"):
            lines.append(f"**Sustainability Keywords:** {', '.join(keywords)}")

    return "\n".join(lines) if lines else "Limited company profile data"


def _build_compliance_context(compliance_results: dict[str, Any] | None) -> str:
    """Extract relevant info from compliance analysis."""
    if not compliance_results:
        return "No compliance analysis available yet"

    lines = []

    if status := compliance_results.get("overallStatus"):
        lines.append(f"Overall Compliance: {status}")

    if score := compliance_results.get("complianceScore"):
        lines.append(f"Compliance Score: {score}%")

    # List mandatory requirements status
    if mandatory := compliance_results.get("mandatoryRequirements"):
        lines.append("\nMandatory Requirements:")
        for req in mandatory[:5]:
            lines.append(f"  - {req.get('requirement')}: {req.get('status')}")

    # List action items
    if actions := compliance_results.get("actionItems"):
        lines.append("\nCompliance Actions Needed:")
        for action in actions[:5]:
            lines.append(f"  - [{action.get('priority')}] {action.get('action')}")

    return "\n".join(lines) if lines else "No compliance details available"


def _build_fallback_gap_analysis(company_profile: dict[str, Any] | None) -> dict[str, Any]:
    """Build fallback gap analysis when LLM fails."""
    has_profile = bool(company_profile and company_profile.get("company_name"))

    return {
        "overallScore": 50 if has_profile else 0,
        "overallStatus": "partial_match" if has_profile else "significant_gaps",
        "bidRecommendation": "needs_work",
        "summary": "Gap analysis could not be fully completed. Please review tender requirements manually."
        if has_profile
        else "Complete your company profile to enable gap analysis.",
        "dimensions": [
            {
                "name": "Technical Skills & Experience",
                "score": 50 if has_profile else 0,
                "status": "partial" if has_profile else "critical_gap",
                "matches": [],
                "gaps": [
                    {
                        "requirement": "Technical requirements assessment",
                        "gap": "Unable to assess" if not has_profile else "Review needed",
                        "impact": "high",
                        "remediation": "Complete company profile" if not has_profile else "Manual review required",
                        "timeframe": "immediate",
                    }
                ],
            },
            {
                "name": "Certifications & Accreditations",
                "score": _calc_cert_score(company_profile),
                "status": "partial",
                "matches": _get_cert_matches(company_profile),
                "gaps": [],
            },
            {
                "name": "Past Performance & References",
                "score": 0,
                "status": "critical_gap",
                "matches": [],
                "gaps": [
                    {
                        "requirement": "Relevant case studies",
                        "gap": "No case studies in profile",
                        "impact": "high",
                        "remediation": "Add relevant project examples to profile",
                        "timeframe": "short_term",
                    }
                ],
            },
            {
                "name": "Capacity & Resources",
                "score": 50,
                "status": "partial",
                "matches": [],
                "gaps": [],
            },
            {
                "name": "Social Value Capability",
                "score": 25 if company_profile and company_profile.get("sustainability_focus") else 0,
                "status": "gap",
                "matches": [],
                "gaps": [
                    {
                        "requirement": "Social Value commitments",
                        "gap": "Limited social value evidence",
                        "impact": "medium",
                        "remediation": "Develop Social Value policy and evidence",
                        "timeframe": "short_term",
                    }
                ],
            },
        ],
        "actionPlan": [
            {
                "action": "Complete company profile with services, certifications, and expertise",
                "category": "Profile",
                "priority": "critical",
                "deadline": "Before analysis",
                "owner": "User",
                "impact": "Enables accurate gap analysis",
            }
        ],
        "strengthsToHighlight": [],
        "riskAssessment": {
            "winProbability": "low",
            "keyRisks": [
                {
                    "risk": "Incomplete profile prevents accurate assessment",
                    "likelihood": "high",
                    "impact": "high",
                    "mitigation": "Complete profile before bidding",
                }
            ],
            "dealBreakers": [],
        },
        "visualData": {
            "radarChart": [
                {"dimension": "Technical Skills", "score": 50, "benchmark": 70},
                {"dimension": "Certifications", "score": _calc_cert_score(company_profile), "benchmark": 80},
                {"dimension": "Past Performance", "score": 0, "benchmark": 70},
                {"dimension": "Capacity", "score": 50, "benchmark": 65},
                {"dimension": "Social Value", "score": 25, "benchmark": 50},
            ],
            "gapSeverity": {"critical": 2, "high": 2, "medium": 1, "low": 0},
        },
    }


def _calc_cert_score(profile: dict[str, Any] | None) -> int:
    """Calculate certification score from profile."""
    if not profile:
        return 0
    certs = profile.get("certifications", [])
    if not certs:
        return 0
    # Basic scoring: more certs = higher score, max 100
    return min(len(certs) * 20, 100)


def _get_cert_matches(profile: dict[str, Any] | None) -> list[dict]:
    """Get certification matches from profile."""
    if not profile:
        return []
    certs = profile.get("certifications", [])
    return [
        {
            "requirement": cert,
            "capability": f"Holds {cert}",
            "evidence": "Certificate on file",
        }
        for cert in certs
    ]
