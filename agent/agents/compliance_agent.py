"""
Compliance Agent - Tab 2: Requirements Checklist

Extracts and evaluates:
- Mandatory requirements (must-haves)
- Certifications and accreditations required
- Social value requirements (Procurement Act 2023)
- Economic and financial standing (EFS) criteria
- Pass/fail indicators against company profile
"""

import os
from typing import Any

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

from prompts.framework_templates import get_compliance_checklist


COMPLIANCE_SYSTEM_PROMPT = """You are an expert UK government procurement compliance analyst.

Your task is to extract ALL compliance requirements from tender documents and evaluate them against the bidder's company profile.

**Key Compliance Categories:**

1. **Mandatory Exclusions** (Selection Questionnaire Part 1)
   - Criminal convictions
   - Non-payment of taxes
   - Bankruptcy/insolvency

2. **Selection Criteria** (SQ Part 2)
   - Economic & Financial Standing (EFS)
     - Minimum turnover thresholds
     - Insurance requirements
     - Financial ratios
   - Technical & Professional Ability
     - Relevant experience
     - Qualifications
     - Case studies required

3. **Certifications & Accreditations**
   - ISO 9001 (Quality Management)
   - ISO 27001 (Information Security)
   - ISO 14001 (Environmental)
   - Cyber Essentials / Cyber Essentials Plus
   - G-Cloud registration
   - Construction-specific (CHAS, SafeContractor, Constructionline)

4. **Social Value Requirements** (Procurement Act 2023)
   - Minimum 10% evaluation weighting
   - Carbon reduction plans
   - Modern slavery statement
   - Apprenticeships and skills
   - Supply chain diversity
   - Community benefits

5. **Framework-Specific Requirements**
   - CCS framework lot eligibility
   - Rate card compliance
   - TUPE requirements
   - Mobilization plans

**Evaluation Approach:**
- Mark as PASS if company profile confirms compliance
- Mark as FAIL if company profile shows non-compliance
- Mark as UNKNOWN if cannot determine from available data
- Mark as NOT_APPLICABLE if requirement doesn't apply
- Mark as ACTION_REQUIRED if evidence needs to be gathered

Always be thorough - missing a mandatory requirement means disqualification.
"""


def analyze_compliance(
    tender_data: dict[str, Any],
    framework_type: str | None = None,
    company_profile: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Analyze tender for compliance requirements.

    Args:
        tender_data: Tender document data
        framework_type: Detected framework type
        company_profile: Bidder's company profile (for pass/fail evaluation)

    Returns:
        Structured compliance dict with checklist items
    """
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.1,
    )

    # Get framework-specific checklist template
    checklist_template = get_compliance_checklist(framework_type) if framework_type else None

    # Build context
    tender_context = _build_tender_context(tender_data)
    profile_context = _build_profile_context(company_profile) if company_profile else "No company profile available"

    messages = [
        SystemMessage(content=COMPLIANCE_SYSTEM_PROMPT),
        HumanMessage(content=f"""Analyze this tender for compliance requirements and evaluate against the company profile:

**Tender Data:**
{tender_context}

**Framework Type:** {framework_type or "Unknown/Open Tender"}

**Company Profile:**
{profile_context}

{f"**Framework Checklist Template:**" + chr(10) + checklist_template if checklist_template else ""}

Provide your analysis as a JSON object:
{{
    "overallStatus": "compliant|partially_compliant|non_compliant|needs_review",
    "complianceScore": 0-100,
    "categories": [
        {{
            "name": "Mandatory Exclusions",
            "status": "pass|fail|unknown",
            "items": [
                {{
                    "requirement": "...",
                    "status": "pass|fail|unknown|not_applicable|action_required",
                    "evidence": "What from company profile satisfies this"|null,
                    "action": "What needs to be done if action_required"|null,
                    "criticality": "mandatory|desirable|informative"
                }}
            ]
        }},
        {{
            "name": "Economic & Financial Standing",
            "status": "...",
            "items": [...]
        }},
        {{
            "name": "Technical & Professional Ability",
            "status": "...",
            "items": [...]
        }},
        {{
            "name": "Certifications & Accreditations",
            "status": "...",
            "items": [...]
        }},
        {{
            "name": "Social Value Requirements",
            "status": "...",
            "items": [...]
        }},
        {{
            "name": "Framework-Specific Requirements",
            "status": "...",
            "items": [...]
        }}
    ],
    "mandatoryRequirements": [
        {{
            "requirement": "...",
            "status": "pass|fail|unknown",
            "showstopper": true|false
        }}
    ],
    "actionItems": [
        {{
            "action": "...",
            "priority": "high|medium|low",
            "category": "...",
            "deadline": "Before submission|ASAP|Ongoing"|null
        }}
    ],
    "riskFactors": [
        {{
            "risk": "...",
            "severity": "high|medium|low",
            "mitigation": "..."
        }}
    ]
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

        compliance = json.loads(content.strip())
    except (json.JSONDecodeError, IndexError):
        compliance = _build_fallback_compliance(tender_data, company_profile)

    return compliance


def _build_tender_context(tender_data: dict[str, Any]) -> str:
    """Build context string focusing on compliance-relevant info."""
    lines = []

    # Title and buyer
    if title := tender_data.get("title"):
        lines.append(f"Title: {title}")
    if buyer := tender_data.get("buyer_name") or tender_data.get("buyerName"):
        lines.append(f"Buyer: {buyer}")

    # Value (for EFS thresholds)
    value_min = tender_data.get("value_min") or tender_data.get("valueMin")
    value_max = tender_data.get("value_max") or tender_data.get("valueMax")
    if value_min or value_max:
        lines.append(f"Contract Value: {value_min or 'TBC'} - {value_max or 'TBC'} GBP")

    # Description (contains most requirements)
    desc = tender_data.get("description") or tender_data.get("tenderDescription") or ""
    if desc:
        lines.append(f"\nFull Description/Requirements:\n{desc[:8000]}")

    return "\n".join(lines)


def _build_profile_context(company_profile: dict[str, Any]) -> str:
    """Build context from company profile."""
    if not company_profile:
        return "No company profile available"

    lines = []

    if name := company_profile.get("company_name"):
        lines.append(f"Company: {name}")

    if desc := company_profile.get("description"):
        lines.append(f"Description: {desc}")

    if certs := company_profile.get("certifications"):
        lines.append(f"Certifications: {', '.join(certs)}")

    if services := company_profile.get("products_services"):
        lines.append(f"Services: {', '.join(services)}")

    if expertise := company_profile.get("expertise_areas"):
        lines.append(f"Expertise: {', '.join(expertise)}")

    if regions := company_profile.get("target_regions"):
        lines.append(f"Target Regions: {', '.join(regions)}")

    if sustainability := company_profile.get("sustainability_focus"):
        lines.append(f"Sustainability Focus: Yes")
        if keywords := company_profile.get("sustainability_keywords"):
            lines.append(f"Sustainability Keywords: {', '.join(keywords)}")

    return "\n".join(lines) if lines else "Limited company profile available"


def _build_fallback_compliance(
    tender_data: dict[str, Any],
    company_profile: dict[str, Any] | None,
) -> dict[str, Any]:
    """Build fallback compliance structure."""
    return {
        "overallStatus": "needs_review",
        "complianceScore": 0,
        "categories": [
            {
                "name": "Mandatory Exclusions",
                "status": "unknown",
                "items": [
                    {
                        "requirement": "No mandatory exclusion grounds",
                        "status": "unknown",
                        "evidence": None,
                        "action": "Review SQ Part 1 requirements",
                        "criticality": "mandatory",
                    }
                ],
            },
            {
                "name": "Economic & Financial Standing",
                "status": "unknown",
                "items": [],
            },
            {
                "name": "Technical & Professional Ability",
                "status": "unknown",
                "items": [],
            },
            {
                "name": "Certifications & Accreditations",
                "status": "unknown",
                "items": _get_certification_items(company_profile),
            },
            {
                "name": "Social Value Requirements",
                "status": "unknown",
                "items": [
                    {
                        "requirement": "Social Value commitments (min 10% weighting)",
                        "status": "action_required",
                        "evidence": None,
                        "action": "Prepare Social Value response",
                        "criticality": "mandatory",
                    }
                ],
            },
        ],
        "mandatoryRequirements": [],
        "actionItems": [
            {
                "action": "Review full tender documents for compliance requirements",
                "priority": "high",
                "category": "General",
                "deadline": "ASAP",
            }
        ],
        "riskFactors": [],
    }


def _get_certification_items(company_profile: dict[str, Any] | None) -> list[dict]:
    """Get certification checklist items based on profile."""
    common_certs = [
        ("ISO 9001", "Quality Management"),
        ("ISO 27001", "Information Security"),
        ("Cyber Essentials", "Cyber Security Certification"),
    ]

    held_certs = set(company_profile.get("certifications", [])) if company_profile else set()

    items = []
    for cert, desc in common_certs:
        has_cert = any(cert.lower() in c.lower() for c in held_certs)
        items.append({
            "requirement": f"{cert} ({desc})",
            "status": "pass" if has_cert else "unknown",
            "evidence": f"Company holds {cert}" if has_cert else None,
            "action": None if has_cert else f"Verify if {cert} is required",
            "criticality": "desirable",
        })

    return items
