"""
Framework Detector Tool - Identify UK procurement framework type

Detects:
- CCS frameworks (G-Cloud, MCF, Construction, FM, Technology Services)
- NHS frameworks (SBS, LPP)
- Local authority frameworks
- Open tenders
"""

import re
from typing import Any

from langchain_core.tools import tool


# Framework detection patterns
FRAMEWORK_PATTERNS = {
    "ccs_gcloud": {
        "patterns": [
            r"g-?cloud",
            r"digital\s+marketplace",
            r"technology\s+services\s+\d",
            r"ts\s*\d",
        ],
        "keywords": ["g-cloud", "digital marketplace", "cloud software", "cloud hosting", "cloud support"],
        "buyer_patterns": ["crown commercial", "ccs"],
    },
    "ccs_mcf": {
        "patterns": [
            r"management\s+consultancy\s+framework",
            r"mcf\s*\d",
            r"mcf4",
        ],
        "keywords": ["management consultancy", "consultancy services", "professional services"],
        "buyer_patterns": ["crown commercial", "ccs"],
    },
    "ccs_construction": {
        "patterns": [
            r"construction\s+professional\s+services",
            r"cps\s*\d",
            r"construction\s+works",
        ],
        "keywords": ["construction", "building works", "civil engineering", "architectural"],
        "buyer_patterns": ["crown commercial", "ccs"],
    },
    "ccs_fm": {
        "patterns": [
            r"facilities\s+management",
            r"fm\s+services",
            r"workplace\s+services",
        ],
        "keywords": ["facilities management", "workplace", "building maintenance", "cleaning"],
        "buyer_patterns": ["crown commercial", "ccs"],
    },
    "ccs_technology": {
        "patterns": [
            r"technology\s+services\s+\d",
            r"ts\s*\d",
            r"technology\s+products",
        ],
        "keywords": ["technology", "it services", "software", "hardware"],
        "buyer_patterns": ["crown commercial", "ccs"],
    },
    "nhs_sbs": {
        "patterns": [
            r"nhs\s+shared\s+business\s+services",
            r"sbs\s+framework",
        ],
        "keywords": ["nhs", "healthcare", "clinical", "medical"],
        "buyer_patterns": ["nhs", "shared business services", "sbs"],
    },
    "nhs_lpp": {
        "patterns": [
            r"london\s+procurement\s+partnership",
            r"lpp\s+framework",
        ],
        "keywords": ["nhs", "london", "healthcare"],
        "buyer_patterns": ["london procurement partnership", "lpp"],
    },
    "espo": {
        "patterns": [
            r"eastern\s+shires\s+purchasing",
            r"espo",
        ],
        "keywords": ["local authority", "education", "schools"],
        "buyer_patterns": ["espo", "eastern shires"],
    },
    "ypo": {
        "patterns": [
            r"yorkshire\s+purchasing",
            r"ypo",
        ],
        "keywords": ["local authority", "education"],
        "buyer_patterns": ["ypo", "yorkshire purchasing"],
    },
}

# CPV code to sector mapping for framework hints
CPV_FRAMEWORK_HINTS = {
    "72": "ccs_gcloud",  # IT services
    "79": "ccs_mcf",     # Business/consultancy services
    "45": "ccs_construction",  # Construction
    "50": "ccs_fm",      # Repair/maintenance
    "90": "ccs_fm",      # Sewage, refuse, cleaning
    "85": "nhs_sbs",     # Health services
    "33": "nhs_sbs",     # Medical equipment
}


@tool
def detect_framework_type(tender_data: dict[str, Any]) -> str:
    """
    Detect the procurement framework type from tender data.

    Args:
        tender_data: Tender document data

    Returns:
        Framework type identifier (e.g., 'ccs_gcloud', 'open_tender')
    """
    title = (tender_data.get("title") or "").lower()
    description = (tender_data.get("description") or "").lower()
    buyer = (tender_data.get("buyer_name") or tender_data.get("buyerName") or "").lower()
    cpv_codes = tender_data.get("cpv_codes") or tender_data.get("cpvCodes") or []

    # Combine text for pattern matching
    full_text = f"{title} {description}"

    # Check each framework pattern
    scores = {}

    for framework_id, config in FRAMEWORK_PATTERNS.items():
        score = 0

        # Check regex patterns (strongest signal)
        for pattern in config["patterns"]:
            if re.search(pattern, full_text, re.IGNORECASE):
                score += 10

        # Check keywords
        for keyword in config["keywords"]:
            if keyword in full_text:
                score += 2

        # Check buyer patterns
        for buyer_pattern in config["buyer_patterns"]:
            if buyer_pattern in buyer:
                score += 5

        if score > 0:
            scores[framework_id] = score

    # Check CPV codes for hints
    for cpv in cpv_codes:
        prefix = str(cpv)[:2]
        if prefix in CPV_FRAMEWORK_HINTS:
            hint_framework = CPV_FRAMEWORK_HINTS[prefix]
            scores[hint_framework] = scores.get(hint_framework, 0) + 3

    # Return highest scoring framework or 'open_tender'
    if scores:
        best_match = max(scores, key=scores.get)
        if scores[best_match] >= 5:  # Minimum confidence threshold
            return best_match

    return "open_tender"


def get_framework_info(framework_type: str) -> dict[str, Any]:
    """
    Get detailed information about a framework type.

    Args:
        framework_type: Framework identifier

    Returns:
        Framework details including typical evaluation criteria
    """
    frameworks = {
        "ccs_gcloud": {
            "name": "G-Cloud",
            "fullName": "G-Cloud Framework",
            "operator": "Crown Commercial Service",
            "typicalEvaluation": {"quality": 80, "price": 20, "socialValue": 10},
            "mandatoryCertifications": ["Cyber Essentials"],
            "keyRequirements": [
                "Central Digital Platform registration",
                "Service definitions in Digital Marketplace",
                "Rate cards and pricing",
            ],
            "socialValueMinimum": 10,
        },
        "ccs_mcf": {
            "name": "MCF4",
            "fullName": "Management Consultancy Framework 4",
            "operator": "Crown Commercial Service",
            "typicalEvaluation": {"quality": 80, "price": 10, "socialValue": 10},
            "mandatoryCertifications": [],
            "keyRequirements": [
                "Rate cards (advice and delivery)",
                "CVs for key personnel",
                "Relevant case studies",
            ],
            "socialValueMinimum": 10,
        },
        "ccs_construction": {
            "name": "CPS",
            "fullName": "Construction Professional Services",
            "operator": "Crown Commercial Service",
            "typicalEvaluation": {"quality": 70, "price": 30, "socialValue": 10},
            "mandatoryCertifications": ["Professional body membership"],
            "keyRequirements": [
                "Project delivery capacity",
                "BIM capability",
                "Health & Safety credentials",
            ],
            "socialValueMinimum": 10,
        },
        "ccs_fm": {
            "name": "FM",
            "fullName": "Facilities Management & Workplace Services",
            "operator": "Crown Commercial Service",
            "typicalEvaluation": {"quality": 60, "price": 30, "socialValue": 10},
            "mandatoryCertifications": ["ISO 9001", "ISO 14001"],
            "keyRequirements": [
                "TUPE transfer capability",
                "Mobilization plan",
                "24/7 service desk",
            ],
            "socialValueMinimum": 10,
        },
        "nhs_sbs": {
            "name": "NHS SBS",
            "fullName": "NHS Shared Business Services Framework",
            "operator": "NHS SBS",
            "typicalEvaluation": {"quality": 60, "price": 40, "socialValue": 0},
            "mandatoryCertifications": ["CQC registration (if applicable)"],
            "keyRequirements": [
                "NHS experience",
                "Clinical governance",
                "Information governance",
            ],
            "socialValueMinimum": 0,
        },
        "open_tender": {
            "name": "Open Tender",
            "fullName": "Open Procurement Procedure",
            "operator": "Various",
            "typicalEvaluation": {"quality": 60, "price": 40, "socialValue": 10},
            "mandatoryCertifications": [],
            "keyRequirements": [
                "Meet Selection Questionnaire criteria",
                "Comply with evaluation criteria",
                "Submit before deadline",
            ],
            "socialValueMinimum": 10,
        },
    }

    return frameworks.get(framework_type, frameworks["open_tender"])
