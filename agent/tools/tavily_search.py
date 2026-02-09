"""
Tavily Search Tool - Web search for buyer/competitor research
"""

import os
from typing import Any

from langchain_core.tools import tool


@tool
def tavily_search(query: str, max_results: int = 5) -> str:
    """
    Search the web for information about buyers, competitors, or market context.

    Args:
        query: Search query (e.g., "NHS England contracts awarded 2024")
        max_results: Maximum number of results to return

    Returns:
        Formatted search results as string
    """
    api_key = os.getenv("TAVILY_API_KEY")

    if not api_key:
        return "Tavily API key not configured. Web search unavailable."

    try:
        from tavily import TavilyClient

        client = TavilyClient(api_key=api_key)

        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=max_results,
            include_answer=True,
        )

        # Format results
        lines = []

        # Include answer if available
        if answer := response.get("answer"):
            lines.append(f"Summary: {answer}\n")

        # Include search results
        results = response.get("results", [])
        for i, result in enumerate(results, 1):
            title = result.get("title", "No title")
            url = result.get("url", "")
            content = result.get("content", "")[:500]
            lines.append(f"{i}. {title}")
            lines.append(f"   URL: {url}")
            lines.append(f"   {content}")
            lines.append("")

        return "\n".join(lines) if lines else "No results found"

    except ImportError:
        return "Tavily client not installed. Run: pip install tavily-python"
    except Exception as e:
        return f"Search error: {str(e)}"


def search_buyer_info(buyer_name: str) -> dict[str, Any]:
    """
    Search for information about a specific buyer organization.

    Args:
        buyer_name: Name of the buying organization

    Returns:
        Dict with buyer insights
    """
    queries = [
        f'"{buyer_name}" UK government contracts strategy',
        f'"{buyer_name}" procurement priorities 2024 2025',
        f'"{buyer_name}" recent contract awards',
    ]

    results = []
    for query in queries:
        result = tavily_search(query, max_results=3)
        if result and "error" not in result.lower():
            results.append(result)

    return {
        "buyer_name": buyer_name,
        "research": "\n\n---\n\n".join(results),
    }


def search_competitors(buyer_name: str, sector: str) -> dict[str, Any]:
    """
    Search for potential competitors for a tender.

    Args:
        buyer_name: Name of the buying organization
        sector: Sector/category of the tender

    Returns:
        Dict with competitor insights
    """
    queries = [
        f'"{buyer_name}" {sector} suppliers contractors',
        f'"{buyer_name}" framework agreement suppliers',
        f'{sector} UK government contracts awarded 2024',
    ]

    results = []
    for query in queries:
        result = tavily_search(query, max_results=3)
        if result and "error" not in result.lower():
            results.append(result)

    return {
        "buyer_name": buyer_name,
        "sector": sector,
        "competitor_research": "\n\n---\n\n".join(results),
    }
