"""
Apify LinkedIn integration for decision maker profiling.
Uses no-cookie scrapers to get LinkedIn profiles and posts.
"""

import os
import httpx
from typing import Optional

APIFY_TOKEN = os.getenv("APIFY_API_TOKEN")
APIFY_BASE_URL = "https://api.apify.com/v2/acts"


async def search_linkedin_profile(
    first_name: str,
    last_name: str,
    company: str,
    timeout: int = 90
) -> Optional[dict]:
    """
    Search for a LinkedIn profile by name and company.
    Returns profile data if found, None otherwise.
    """
    if not APIFY_TOKEN:
        print("Warning: APIFY_API_TOKEN not set")
        return None

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{APIFY_BASE_URL}/harvestapi~linkedin-profile-search-by-name/run-sync-get-dataset-items",
                params={"token": APIFY_TOKEN},
                json={
                    "profileScraperMode": "Short",
                    "firstName": first_name,
                    "lastName": last_name,
                    "maxPages": 1,
                    "strictSearch": True
                },
                headers={"Content-Type": "application/json"}
            )

            if response.status_code not in [200, 201]:
                print(f"Apify search failed: {response.status_code} - {response.text[:200]}")
                return None

            results = response.json()

            if not results or len(results) == 0:
                return None

            # Filter by company match in headline/position
            company_lower = company.lower()
            for profile in results:
                # Apify returns "position" not "headline"
                headline = (profile.get("position") or profile.get("headline") or "").lower()
                if company_lower in headline or any(
                    word in headline for word in company_lower.split()[:2]
                ):
                    return {
                        # Apify returns "linkedinUrl" not "url"
                        "url": profile.get("linkedinUrl") or profile.get("url") or profile.get("profileUrl"),
                        "name": profile.get("name") or profile.get("fullName") or f"{first_name} {last_name}",
                        "headline": profile.get("position") or profile.get("headline"),
                        "location": profile.get("location"),
                        "followers": profile.get("followersCount"),
                        "connections": profile.get("connectionsCount"),
                    }

            # If no company match, return first result
            if results:
                profile = results[0]
                return {
                    "url": profile.get("linkedinUrl") or profile.get("url") or profile.get("profileUrl"),
                    "name": profile.get("name") or profile.get("fullName") or f"{first_name} {last_name}",
                    "headline": profile.get("position") or profile.get("headline"),
                    "location": profile.get("location"),
                    "followers": profile.get("followersCount"),
                    "connections": profile.get("connectionsCount"),
                }

            return None

    except Exception as e:
        print(f"Error searching LinkedIn profile: {e}")
        return None


async def get_linkedin_posts(
    profile_url: str,
    max_posts: int = 10,
    timeout: int = 90
) -> list:
    """
    Get recent posts from a LinkedIn profile.
    Returns list of post data.
    """
    if not APIFY_TOKEN:
        print("Warning: APIFY_API_TOKEN not set")
        return []

    if not profile_url:
        return []

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{APIFY_BASE_URL}/harvestapi~linkedin-profile-posts/run-sync-get-dataset-items",
                params={"token": APIFY_TOKEN},
                json={
                    "targetUrls": [profile_url],
                    "maxPosts": max_posts,
                    "postedLimit": "month",
                    "scrapeComments": False,
                    "scrapeReactions": False
                },
                headers={"Content-Type": "application/json"}
            )

            if response.status_code not in [200, 201]:
                print(f"Apify posts fetch failed: {response.status_code}")
                return []

            posts = response.json()

            # Transform to simplified format
            return [
                {
                    "text": post.get("text", "")[:500],  # Truncate long posts
                    "likes": post.get("numLikes", 0),
                    "comments": post.get("numComments", 0),
                    "posted_at": post.get("postedAtISO"),
                    "url": post.get("postUrl"),
                }
                for post in posts
                if post.get("text")
            ]

    except Exception as e:
        print(f"Error fetching LinkedIn posts: {e}")
        return []


async def analyze_director_content(
    director_name: str,
    director_role: str,
    company_name: str,
    posts: list,
    openai_api_key: Optional[str] = None
) -> dict:
    """
    Analyze a director's LinkedIn posts to extract insights for bid writing.
    Uses OpenAI to summarize topics, priorities, and generate bid insights.
    """
    if not posts:
        return {
            "topics": [],
            "priorities": [],
            "concerns": [],
            "insights": [],
            "post_count": 0
        }

    api_key = openai_api_key or os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Return basic analysis without LLM
        return {
            "topics": _extract_basic_topics(posts),
            "priorities": [],
            "concerns": [],
            "insights": [],
            "post_count": len(posts)
        }

    # Prepare posts for analysis
    posts_text = "\n\n".join([
        f"Post {i+1} ({post.get('likes', 0)} likes):\n{post.get('text', '')}"
        for i, post in enumerate(posts[:10])
    ])

    prompt = f"""Analyze these LinkedIn posts from {director_name}, {director_role} at {company_name}.

Posts:
{posts_text}

Extract:
1. Key topics they discuss (e.g., "sustainability", "digital transformation", "cost efficiency")
2. Public priorities they've stated
3. Any concerns or challenges mentioned
4. Bid writing insights - what should a vendor emphasize or avoid based on this person's public statements?

Return JSON only:
{{"topics": ["topic1", "topic2"], "priorities": ["priority1"], "concerns": ["concern1"], "insights": ["Emphasize X because they mentioned Y"]}}"""

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                    "response_format": {"type": "json_object"}
                }
            )

            if response.status_code not in [200, 201]:
                print(f"OpenAI analysis failed: {response.status_code}")
                return {
                    "topics": _extract_basic_topics(posts),
                    "priorities": [],
                    "concerns": [],
                    "insights": [],
                    "post_count": len(posts)
                }

            result = response.json()
            content = result["choices"][0]["message"]["content"]

            import json
            analysis = json.loads(content)
            analysis["post_count"] = len(posts)
            return analysis

    except Exception as e:
        print(f"Error analyzing director content: {e}")
        return {
            "topics": _extract_basic_topics(posts),
            "priorities": [],
            "concerns": [],
            "insights": [],
            "post_count": len(posts)
        }


def _extract_basic_topics(posts: list) -> list:
    """Extract basic topics from posts without LLM."""
    topic_keywords = {
        "sustainability": ["sustainable", "carbon", "net zero", "green", "environment", "climate"],
        "digital transformation": ["digital", "technology", "innovation", "ai", "automation"],
        "growth": ["growth", "expansion", "scale", "revenue", "market"],
        "leadership": ["leadership", "team", "culture", "talent", "people"],
        "efficiency": ["efficiency", "cost", "optimization", "productivity"],
        "customer focus": ["customer", "client", "service", "experience"],
        "partnerships": ["partner", "collaboration", "alliance", "ecosystem"],
    }

    all_text = " ".join(p.get("text", "").lower() for p in posts)
    found_topics = []

    for topic, keywords in topic_keywords.items():
        if any(kw in all_text for kw in keywords):
            found_topics.append(topic)

    return found_topics[:5]


async def profile_decision_maker(
    name: str,
    role: str,
    company_name: str
) -> dict:
    """
    Full decision maker profiling: search LinkedIn, get posts, analyze.
    """
    # Parse name (usually "LASTNAME, Firstname" from Companies House)
    name_parts = name.split(", ")
    if len(name_parts) >= 2:
        last_name = name_parts[0]
        first_name = name_parts[1].split()[0]  # First word only
    else:
        parts = name.split()
        first_name = parts[0] if parts else name
        last_name = parts[-1] if len(parts) > 1 else ""

    result = {
        "name": name,
        "role": role,
        "linkedin_url": None,
        "linkedin_profile": None,
        "recent_topics": [],
        "public_priorities": [],
        "concerns": [],
        "bid_insights": [],
        "post_count": 0
    }

    # 1. Search for LinkedIn profile
    profile = await search_linkedin_profile(first_name, last_name, company_name)

    if profile:
        result["linkedin_url"] = profile.get("url")
        result["linkedin_profile"] = profile

        # 2. Get recent posts
        if profile.get("url"):
            posts = await get_linkedin_posts(profile["url"], max_posts=10)

            # 3. Analyze posts
            if posts:
                analysis = await analyze_director_content(
                    name, role, company_name, posts
                )
                result["recent_topics"] = analysis.get("topics", [])
                result["public_priorities"] = analysis.get("priorities", [])
                result["concerns"] = analysis.get("concerns", [])
                result["bid_insights"] = analysis.get("insights", [])
                result["post_count"] = analysis.get("post_count", 0)

    return result
