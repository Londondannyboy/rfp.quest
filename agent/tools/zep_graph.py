"""
Zep Graph integration for RFP Quest skills tracking.
Manages professional skills graph and bid outcomes.
"""

import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
from zep_cloud import Zep
from zep_cloud.types import Message, Session

# Initialize Zep client
ZEP_API_KEY = os.getenv("ZEP_API_KEY")
ZEP_GRAPH = os.getenv("ZEP_GRAPH", "rfp-quest-skills")

def get_zep_client() -> Optional[Zep]:
    """Get Zep client if API key is configured."""
    if not ZEP_API_KEY:
        return None
    return Zep(api_key=ZEP_API_KEY)

def sync_person_to_zep(email: str, company: str = None, skills: List[str] = None, sector: str = None) -> Dict[str, Any]:
    """
    Sync a person's profile to Zep graph.
    
    Args:
        email: User's email address
        company: Company name (e.g., "GTM Quest")
        skills: List of skills (e.g., ["GTM Strategy", "4-Channel ABM"])
        sector: Primary sector (e.g., "SaaS")
    
    Returns:
        Dictionary with sync status and facts added
    """
    client = get_zep_client()
    if not client:
        return {"success": False, "error": "ZEP_API_KEY not configured"}
    
    try:
        # Create or update person node
        facts_added = 0
        
        # Add company relationship
        if company:
            client.graph.add_fact(
                graph_id=ZEP_GRAPH,
                fact={
                    "subject": email,
                    "predicate": "WORKS_AT",
                    "object": company,
                    "metadata": {"type": "employment"}
                }
            )
            facts_added += 1
        
        # Add skills
        if skills:
            for skill in skills:
                client.graph.add_fact(
                    graph_id=ZEP_GRAPH,
                    fact={
                        "subject": email,
                        "predicate": "HAS_SKILL",
                        "object": skill,
                        "metadata": {"type": "capability"}
                    }
                )
                facts_added += 1
        
        # Add sector expertise
        if sector:
            client.graph.add_fact(
                graph_id=ZEP_GRAPH,
                fact={
                    "subject": email,
                    "predicate": "SECTOR",
                    "object": sector,
                    "metadata": {"type": "industry"}
                }
            )
            facts_added += 1
        
        return {
            "success": True,
            "facts_added": facts_added,
            "message": f"Synced {facts_added} facts for {email}"
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def add_bid_outcome(
    email: str,
    contract_name: str,
    buyer: str,
    value: Optional[float] = None,
    year: Optional[int] = None,
    outcome: str = "win",
    role: Optional[str] = None
) -> Dict[str, Any]:
    """
    Add a bid win/loss outcome to the graph.
    
    Args:
        email: User's email address
        contract_name: Name of the contract/tender
        buyer: Buyer organization name
        value: Contract value in GBP
        year: Year of the bid
        outcome: "win" or "loss"
        role: User's role in the bid (e.g., "Bid Manager", "Lead Writer")
    
    Returns:
        Dictionary with operation status
    """
    client = get_zep_client()
    if not client:
        return {"success": False, "error": "ZEP_API_KEY not configured"}
    
    try:
        # Create bid node identifier
        bid_id = f"{contract_name}_{buyer}_{year or datetime.now().year}".replace(" ", "_")
        
        # Add bid outcome relationship
        predicate = "WON_BID" if outcome.lower() == "win" else "LOST_BID"
        
        metadata = {
            "type": "bid_outcome",
            "outcome": outcome,
            "buyer": buyer,
            "contract_name": contract_name
        }
        
        if value:
            metadata["value_gbp"] = value
        if year:
            metadata["year"] = year
        if role:
            metadata["role"] = role
        
        client.graph.add_fact(
            graph_id=ZEP_GRAPH,
            fact={
                "subject": email,
                "predicate": predicate,
                "object": bid_id,
                "metadata": metadata
            }
        )
        
        # Add buyer relationship
        client.graph.add_fact(
            graph_id=ZEP_GRAPH,
            fact={
                "subject": bid_id,
                "predicate": "BUYER",
                "object": buyer,
                "metadata": {"type": "organization"}
            }
        )
        
        # Track win rate statistics
        if outcome.lower() == "win":
            client.graph.add_fact(
                graph_id=ZEP_GRAPH,
                fact={
                    "subject": email,
                    "predicate": "WIN_RATE_UPDATE",
                    "object": f"+1_win_{datetime.now().isoformat()}",
                    "metadata": {"type": "statistic", "delta": "win"}
                }
            )
        else:
            client.graph.add_fact(
                graph_id=ZEP_GRAPH,
                fact={
                    "subject": email,
                    "predicate": "WIN_RATE_UPDATE",
                    "object": f"+1_loss_{datetime.now().isoformat()}",
                    "metadata": {"type": "statistic", "delta": "loss"}
                }
            )
        
        return {
            "success": True,
            "bid_id": bid_id,
            "outcome": outcome,
            "message": f"Added {outcome} outcome for {contract_name}"
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_user_graph(email: str) -> Dict[str, Any]:
    """
    Retrieve user's skills graph for visualization.
    
    Args:
        email: User's email address
    
    Returns:
        Graph data for visualization
    """
    client = get_zep_client()
    if not client:
        return {"success": False, "error": "ZEP_API_KEY not configured"}
    
    try:
        # Query graph for user's facts
        facts = client.graph.search(
            graph_id=ZEP_GRAPH,
            query=email,
            limit=100
        )
        
        # Build visualization data
        nodes = []
        edges = []
        
        # Add user node
        nodes.append({
            "id": email,
            "type": "person",
            "label": email.split("@")[0]
        })
        
        # Process facts into nodes and edges
        for fact in facts:
            # Add object as node
            if fact["object"] not in [n["id"] for n in nodes]:
                node_type = "skill" if fact["predicate"] == "HAS_SKILL" else \
                           "company" if fact["predicate"] == "WORKS_AT" else \
                           "win" if fact["predicate"] == "WON_BID" else \
                           "loss" if fact["predicate"] == "LOST_BID" else \
                           "other"
                
                nodes.append({
                    "id": fact["object"],
                    "type": node_type,
                    "label": fact["object"]
                })
            
            # Add edge
            edges.append({
                "source": fact["subject"],
                "target": fact["object"],
                "type": fact["predicate"]
            })
        
        return {
            "success": True,
            "nodes": nodes,
            "edges": edges,
            "facts_count": len(facts)
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def search_skills_graph(query: str, limit: int = 10) -> Dict[str, Any]:
    """
    Search the skills graph for relevant connections.
    
    Args:
        query: Search query
        limit: Maximum results
    
    Returns:
        Search results from graph
    """
    client = get_zep_client()
    if not client:
        return {"success": False, "error": "ZEP_API_KEY not configured"}
    
    try:
        results = client.graph.search(
            graph_id=ZEP_GRAPH,
            query=query,
            limit=limit
        )
        
        return {
            "success": True,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}