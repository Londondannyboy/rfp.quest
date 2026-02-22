// Zep Client for Graph Database Operations
// Zep provides memory and knowledge graph capabilities for AI applications

import { ZepClient } from '@getzep/zep-cloud';

// Initialize Zep client
const zepApiKey = process.env.ZEP_API_KEY || '';
const zepClient = new ZepClient({
  apiKey: zepApiKey,
});

// Graph node types for RFP Quest
export type NodeType = 
  | 'Tender' 
  | 'Company' 
  | 'Buyer' 
  | 'DecisionMaker' 
  | 'Sector' 
  | 'Requirement'
  | 'Bid'
  | 'Contract';

// Relationship types
export type RelationType =
  | 'BIDS_FOR'
  | 'COMPETES_WITH'
  | 'WON_BY'
  | 'ISSUED_BY'
  | 'WORKS_FOR'
  | 'PARTNERS_WITH'
  | 'SIMILAR_TO'
  | 'REQUIRES'
  | 'FULFILLS'
  | 'SUCCEEDED_BY';

interface GraphNode {
  id: string;
  type: NodeType;
  properties: Record<string, any>;
  embedding?: number[]; // Vector embedding for similarity search
}

interface GraphRelationship {
  id: string;
  type: RelationType;
  sourceId: string;
  targetId: string;
  properties: Record<string, any>;
  weight?: number;
}

export class RFPQuestGraphDB {
  private sessionId: string;
  
  constructor(teamId: string) {
    this.sessionId = `rfpquest_${teamId}`;
  }
  
  // Create or update a node in the knowledge graph
  async upsertNode(node: GraphNode): Promise<void> {
    try {
      // Store in Zep's knowledge graph
      await zepClient.memory.add(this.sessionId, {
        messages: [],
        metadata: {
          type: 'node',
          nodeType: node.type,
          nodeId: node.id,
          properties: JSON.stringify(node.properties),
        },
      });
      
      // If we have an embedding, store it for similarity search
      if (node.embedding) {
        await this.storeEmbedding(node.id, node.embedding);
      }
    } catch (error) {
      console.error('Failed to upsert node:', error);
      throw error;
    }
  }
  
  // Create a relationship between nodes
  async createRelationship(relationship: GraphRelationship): Promise<void> {
    try {
      await zepClient.memory.add(this.sessionId, {
        messages: [],
        metadata: {
          type: 'relationship',
          relationshipType: relationship.type,
          relationshipId: relationship.id,
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          properties: JSON.stringify(relationship.properties),
          weight: relationship.weight || 1.0,
        },
      });
    } catch (error) {
      console.error('Failed to create relationship:', error);
      throw error;
    }
  }
  
  // Query the graph for specific patterns
  async queryGraph(query: {
    nodeType?: NodeType;
    relationshipType?: RelationType;
    properties?: Record<string, any>;
    limit?: number;
  }): Promise<{ nodes: GraphNode[]; relationships: GraphRelationship[] }> {
    try {
      const memory = await zepClient.memory.get(this.sessionId, {
        lastn: query.limit || 100,
      });
      
      const nodes: GraphNode[] = [];
      const relationships: GraphRelationship[] = [];
      
      // Parse memory into nodes and relationships
      memory.messages?.forEach((msg: any) => {
        const metadata = msg.metadata;
        
        if (metadata?.type === 'node') {
          if (!query.nodeType || metadata.nodeType === query.nodeType) {
            nodes.push({
              id: metadata.nodeId,
              type: metadata.nodeType,
              properties: JSON.parse(metadata.properties || '{}'),
            });
          }
        } else if (metadata?.type === 'relationship') {
          if (!query.relationshipType || metadata.relationshipType === query.relationshipType) {
            relationships.push({
              id: metadata.relationshipId,
              type: metadata.relationshipType,
              sourceId: metadata.sourceId,
              targetId: metadata.targetId,
              properties: JSON.parse(metadata.properties || '{}'),
              weight: metadata.weight,
            });
          }
        }
      });
      
      return { nodes, relationships };
    } catch (error) {
      console.error('Failed to query graph:', error);
      return { nodes: [], relationships: [] };
    }
  }
  
  // Find similar nodes using vector similarity
  async findSimilarNodes(
    nodeId: string,
    topK: number = 10
  ): Promise<Array<{ node: GraphNode; similarity: number }>> {
    try {
      // Get the embedding for the source node
      const sourceEmbedding = await this.getEmbedding(nodeId);
      if (!sourceEmbedding) {
        return [];
      }
      
      // Search for similar embeddings
      const results = await zepClient.memory.searchMemory(
        this.sessionId,
        JSON.stringify({ embedding: sourceEmbedding }),
        {
          limit: topK,
        }
      );
      
      return results.map((result: any) => ({
        node: {
          id: result.metadata.nodeId,
          type: result.metadata.nodeType,
          properties: JSON.parse(result.metadata.properties || '{}'),
        },
        similarity: result.score || 0,
      }));
    } catch (error) {
      console.error('Failed to find similar nodes:', error);
      return [];
    }
  }
  
  // Build a subgraph around a specific node
  async getNodeNeighborhood(
    nodeId: string,
    depth: number = 1
  ): Promise<{ nodes: GraphNode[]; relationships: GraphRelationship[] }> {
    const visitedNodes = new Set<string>();
    const allNodes: GraphNode[] = [];
    const allRelationships: GraphRelationship[] = [];
    
    const explore = async (currentNodeId: string, currentDepth: number) => {
      if (currentDepth > depth || visitedNodes.has(currentNodeId)) {
        return;
      }
      
      visitedNodes.add(currentNodeId);
      
      // Get relationships for this node
      const { relationships } = await this.queryGraph({
        properties: { nodeId: currentNodeId },
      });
      
      for (const rel of relationships) {
        allRelationships.push(rel);
        
        // Explore connected nodes
        const nextNodeId = rel.sourceId === currentNodeId ? rel.targetId : rel.sourceId;
        if (!visitedNodes.has(nextNodeId)) {
          await explore(nextNodeId, currentDepth + 1);
        }
      }
    };
    
    await explore(nodeId, 0);
    
    // Get all nodes that were found
    for (const nodeId of visitedNodes) {
      const { nodes } = await this.queryGraph({
        properties: { nodeId },
        limit: 1,
      });
      if (nodes.length > 0) {
        allNodes.push(nodes[0]);
      }
    }
    
    return { nodes: allNodes, relationships: allRelationships };
  }
  
  // Analyze competitive landscape
  async analyzeCompetitiveLandscape(tenderId: string): Promise<{
    competitors: Array<{ company: GraphNode; strength: number }>;
    incumbentAdvantage: number;
    marketConcentration: number;
  }> {
    // Get all companies bidding for this tender
    const { relationships } = await this.queryGraph({
      relationshipType: 'BIDS_FOR',
      properties: { targetId: tenderId },
    });
    
    const competitors: Array<{ company: GraphNode; strength: number }> = [];
    let incumbentAdvantage = 0;
    
    for (const rel of relationships) {
      const { nodes } = await this.queryGraph({
        properties: { nodeId: rel.sourceId },
        limit: 1,
      });
      
      if (nodes.length > 0) {
        const company = nodes[0];
        
        // Calculate competitive strength
        const strength = await this.calculateCompetitiveStrength(company.id, tenderId);
        competitors.push({ company, strength });
        
        // Check for incumbent
        if (rel.properties.isIncumbent) {
          incumbentAdvantage = 0.3; // 30% advantage for incumbents
        }
      }
    }
    
    // Calculate market concentration (Herfindahl index)
    const totalStrength = competitors.reduce((sum, c) => sum + c.strength, 0);
    const marketConcentration = competitors.reduce((sum, c) => {
      const marketShare = c.strength / totalStrength;
      return sum + Math.pow(marketShare, 2);
    }, 0);
    
    return {
      competitors: competitors.sort((a, b) => b.strength - a.strength),
      incumbentAdvantage,
      marketConcentration,
    };
  }
  
  // Calculate competitive strength based on historical performance
  private async calculateCompetitiveStrength(
    companyId: string,
    tenderId: string
  ): Promise<number> {
    // Get historical wins
    const { relationships: wins } = await this.queryGraph({
      relationshipType: 'WON_BY',
      properties: { sourceId: companyId },
    });
    
    // Get similar tenders
    const similarTenders = await this.findSimilarNodes(tenderId, 20);
    const similarTenderIds = new Set(similarTenders.map(st => st.node.id));
    
    // Calculate strength factors
    const winRate = wins.length / 100; // Assume 100 bids average
    const relevantWins = wins.filter(w => similarTenderIds.has(w.targetId)).length;
    const sectorExperience = relevantWins / Math.max(similarTenders.length, 1);
    
    // Weighted score
    return (
      winRate * 0.3 +
      sectorExperience * 0.5 +
      Math.random() * 0.2 // Random factor for unknown variables
    );
  }
  
  // Store embedding for similarity search
  private async storeEmbedding(nodeId: string, embedding: number[]): Promise<void> {
    // In production, this would store in a vector database
    // For now, we store in Zep's metadata
    await zepClient.memory.add(this.sessionId, {
      messages: [],
      metadata: {
        type: 'embedding',
        nodeId,
        embedding: JSON.stringify(embedding),
      },
    });
  }
  
  // Get embedding for a node
  private async getEmbedding(nodeId: string): Promise<number[] | null> {
    const memory = await zepClient.memory.get(this.sessionId, {
      lastn: 1000,
    });
    
    const embeddingRecord = memory.messages?.find(
      (msg: any) => msg.metadata?.type === 'embedding' && msg.metadata?.nodeId === nodeId
    );
    
    if (embeddingRecord?.metadata?.embedding) {
      return JSON.parse(embeddingRecord.metadata.embedding);
    }
    
    return null;
  }
}

// Helper functions for building the graph

export async function ingestTenderIntoGraph(
  graphDB: RFPQuestGraphDB,
  tender: any
): Promise<void> {
  // Create tender node
  await graphDB.upsertNode({
    id: `tender-${tender.id}`,
    type: 'Tender',
    properties: {
      title: tender.title,
      value: tender.value,
      deadline: tender.deadline,
      cpvCodes: tender.cpv_codes,
      description: tender.description,
    },
  });
  
  // Create buyer node and relationship
  await graphDB.upsertNode({
    id: `buyer-${tender.buyer_name}`,
    type: 'Buyer',
    properties: {
      name: tender.buyer_name,
      type: tender.buyer_type,
      region: tender.region,
    },
  });
  
  await graphDB.createRelationship({
    id: `issued-${tender.id}`,
    type: 'ISSUED_BY',
    sourceId: `tender-${tender.id}`,
    targetId: `buyer-${tender.buyer_name}`,
    properties: {
      publishedDate: tender.published_date,
    },
  });
  
  // Create requirement nodes
  if (tender.requirements) {
    for (const req of tender.requirements) {
      await graphDB.upsertNode({
        id: `req-${tender.id}-${req.id}`,
        type: 'Requirement',
        properties: {
          title: req.title,
          description: req.description,
          mandatory: req.mandatory,
        },
      });
      
      await graphDB.createRelationship({
        id: `requires-${tender.id}-${req.id}`,
        type: 'REQUIRES',
        sourceId: `tender-${tender.id}`,
        targetId: `req-${tender.id}-${req.id}`,
        properties: {
          weight: req.weight || 1,
        },
      });
    }
  }
}

export async function ingestCompanyIntoGraph(
  graphDB: RFPQuestGraphDB,
  company: any
): Promise<void> {
  // Create company node
  await graphDB.upsertNode({
    id: `company-${company.company_number}`,
    type: 'Company',
    properties: {
      name: company.name,
      companyNumber: company.company_number,
      turnover: company.turnover,
      employees: company.employees,
      sectors: company.sectors,
      region: company.region,
    },
  });
  
  // Create decision maker nodes
  if (company.decision_makers) {
    for (const dm of company.decision_makers) {
      await graphDB.upsertNode({
        id: `dm-${dm.linkedin_url || dm.name}`,
        type: 'DecisionMaker',
        properties: {
          name: dm.name,
          role: dm.role,
          linkedinUrl: dm.linkedin_url,
          email: dm.email,
        },
      });
      
      await graphDB.createRelationship({
        id: `works-${company.company_number}-${dm.name}`,
        type: 'WORKS_FOR',
        sourceId: `dm-${dm.linkedin_url || dm.name}`,
        targetId: `company-${company.company_number}`,
        properties: {
          role: dm.role,
          since: dm.appointed_date,
        },
      });
    }
  }
}