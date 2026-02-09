"""
Tender Context Tool - Fetch tender details from database
"""

import os
from typing import Any

import httpx
from langchain_core.tools import tool


# Base URL for the Next.js API (will be localhost in dev, production URL otherwise)
API_BASE_URL = os.getenv("NEXT_API_URL", "http://localhost:3000")


@tool
def get_tender_details(tender_ocid: str) -> dict[str, Any] | None:
    """
    Fetch tender details from the RFP.quest database.

    Args:
        tender_ocid: The Open Contracting ID (OCID) of the tender

    Returns:
        Tender data dict or None if not found
    """
    try:
        # Call the Next.js API endpoint
        response = httpx.get(
            f"{API_BASE_URL}/api/tenders/{tender_ocid}",
            timeout=10.0,
        )

        if response.status_code == 200:
            data = response.json()
            return _normalize_tender_data(data)
        elif response.status_code == 404:
            return None
        else:
            print(f"API error: {response.status_code}")
            return None

    except httpx.RequestError as e:
        print(f"Request error fetching tender: {e}")
        return None
    except Exception as e:
        print(f"Error fetching tender: {e}")
        return None


def _normalize_tender_data(data: dict[str, Any]) -> dict[str, Any]:
    """Normalize tender data to consistent field names."""
    return {
        "ocid": data.get("ocid"),
        "title": data.get("title"),
        "description": data.get("description"),
        "buyer_name": data.get("buyerName") or data.get("buyer_name"),
        "buyer_id": data.get("buyerId") or data.get("buyer_id"),
        "value_min": data.get("valueMin") or data.get("value_min"),
        "value_max": data.get("valueMax") or data.get("value_max"),
        "currency": data.get("currency", "GBP"),
        "tender_start_date": data.get("tenderStartDate") or data.get("tender_start_date"),
        "tender_end_date": data.get("tenderEndDate") or data.get("tender_end_date") or data.get("deadline"),
        "contract_start_date": data.get("contractStartDate") or data.get("contract_start_date"),
        "contract_end_date": data.get("contractEndDate") or data.get("contract_end_date"),
        "published_date": data.get("publishedDate") or data.get("published_date"),
        "cpv_codes": data.get("cpvCodes") or data.get("cpv_codes") or [],
        "region": data.get("region"),
        "status": data.get("status"),
        "stage": data.get("stage"),
        "source": data.get("source", "find-a-tender"),
    }


def get_tender_by_slug(slug: str) -> dict[str, Any] | None:
    """
    Fetch tender by URL slug.

    Args:
        slug: URL-friendly tender identifier

    Returns:
        Tender data dict or None if not found
    """
    try:
        response = httpx.get(
            f"{API_BASE_URL}/api/tenders/{slug}",
            timeout=10.0,
        )

        if response.status_code == 200:
            data = response.json()
            return _normalize_tender_data(data)
        return None

    except Exception as e:
        print(f"Error fetching tender by slug: {e}")
        return None


def search_similar_tenders(
    cpv_codes: list[str] | None = None,
    buyer_name: str | None = None,
    limit: int = 5,
) -> list[dict[str, Any]]:
    """
    Search for similar tenders for context.

    Args:
        cpv_codes: CPV codes to match
        buyer_name: Buyer organization name
        limit: Maximum results

    Returns:
        List of similar tenders
    """
    try:
        params = {"limit": limit}
        if cpv_codes:
            params["cpvDivisions"] = ",".join([c[:2] for c in cpv_codes])
        if buyer_name:
            params["buyerName"] = buyer_name

        response = httpx.get(
            f"{API_BASE_URL}/api/tenders/search",
            params=params,
            timeout=10.0,
        )

        if response.status_code == 200:
            data = response.json()
            return [_normalize_tender_data(t) for t in data.get("tenders", [])]
        return []

    except Exception as e:
        print(f"Error searching tenders: {e}")
        return []
