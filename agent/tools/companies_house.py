"""
Companies House Tool - Buyer intelligence from UK company filings

Fetches company data, financial metrics, SECR/sustainability data,
risk signals, and decision makers from Companies House.
"""

import os
import re
import tempfile
from typing import Any, Optional
from datetime import datetime

import httpx
import fitz  # PyMuPDF
from langchain_core.tools import tool


# API Configuration
CH_API_BASE = "https://api.company-information.service.gov.uk"
CH_API_KEY = os.getenv("COMPANIES_HOUSE_API_KEY")

# SECR search terms
SECR_TERMS = [
    "SECR", "Streamlined Energy and Carbon Reporting",
    "Scope 1", "Scope 2", "Scope 3",
    "greenhouse gas", "GHG", "carbon footprint",
    "energy consumption", "emissions", "net zero", "carbon neutral"
]

# Risk signal terms
RISK_TERMS = {
    "going_concern": ["material uncertainty", "going concern", "substantial doubt", "ability to continue"],
    "audit_issues": ["qualified opinion", "except for", "scope limitation", "emphasis of matter"],
    "covenant": ["breach", "covenant", "default", "waiver", "renegotiated"],
    "litigation": ["litigation", "contingent liability", "legal proceedings", "legal dispute"],
    "liquidity": ["negative operating cash flow", "overdraft", "working capital deficiency"]
}


def _get_auth() -> tuple[str, str]:
    """Get HTTP Basic Auth tuple for Companies House API."""
    api_key = CH_API_KEY or os.getenv("COMPANIES_HOUSE_API_KEY", "")
    return (api_key, "")


@tool
def get_company_info(company_number: str) -> dict[str, Any]:
    """
    Get company profile from Companies House.

    Args:
        company_number: UK company number (e.g., "07524813")

    Returns:
        Company profile with name, status, SIC codes, officers, etc.
    """
    try:
        response = httpx.get(
            f"{CH_API_BASE}/company/{company_number}",
            auth=_get_auth(),
            timeout=30.0
        )

        if response.status_code == 200:
            data = response.json()
            return {
                "company_number": company_number,
                "company_name": data.get("company_name"),
                "company_status": data.get("company_status"),
                "company_type": data.get("type"),
                "date_of_creation": data.get("date_of_creation"),
                "sic_codes": data.get("sic_codes", []),
                "registered_office": data.get("registered_office_address", {}),
                "accounts": data.get("accounts", {}),
                "has_charges": data.get("has_charges", False),
                "has_insolvency_history": data.get("has_insolvency_history", False),
            }
        elif response.status_code == 404:
            return {"error": f"Company {company_number} not found"}
        else:
            return {"error": f"API error: {response.status_code}"}

    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}


@tool
def get_company_officers(company_number: str) -> dict[str, Any]:
    """
    Get company officers (directors, secretaries) for decision maker discovery.

    Args:
        company_number: UK company number

    Returns:
        List of current officers with names and roles
    """
    try:
        response = httpx.get(
            f"{CH_API_BASE}/company/{company_number}/officers",
            auth=_get_auth(),
            timeout=30.0
        )

        if response.status_code == 200:
            data = response.json()
            officers = []

            for item in data.get("items", []):
                # Only include active officers
                if item.get("resigned_on"):
                    continue

                officers.append({
                    "name": item.get("name"),
                    "role": item.get("officer_role"),
                    "appointed_on": item.get("appointed_on"),
                    "occupation": item.get("occupation"),
                    "nationality": item.get("nationality"),
                })

            return {
                "company_number": company_number,
                "officers": officers,
                "total_active": len(officers)
            }
        else:
            return {"error": f"API error: {response.status_code}"}

    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}


@tool
def get_filing_history(
    company_number: str,
    category: str = "accounts",
    max_results: int = 5
) -> dict[str, Any]:
    """
    Get company filing history filtered by category.

    Args:
        company_number: UK company number
        category: Filing category - "accounts", "confirmation-statement", etc.
        max_results: Maximum filings to return

    Returns:
        List of recent filings with metadata and document URLs
    """
    try:
        params = {"category": category, "items_per_page": max_results}
        response = httpx.get(
            f"{CH_API_BASE}/company/{company_number}/filing-history",
            auth=_get_auth(),
            params=params,
            timeout=30.0
        )

        if response.status_code == 200:
            data = response.json()
            filings = []

            for item in data.get("items", []):
                filing = {
                    "date": item.get("date"),
                    "type": item.get("type"),
                    "description": item.get("description"),
                    "pages": item.get("pages"),
                    "made_up_date": item.get("description_values", {}).get("made_up_date"),
                }

                # Get document URL if available
                if links := item.get("links", {}):
                    if doc_meta := links.get("document_metadata"):
                        filing["document_url"] = doc_meta

                filings.append(filing)

            return {
                "company_number": company_number,
                "category": category,
                "filings": filings,
                "total_count": data.get("total_count", 0)
            }
        else:
            return {"error": f"API error: {response.status_code}"}

    except Exception as e:
        return {"error": f"Request failed: {str(e)}"}


def _download_pdf(document_url: str) -> Optional[bytes]:
    """Download PDF from Companies House document API."""
    try:
        # First get the document metadata to get actual download URL
        response = httpx.get(
            document_url,
            auth=_get_auth(),
            timeout=30.0,
            headers={"Accept": "application/json"}
        )

        if response.status_code == 200:
            metadata = response.json()
            # Get the PDF download URL (already a full URL)
            if links := metadata.get("links", {}):
                if pdf_url := links.get("document"):
                    # Download the actual PDF - URL is already complete
                    pdf_response = httpx.get(
                        pdf_url,
                        auth=_get_auth(),
                        timeout=60.0,
                        headers={"Accept": "application/pdf"},
                        follow_redirects=True
                    )
                    if pdf_response.status_code == 200:
                        return pdf_response.content
        return None
    except Exception as e:
        print(f"PDF download error: {e}")
        return None


def _extract_text_from_pdf(pdf_bytes: bytes, max_pages: int = 50) -> dict[str, Any]:
    """Extract text from PDF bytes using PyMuPDF."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        total_pages = len(doc)

        pages_text = []
        for i in range(min(total_pages, max_pages)):
            page = doc[i]
            text = page.get_text()
            if text.strip():
                pages_text.append({
                    "page": i + 1,
                    "text": text
                })

        doc.close()

        full_text = "\n\n".join([p["text"] for p in pages_text])

        return {
            "total_pages": total_pages,
            "pages_extracted": len(pages_text),
            "full_text": full_text,
            "is_searchable": len(full_text) > 100
        }
    except Exception as e:
        return {"error": f"PDF extraction failed: {str(e)}"}


def _extract_with_vision(pdf_bytes: bytes, max_pages: int = 15) -> dict[str, Any]:
    """
    Extract SECR/sustainability data from image-based PDF using GPT-4o Vision.

    Args:
        pdf_bytes: PDF file content
        max_pages: Maximum pages to analyze

    Returns:
        Extracted sustainability data
    """
    import base64

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {"error": "OpenAI API key not configured for Vision extraction"}

    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        total_pages = len(doc)

        # Strategic page sampling for large reports
        # SECR data is typically in pages 40-80 of annual reports
        sample_pages = []

        if total_pages <= max_pages:
            sample_pages = list(range(total_pages))
        elif total_pages > 150:
            # Large annual report - sample strategic pages
            sample_pages.extend([0, 1, 2])  # Summary pages
            sample_pages.extend(range(39, min(65, total_pages)))  # Strategic report section
            sample_pages.extend(range(79, min(95, total_pages)))  # Environmental data
        else:
            # Medium report - sample throughout
            sample_pages.extend([0, 1, 2])
            step = total_pages // (max_pages - 3)
            sample_pages.extend(range(3, total_pages, max(1, step)))

        sample_pages = sorted(set(sample_pages))[:max_pages]

        # Convert pages to base64 images
        images_base64 = []
        for page_num in sample_pages:
            page = doc[page_num]
            # Render at 150 DPI for good quality without huge files
            pix = page.get_pixmap(matrix=fitz.Matrix(150/72, 150/72))
            img_bytes = pix.tobytes("png")
            img_base64 = base64.b64encode(img_bytes).decode("utf-8")
            images_base64.append({
                "page": page_num + 1,
                "base64": img_base64
            })

        doc.close()

        if not images_base64:
            return {"error": "No pages to analyze"}

        # Build message for OpenAI Vision
        content = [
            {
                "type": "text",
                "text": """Analyze these pages from a UK company annual report and extract SECR (Streamlined Energy and Carbon Reporting) and sustainability data.

Look for and extract:
1. UK energy consumption (in kWh) - MANDATORY for SECR
2. Scope 1 emissions (tonnes CO2e) - direct emissions
3. Scope 2 emissions (tonnes CO2e) - electricity
4. Scope 3 emissions (tonnes CO2e) - supply chain (if reported)
5. Emissions intensity ratio (e.g., tonnes CO2e per £m revenue)
6. Net zero target year
7. Financial auditor name
8. Carbon verifier/consultant (if mentioned)

Return JSON format:
{
    "secr_found": true/false,
    "uk_energy_kwh": number or null,
    "scope1_tonnes": number or null,
    "scope2_tonnes": number or null,
    "scope3_tonnes": number or null,
    "total_emissions_tonnes": number or null,
    "intensity_ratio": "value with units" or null,
    "net_zero_year": number or null,
    "methodology": "GHG Protocol" or other,
    "verifier": "company name" or null,
    "key_findings": ["list of notable sustainability commitments"]
}"""
            }
        ]

        # Add images (limit to ~10 to avoid token limits)
        for img in images_base64[:10]:
            content.append({
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/png;base64,{img['base64']}",
                    "detail": "low"  # Use low detail to reduce tokens
                }
            })

        # Call OpenAI Vision API
        response = httpx.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": content}],
                "max_tokens": 1500,
            },
            timeout=120.0
        )

        if response.status_code != 200:
            return {"error": f"OpenAI API error: {response.status_code}"}

        result = response.json()
        answer = result.get("choices", [{}])[0].get("message", {}).get("content", "")

        # Try to parse JSON from response
        import json
        try:
            # Find JSON in response
            json_start = answer.find("{")
            json_end = answer.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                extracted_data = json.loads(answer[json_start:json_end])
                return {
                    "method": "vision",
                    "pages_analyzed": len(images_base64),
                    "total_pages": total_pages,
                    "data": extracted_data
                }
        except json.JSONDecodeError:
            pass

        return {
            "method": "vision",
            "pages_analyzed": len(images_base64),
            "raw_response": answer[:1000]
        }

    except Exception as e:
        return {"error": f"Vision extraction failed: {str(e)}"}


def _search_terms_in_text(text: str, terms: list[str]) -> dict[str, Any]:
    """Search for terms in text, return matches with context."""
    text_lower = text.lower()
    matches = {}

    for term in terms:
        term_lower = term.lower()
        count = text_lower.count(term_lower)

        if count > 0:
            # Find snippets containing the term
            snippets = []
            for match in re.finditer(re.escape(term_lower), text_lower):
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 100)
                snippet = text[start:end].strip()
                if snippet and len(snippets) < 3:
                    snippets.append(f"...{snippet}...")

            matches[term] = {
                "found": True,
                "count": count,
                "snippets": snippets
            }
        else:
            matches[term] = {"found": False, "count": 0, "snippets": []}

    return matches


def _detect_risk_signals(text: str) -> dict[str, Any]:
    """Detect risk signals in document text."""
    signals = {}

    for signal_type, terms in RISK_TERMS.items():
        matches = _search_terms_in_text(text, terms)
        found_terms = [t for t, m in matches.items() if m["found"]]

        if found_terms:
            signals[signal_type] = {
                "detected": True,
                "severity": "high" if signal_type in ["going_concern", "audit_issues"] else "medium",
                "terms_found": found_terms,
                "snippets": [s for t, m in matches.items() for s in m.get("snippets", [])[:1]]
            }
        else:
            signals[signal_type] = {"detected": False, "severity": "none"}

    return signals


@tool
def get_buyer_intelligence(company_number: str) -> dict[str, Any]:
    """
    Get comprehensive buyer intelligence for bid writing.

    Combines company profile, officers, and latest accounts analysis
    to provide insights for tailoring bid responses.

    Args:
        company_number: UK company number

    Returns:
        Comprehensive buyer intelligence including:
        - Company profile and status
        - Key decision makers (officers)
        - Financial health indicators
        - Sustainability/SECR data
        - Risk signals
    """
    result = {
        "company_number": company_number,
        "extracted_at": datetime.utcnow().isoformat(),
    }

    # 1. Get company profile
    profile = get_company_info.invoke(company_number)
    if "error" in profile:
        result["error"] = profile["error"]
        return result

    result["profile"] = profile

    # 2. Get officers (decision makers)
    officers = get_company_officers.invoke(company_number)
    if "error" not in officers:
        result["decision_makers"] = officers.get("officers", [])

    # 3. Get latest accounts filing - prefer full/group accounts over interim
    filings = get_filing_history.invoke(company_number)
    if "error" not in filings and filings.get("filings"):
        # Look for full/group accounts first (contain SECR data), fall back to first filing
        target_filing = None
        for filing in filings["filings"]:
            desc = filing.get("description", "").lower()
            # Prefer group, full, or total accounts over interim
            if "group" in desc or "full" in desc or "total" in desc:
                target_filing = filing
                break

        # Fall back to first filing if no full accounts found
        if not target_filing:
            target_filing = filings["filings"][0]

        result["latest_accounts"] = {
            "date": target_filing.get("date"),
            "type": target_filing.get("description"),
            "made_up_to": target_filing.get("made_up_date"),
            "pages": target_filing.get("pages"),
        }

        # 4. Try to download and analyze the accounts PDF
        if doc_url := target_filing.get("document_url"):
            pdf_bytes = _download_pdf(doc_url)

            if pdf_bytes:
                # Extract text
                extraction = _extract_text_from_pdf(pdf_bytes)

                if extraction.get("is_searchable"):
                    text = extraction.get("full_text", "")

                    # Search for SECR terms
                    secr_matches = _search_terms_in_text(text, SECR_TERMS)
                    has_secr = any(m["found"] for m in secr_matches.values())

                    result["sustainability"] = {
                        "has_secr_content": has_secr,
                        "terms_found": [t for t, m in secr_matches.items() if m["found"]],
                        "secr_confidence": "high" if has_secr else "none"
                    }

                    # Detect risk signals
                    risk_signals = _detect_risk_signals(text)
                    active_risks = [k for k, v in risk_signals.items() if v.get("detected")]

                    result["risk_signals"] = {
                        "signals": risk_signals,
                        "risk_level": "high" if "going_concern" in active_risks else
                                     "medium" if active_risks else "low",
                        "active_risks": active_risks
                    }
                else:
                    # PDF is image-based - try Vision extraction if OpenAI is configured
                    vision_result = _extract_with_vision(pdf_bytes)

                    if vision_result.get("data"):
                        data = vision_result["data"]
                        result["sustainability"] = {
                            "has_secr_content": data.get("secr_found", False),
                            "extraction_method": "vision",
                            "pages_analyzed": vision_result.get("pages_analyzed"),
                            "secr_data": {
                                "uk_energy_kwh": data.get("uk_energy_kwh"),
                                "scope1_tonnes": data.get("scope1_tonnes"),
                                "scope2_tonnes": data.get("scope2_tonnes"),
                                "scope3_tonnes": data.get("scope3_tonnes"),
                                "total_emissions_tonnes": data.get("total_emissions_tonnes"),
                                "intensity_ratio": data.get("intensity_ratio"),
                                "net_zero_year": data.get("net_zero_year"),
                                "methodology": data.get("methodology"),
                                "verifier": data.get("verifier"),
                            },
                            "key_findings": data.get("key_findings", []),
                            "secr_confidence": "medium"  # Vision extraction is less certain
                        }
                    elif vision_result.get("error"):
                        result["sustainability"] = {
                            "has_secr_content": None,
                            "note": f"Vision extraction unavailable: {vision_result['error']}"
                        }
                    else:
                        result["sustainability"] = {
                            "has_secr_content": None,
                            "note": "PDF is image-based, Vision extraction did not return structured data"
                        }

    # 5. Generate bid writing insights
    result["bid_insights"] = _generate_bid_insights(result)

    return result


def _generate_bid_insights(intel: dict[str, Any]) -> dict[str, Any]:
    """Generate bid writing recommendations from intelligence."""
    insights = {
        "emphasize": [],
        "consider": [],
        "avoid": []
    }

    profile = intel.get("profile", {})
    sustainability = intel.get("sustainability", {})
    risk_signals = intel.get("risk_signals", {})

    # Company status insights
    if profile.get("company_status") == "active":
        insights["consider"].append("Company is active and in good standing")

    if profile.get("has_insolvency_history"):
        insights["avoid"].append("Company has insolvency history - be cautious about payment terms")

    # Sustainability insights
    if sustainability.get("has_secr_content"):
        insights["emphasize"].append("Highlight your sustainability credentials - buyer reports SECR")
        if "net zero" in [t.lower() for t in sustainability.get("terms_found", [])]:
            insights["emphasize"].append("Mention net zero alignment - buyer has net zero commitments")
    else:
        insights["consider"].append("Buyer may not prioritize sustainability - focus on value/quality")

    # Risk insights
    risk_level = risk_signals.get("risk_level", "low")
    if risk_level == "high":
        insights["avoid"].append("High financial risk signals detected - consider payment guarantees")
    elif risk_level == "medium":
        insights["consider"].append("Some financial concerns noted - review payment terms carefully")

    # Decision maker insights
    officers = intel.get("decision_makers", [])
    if officers:
        directors = [o for o in officers if "director" in o.get("role", "").lower()]
        insights["consider"].append(f"Key contacts: {len(directors)} directors identified")

    return insights


def search_company_by_name(company_name: str) -> dict[str, Any]:
    """
    Search for a company by name to find company number.

    Args:
        company_name: Company name to search for

    Returns:
        Search results with company numbers
    """
    try:
        response = httpx.get(
            f"{CH_API_BASE}/search/companies",
            auth=_get_auth(),
            params={"q": company_name, "items_per_page": 5},
            timeout=30.0
        )

        if response.status_code == 200:
            data = response.json()
            results = []

            for item in data.get("items", []):
                results.append({
                    "company_number": item.get("company_number"),
                    "company_name": item.get("title"),
                    "company_status": item.get("company_status"),
                    "address_snippet": item.get("address_snippet"),
                })

            return {
                "query": company_name,
                "results": results,
                "total_results": data.get("total_results", 0)
            }
        else:
            return {"error": f"Search failed: {response.status_code}"}

    except Exception as e:
        return {"error": f"Search error: {str(e)}"}


# ============================================================================
# Tavily Integration - News, Verification, Decision Maker Discovery
# ============================================================================

def _get_tavily_client():
    """Get Tavily client if API key is configured."""
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        return None
    try:
        from tavily import TavilyClient
        return TavilyClient(api_key=api_key)
    except ImportError:
        return None


def get_company_news(company_name: str, max_results: int = 5) -> dict[str, Any]:
    """
    Get recent news about a company using Tavily.

    Args:
        company_name: Company name to search for
        max_results: Maximum news items to return

    Returns:
        Recent news headlines and summaries
    """
    client = _get_tavily_client()
    if not client:
        return {"error": "Tavily API not configured", "news": []}

    try:
        # Search for recent news
        response = client.search(
            query=f'"{company_name}" news',
            search_depth="advanced",
            max_results=max_results,
            include_answer=True,
        )

        news_items = []
        for result in response.get("results", []):
            news_items.append({
                "title": result.get("title"),
                "url": result.get("url"),
                "snippet": result.get("content", "")[:300],
                "source": result.get("url", "").split("/")[2] if result.get("url") else None,
            })

        return {
            "company_name": company_name,
            "summary": response.get("answer"),
            "news": news_items,
            "news_count": len(news_items)
        }

    except Exception as e:
        return {"error": f"News search failed: {str(e)}", "news": []}


def search_decision_makers(
    company_name: str,
    roles: list[str] = None
) -> dict[str, Any]:
    """
    Search for decision makers at a company using Tavily + LinkedIn.

    Args:
        company_name: Company name
        roles: Specific roles to search for (e.g., ["Head of Procurement", "CTO"])

    Returns:
        Potential decision makers with LinkedIn profiles
    """
    client = _get_tavily_client()
    if not client:
        return {"error": "Tavily API not configured", "decision_makers": []}

    if roles is None:
        roles = [
            "Head of Procurement",
            "Chief Procurement Officer",
            "Procurement Director",
            "Head of Sustainability",
            "Chief Sustainability Officer",
        ]

    decision_makers = []

    try:
        for role in roles[:3]:  # Limit to 3 roles to avoid rate limits
            query = f'site:linkedin.com/in "{company_name}" "{role}"'
            response = client.search(
                query=query,
                search_depth="basic",
                max_results=2,
            )

            for result in response.get("results", []):
                url = result.get("url", "")
                if "linkedin.com/in/" in url:
                    # Extract name from title (usually "Name - Role - Company | LinkedIn")
                    title = result.get("title", "")
                    name = title.split(" - ")[0] if " - " in title else title.split(" | ")[0]

                    decision_makers.append({
                        "name": name.strip(),
                        "role_searched": role,
                        "linkedin_url": url,
                        "source": "tavily_linkedin_search",
                        "confidence": "medium"
                    })

        return {
            "company_name": company_name,
            "decision_makers": decision_makers,
            "roles_searched": roles[:3],
        }

    except Exception as e:
        return {"error": f"Decision maker search failed: {str(e)}", "decision_makers": []}


def verify_company_data(
    company_name: str,
    data_points: dict[str, Any]
) -> dict[str, Any]:
    """
    Verify extracted company data against web sources.

    Args:
        company_name: Company name
        data_points: Data to verify (e.g., {"revenue": "15.4B", "employees": 42000})

    Returns:
        Verification results with confidence scores
    """
    client = _get_tavily_client()
    if not client:
        return {"error": "Tavily API not configured", "verifications": {}}

    verifications = {}

    try:
        for field, value in data_points.items():
            if value is None:
                continue

            # Build verification query
            query = f'"{company_name}" {field} {value}'
            response = client.search(
                query=query,
                search_depth="basic",
                max_results=3,
                include_answer=True,
            )

            # Check if any results confirm the data
            confirmed = False
            sources = []

            for result in response.get("results", []):
                content = result.get("content", "").lower()
                value_str = str(value).lower()

                if value_str in content:
                    confirmed = True
                    sources.append(result.get("url"))

            verifications[field] = {
                "value": value,
                "verified": confirmed,
                "confidence": "high" if confirmed else "unverified",
                "sources": sources[:2],
                "web_answer": response.get("answer"),
            }

        return {
            "company_name": company_name,
            "verifications": verifications,
            "verified_count": sum(1 for v in verifications.values() if v.get("verified")),
            "total_checked": len(verifications),
        }

    except Exception as e:
        return {"error": f"Verification failed: {str(e)}", "verifications": {}}


@tool
def get_enhanced_buyer_intelligence(company_number: str) -> dict[str, Any]:
    """
    Get comprehensive buyer intelligence with web enrichment.

    Combines Companies House data with Tavily web search for:
    - Company profile and officers
    - Recent news and announcements
    - Decision makers from LinkedIn
    - Web-verified data points

    Args:
        company_number: UK company number

    Returns:
        Full buyer intelligence with web enrichment
    """
    # Get base intelligence from Companies House
    result = get_buyer_intelligence.invoke(company_number)

    if "error" in result:
        return result

    company_name = result.get("profile", {}).get("company_name")
    if not company_name:
        return result

    # Enhance with Tavily if available
    client = _get_tavily_client()
    if client:
        # 1. Get recent news
        news = get_company_news(company_name, max_results=5)
        if news.get("news"):
            result["recent_news"] = news

        # 2. Search for additional decision makers on LinkedIn
        linkedin_search = search_decision_makers(company_name)
        if linkedin_search.get("decision_makers"):
            # Merge with Companies House officers
            existing_names = {o.get("name", "").lower() for o in result.get("decision_makers", [])}
            for dm in linkedin_search["decision_makers"]:
                if dm.get("name", "").lower() not in existing_names:
                    result.setdefault("decision_makers", []).append(dm)

            result["linkedin_enrichment"] = {
                "profiles_found": len(linkedin_search["decision_makers"]),
                "roles_searched": linkedin_search.get("roles_searched", [])
            }

        # 3. Verify key data points if we have SECR data
        if result.get("sustainability", {}).get("has_secr_content"):
            # Could verify emissions data, net zero targets, etc.
            pass

        # 4. Update bid insights with news context
        if news.get("news"):
            result["bid_insights"]["consider"].append(
                f"Recent news: {len(news['news'])} articles found - review for context"
            )

    return result


# ============================================================================
# Signal Detection - Opportunity Identification
# ============================================================================

# Regulatory thresholds for UK companies
REGULATORY_THRESHOLDS = {
    "secr": {
        "name": "SECR Reporting",
        "description": "Streamlined Energy and Carbon Reporting",
        "requirements": {
            "turnover_gbp": 36_000_000,
            "balance_sheet_gbp": 18_000_000,
            "employees": 250,
        },
        "note": "Must meet turnover OR (balance sheet AND employees)",
        "opportunity": "Carbon consultants, energy audits, reporting software"
    },
    "gender_pay_gap": {
        "name": "Gender Pay Gap Reporting",
        "description": "Annual gender pay gap disclosure",
        "requirements": {
            "employees": 250,
        },
        "opportunity": "HR software, pay equity consultants"
    },
    "modern_slavery": {
        "name": "Modern Slavery Statement",
        "description": "Annual modern slavery statement",
        "requirements": {
            "turnover_gbp": 36_000_000,
        },
        "opportunity": "Supply chain due diligence, compliance consultants"
    },
    "mandatory_audit": {
        "name": "Mandatory Audit",
        "description": "Statutory audit requirement",
        "requirements": {
            "turnover_gbp": 10_200_000,
            "balance_sheet_gbp": 5_100_000,
            "employees": 50,
        },
        "note": "Must exceed 2 of 3 thresholds",
        "opportunity": "Accountancy firms, audit services"
    },
}


def detect_threshold_signals(
    company_number: str,
    estimated_turnover: float = None,
    estimated_employees: int = None,
    estimated_balance_sheet: float = None,
) -> dict[str, Any]:
    """
    Detect how close a company is to regulatory thresholds.

    Args:
        company_number: UK company number
        estimated_turnover: Estimated annual turnover in GBP
        estimated_employees: Estimated employee count
        estimated_balance_sheet: Estimated balance sheet total in GBP

    Returns:
        Threshold proximity analysis with opportunities
    """
    result = {
        "company_number": company_number,
        "thresholds": {},
        "alerts": [],
        "opportunities": []
    }

    # Get company info for context
    company_info = get_company_info.invoke(company_number)
    if "error" in company_info:
        result["error"] = company_info["error"]
        return result

    result["company_name"] = company_info.get("company_name")

    # If no estimates provided, we can't calculate proximity
    if not any([estimated_turnover, estimated_employees, estimated_balance_sheet]):
        result["note"] = "Provide estimated_turnover, estimated_employees, or estimated_balance_sheet for threshold analysis"
        return result

    metrics = {
        "turnover_gbp": estimated_turnover,
        "employees": estimated_employees,
        "balance_sheet_gbp": estimated_balance_sheet,
    }

    for threshold_key, threshold_info in REGULATORY_THRESHOLDS.items():
        analysis = {
            "name": threshold_info["name"],
            "description": threshold_info["description"],
            "proximity": {},
            "likely_affected": False,
            "alert_level": "none"
        }

        proximities = []
        for metric_key, threshold_value in threshold_info["requirements"].items():
            current_value = metrics.get(metric_key)
            if current_value is not None:
                percentage = (current_value / threshold_value) * 100
                distance_pct = 100 - percentage

                analysis["proximity"][metric_key] = {
                    "current": current_value,
                    "threshold": threshold_value,
                    "percentage_of_threshold": round(percentage, 1),
                    "distance_to_threshold_pct": round(distance_pct, 1),
                }

                proximities.append(percentage)

                # Check if approaching threshold (within 20%)
                if 80 <= percentage < 100:
                    analysis["alert_level"] = "approaching"
                    result["alerts"].append({
                        "threshold": threshold_key,
                        "metric": metric_key,
                        "message": f"Within 20% of {threshold_info['name']} threshold for {metric_key}",
                        "opportunity": threshold_info["opportunity"]
                    })
                    result["opportunities"].append(threshold_info["opportunity"])
                elif percentage >= 100:
                    analysis["likely_affected"] = True
                    analysis["alert_level"] = "exceeded"

        if proximities:
            analysis["max_proximity_pct"] = round(max(proximities), 1)

        result["thresholds"][threshold_key] = analysis

    # Deduplicate opportunities
    result["opportunities"] = list(set(result["opportunities"]))

    return result


def detect_growth_signals(company_number: str) -> dict[str, Any]:
    """
    Detect growth or distress signals from company data.

    Signals include:
    - Recent officer appointments (growth/restructuring)
    - Officer resignations (potential issues)
    - Insolvency history
    - Charges registered

    Args:
        company_number: UK company number

    Returns:
        Growth and risk signals
    """
    result = {
        "company_number": company_number,
        "growth_signals": [],
        "risk_signals": [],
        "leadership_changes": [],
        "overall_sentiment": "neutral"
    }

    # Get company info
    company_info = get_company_info.invoke(company_number)
    if "error" in company_info:
        result["error"] = company_info["error"]
        return result

    result["company_name"] = company_info.get("company_name")

    # Check for risk indicators
    if company_info.get("has_insolvency_history"):
        result["risk_signals"].append({
            "signal": "insolvency_history",
            "severity": "high",
            "message": "Company has insolvency history",
            "implication": "Payment risk - consider credit terms"
        })

    if company_info.get("has_charges"):
        result["risk_signals"].append({
            "signal": "has_charges",
            "severity": "medium",
            "message": "Company has registered charges (secured debt)",
            "implication": "May indicate financing activity"
        })

    # Get officers for leadership analysis
    officers_data = get_company_officers.invoke(company_number)
    if "error" not in officers_data:
        officers = officers_data.get("officers", [])

        # Analyze recent appointments
        from datetime import datetime, timedelta
        one_year_ago = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")

        recent_appointments = []
        for officer in officers:
            appointed = officer.get("appointed_on", "")
            if appointed and appointed >= one_year_ago:
                recent_appointments.append({
                    "name": officer.get("name"),
                    "role": officer.get("role"),
                    "appointed_on": appointed
                })

        if recent_appointments:
            result["leadership_changes"] = recent_appointments

            # Check for significant roles
            director_count = sum(1 for o in recent_appointments if "director" in o.get("role", "").lower())

            if director_count >= 3:
                result["growth_signals"].append({
                    "signal": "board_expansion",
                    "message": f"{director_count} new directors in last 12 months",
                    "implication": "Possible growth phase or restructuring"
                })
            elif director_count >= 1:
                result["growth_signals"].append({
                    "signal": "leadership_refresh",
                    "message": f"{director_count} new director(s) appointed recently",
                    "implication": "Leadership change - potential new strategic direction"
                })

    # Determine overall sentiment
    growth_count = len(result["growth_signals"])
    risk_count = len(result["risk_signals"])

    if risk_count > growth_count:
        result["overall_sentiment"] = "cautious"
    elif growth_count > risk_count:
        result["overall_sentiment"] = "positive"
    else:
        result["overall_sentiment"] = "neutral"

    return result


@tool
def get_opportunity_signals(company_number: str) -> dict[str, Any]:
    """
    Get comprehensive opportunity signals for a company.

    Combines threshold proximity, growth signals, and risk indicators
    to identify sales opportunities and timing.

    Args:
        company_number: UK company number

    Returns:
        Comprehensive opportunity analysis including:
        - Threshold proximity (regulatory requirements approaching)
        - Growth signals (expansion, hiring, M&A)
        - Risk signals (distress, leadership changes)
        - Recommended actions and timing
    """
    result = {
        "company_number": company_number,
        "extracted_at": datetime.utcnow().isoformat(),
    }

    # Get company info
    company_info = get_company_info.invoke(company_number)
    if "error" in company_info:
        result["error"] = company_info["error"]
        return result

    result["company_name"] = company_info.get("company_name")
    result["sic_codes"] = company_info.get("sic_codes", [])

    # Get growth/risk signals
    signals = detect_growth_signals(company_number)
    result["growth_signals"] = signals.get("growth_signals", [])
    result["risk_signals"] = signals.get("risk_signals", [])
    result["leadership_changes"] = signals.get("leadership_changes", [])
    result["overall_sentiment"] = signals.get("overall_sentiment", "neutral")

    # Generate recommended actions
    actions = []

    if result["leadership_changes"]:
        actions.append({
            "action": "Reach out to new leadership",
            "timing": "Within 3 months of appointment",
            "reason": "New leaders often seek new suppliers/partners"
        })

    if any(s.get("signal") == "board_expansion" for s in result["growth_signals"]):
        actions.append({
            "action": "Position growth solutions",
            "timing": "Now",
            "reason": "Company appears to be in expansion phase"
        })

    if result["risk_signals"]:
        actions.append({
            "action": "Review payment terms carefully",
            "timing": "Before engagement",
            "reason": "Risk indicators detected"
        })

    result["recommended_actions"] = actions

    return result
