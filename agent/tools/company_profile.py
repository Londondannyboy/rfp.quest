"""
Company Profile Tool - Fetch company profile from database for gap analysis
"""

import os
from typing import Any

import httpx
from langchain_core.tools import tool


API_BASE_URL = os.getenv("NEXT_API_URL", "http://localhost:3000")


@tool
def get_company_profile(user_id: str) -> dict[str, Any] | None:
    """
    Fetch company profile for a user from the database.

    Args:
        user_id: The user's UUID

    Returns:
        Company profile dict or None if not found
    """
    try:
        response = httpx.get(
            f"{API_BASE_URL}/api/company-profile",
            params={"userId": user_id},
            timeout=10.0,
        )

        if response.status_code == 200:
            data = response.json()
            return _normalize_profile(data)
        return None

    except httpx.RequestError as e:
        print(f"Request error fetching profile: {e}")
        return None
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return None


def _normalize_profile(data: dict[str, Any]) -> dict[str, Any]:
    """Normalize company profile to consistent field names."""
    return {
        "id": data.get("id"),
        "user_id": data.get("userId") or data.get("user_id"),
        "company_name": data.get("companyName") or data.get("company_name"),
        "description": data.get("description"),
        "website": data.get("website"),
        "products_services": data.get("productsServices") or data.get("products_services") or [],
        "expertise_areas": data.get("expertiseAreas") or data.get("expertise_areas") or [],
        "certifications": data.get("certifications") or [],
        "target_regions": data.get("targetRegions") or data.get("target_regions") or [],
        "target_cpv_divisions": data.get("targetCpvDivisions") or data.get("target_cpv_divisions") or [],
        "min_contract_value": data.get("minContractValue") or data.get("min_contract_value"),
        "max_contract_value": data.get("maxContractValue") or data.get("max_contract_value"),
        "sustainability_focus": data.get("sustainabilityFocus") or data.get("sustainability_focus", False),
        "sustainability_keywords": data.get("sustainabilityKeywords") or data.get("sustainability_keywords") or [],
    }


def get_profile_completeness(profile: dict[str, Any] | None) -> dict[str, Any]:
    """
    Calculate profile completeness for gap analysis quality.

    Args:
        profile: Company profile dict

    Returns:
        Completeness assessment
    """
    if not profile:
        return {
            "score": 0,
            "status": "missing",
            "missing_fields": [
                "company_name",
                "description",
                "products_services",
                "certifications",
                "expertise_areas",
            ],
            "recommendation": "Complete your company profile to enable accurate gap analysis",
        }

    required_fields = [
        ("company_name", "Company name"),
        ("description", "Company description"),
        ("products_services", "Products/services offered"),
        ("certifications", "Certifications held"),
        ("expertise_areas", "Areas of expertise"),
    ]

    optional_fields = [
        ("website", "Company website"),
        ("target_regions", "Target regions"),
        ("target_cpv_divisions", "Target sectors (CPV)"),
        ("sustainability_focus", "Sustainability focus"),
    ]

    missing_required = []
    missing_optional = []

    for field, label in required_fields:
        value = profile.get(field)
        if not value or (isinstance(value, list) and len(value) == 0):
            missing_required.append(label)

    for field, label in optional_fields:
        value = profile.get(field)
        if not value or (isinstance(value, list) and len(value) == 0):
            missing_optional.append(label)

    # Calculate score
    total_required = len(required_fields)
    filled_required = total_required - len(missing_required)
    score = int((filled_required / total_required) * 100)

    if score >= 80:
        status = "complete"
    elif score >= 50:
        status = "partial"
    else:
        status = "incomplete"

    return {
        "score": score,
        "status": status,
        "missing_required": missing_required,
        "missing_optional": missing_optional,
        "recommendation": (
            "Your profile is ready for gap analysis"
            if status == "complete"
            else f"Add {', '.join(missing_required[:3])} to improve analysis accuracy"
        ),
    }
