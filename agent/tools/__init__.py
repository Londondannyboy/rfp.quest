"""RFP.quest Agent Tools"""

from .tavily_search import tavily_search
from .tender_context import get_tender_details
from .company_profile import get_company_profile
from .framework_detector import detect_framework_type
from .pdf_parser import parse_pdf, extract_tender_sections, summarize_pdf_for_analysis
from .companies_house import (
    get_company_info,
    get_company_officers,
    get_filing_history,
    get_buyer_intelligence,
    get_enhanced_buyer_intelligence,
    search_company_by_name,
    get_company_news,
    search_decision_makers,
    verify_company_data,
    # Signal detection
    detect_threshold_signals,
    detect_growth_signals,
    get_opportunity_signals,
)

__all__ = [
    "tavily_search",
    "get_tender_details",
    "get_company_profile",
    "detect_framework_type",
    "parse_pdf",
    "extract_tender_sections",
    "summarize_pdf_for_analysis",
    # Companies House tools
    "get_company_info",
    "get_company_officers",
    "get_filing_history",
    "get_buyer_intelligence",
    "get_enhanced_buyer_intelligence",
    "search_company_by_name",
    # Tavily-enhanced tools
    "get_company_news",
    "search_decision_makers",
    "verify_company_data",
    # Signal detection
    "detect_threshold_signals",
    "detect_growth_signals",
    "get_opportunity_signals",
]
