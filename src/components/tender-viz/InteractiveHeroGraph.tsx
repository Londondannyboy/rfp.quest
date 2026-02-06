'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface InteractiveHeroGraphProps {
  title: string;
  buyerName: string;
  stage: 'planning' | 'tender' | 'award' | 'contract';
  valueMax: number | null;
  description: string | null;
}

interface Node {
  id: string;
  label: string;
  type: 'center' | 'phase' | 'capability' | 'requirement' | 'buyer';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
  strength: number;
}

// Extract keywords from description
function extractKeywords(description: string | null): string[] {
  if (!description) return [];

  const keywords: string[] = [];
  const patterns = [
    /\b(digital twin|AI|machine learning|cloud|data|automation|IoT|analytics)\b/gi,
    /\b(phase \d|stage \d)\b/gi,
    /\b(modelling|modeling|simulation|optimization|integration)\b/gi,
    /\b(infrastructure|platform|system|solution|service)\b/gi,
  ];

  for (const pattern of patterns) {
    const matches = description.match(pattern);
    if (matches) {
      keywords.push(...matches.map(m => m.toLowerCase()));
    }
  }

  return [...new Set(keywords)].slice(0, 8);
}

// Color palette based on stage
const stageColors = {
  planning: { primary: '#3b82f6', secondary: '#60a5fa', glow: 'rgba(59, 130, 246, 0.3)' },
  tender: { primary: '#22c55e', secondary: '#4ade80', glow: 'rgba(34, 197, 94, 0.3)' },
  award: { primary: '#a855f7', secondary: '#c084fc', glow: 'rgba(168, 85, 247, 0.3)' },
  contract: { primary: '#14b8a6', secondary: '#2dd4bf', glow: 'rgba(20, 184, 166, 0.3)' },
};

export function InteractiveHeroGraph({
  title,
  buyerName,
  stage,
  valueMax,
  description,
}: InteractiveHeroGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colors = stageColors[stage] || stageColors.tender;
  const keywords = useMemo(() => extractKeywords(description), [description]);

  // Generate nodes and edges
  const { nodes, edges } = useMemo(() => {
    const nodeList: Node[] = [];
    const edgeList: Edge[] = [];
    const centerX = 150;
    const centerY = 120;

    // Center node (the tender)
    nodeList.push({
      id: 'center',
      label: title.split(' ').slice(0, 3).join(' '),
      type: 'center',
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: 35,
      color: colors.primary,
    });

    // Buyer node
    nodeList.push({
      id: 'buyer',
      label: buyerName.split(' ').slice(0, 2).join(' '),
      type: 'buyer',
      x: centerX - 80,
      y: centerY - 60,
      vx: 0,
      vy: 0,
      radius: 25,
      color: '#f59e0b',
    });
    edgeList.push({ source: 'center', target: 'buyer', strength: 1 });

    // Value node if exists
    if (valueMax) {
      const valueLabel = valueMax >= 1000000
        ? `£${(valueMax / 1000000).toFixed(1)}M`
        : `£${(valueMax / 1000).toFixed(0)}K`;
      nodeList.push({
        id: 'value',
        label: valueLabel,
        type: 'requirement',
        x: centerX + 90,
        y: centerY - 50,
        vx: 0,
        vy: 0,
        radius: 22,
        color: '#22c55e',
      });
      edgeList.push({ source: 'center', target: 'value', strength: 0.8 });
    }

    // Keyword nodes
    keywords.forEach((keyword, i) => {
      const angle = (i / keywords.length) * Math.PI * 2 + Math.PI / 4;
      const radius = 70 + Math.random() * 30;
      nodeList.push({
        id: `kw-${i}`,
        label: keyword,
        type: i < 2 ? 'phase' : 'capability',
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 18 + Math.random() * 8,
        color: i < 2 ? colors.secondary : '#6366f1',
      });
      edgeList.push({ source: 'center', target: `kw-${i}`, strength: 0.5 + Math.random() * 0.3 });
    });

    // Stage indicator node
    nodeList.push({
      id: 'stage',
      label: stage.charAt(0).toUpperCase() + stage.slice(1),
      type: 'phase',
      x: centerX + 70,
      y: centerY + 70,
      vx: 0,
      vy: 0,
      radius: 20,
      color: colors.primary,
    });
    edgeList.push({ source: 'center', target: 'stage', strength: 0.9 });

    return { nodes: nodeList, edges: edgeList };
  }, [title, buyerName, stage, valueMax, keywords, colors]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Apply subtle physics
      nodes.forEach((node) => {
        if (node.type !== 'center') {
          // Gentle floating motion
          node.x += Math.sin(time + node.x * 0.01) * 0.3;
          node.y += Math.cos(time + node.y * 0.01) * 0.2;

          // Keep in bounds
          node.x = Math.max(node.radius, Math.min(rect.width - node.radius, node.x));
          node.y = Math.max(node.radius, Math.min(rect.height - node.radius, node.y));
        }
      });

      // Draw edges with glow
      edges.forEach((edge) => {
        const source = nodes.find((n) => n.id === edge.source);
        const target = nodes.find((n) => n.id === edge.target);
        if (!source || !target) return;

        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        gradient.addColorStop(0, source.color + '60');
        gradient.addColorStop(1, target.color + '60');

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = edge.strength * 2;
        ctx.stroke();

        // Animated pulse along edge
        const pulsePos = (Math.sin(time * 2 + edge.strength) + 1) / 2;
        const pulseX = source.x + (target.x - source.x) * pulsePos;
        const pulseY = source.y + (target.y - source.y) * pulsePos;

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const scale = isHovered ? 1.2 : 1;
        const radius = node.radius * scale;

        // Glow effect
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, radius * 2
        );
        glow.addColorStop(0, node.color + '40');
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        const nodeGradient = ctx.createRadialGradient(
          node.x - radius * 0.3, node.y - radius * 0.3, 0,
          node.x, node.y, radius
        );
        nodeGradient.addColorStop(0, node.color);
        nodeGradient.addColorStop(1, node.color + 'cc');
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Label
        if (radius > 15) {
          ctx.font = `${Math.min(radius * 0.4, 11)}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const label = node.label.length > 12 ? node.label.slice(0, 10) + '...' : node.label;
          ctx.fillText(label, node.x, node.y);
        }
      });

      // Floating particles
      for (let i = 0; i < 5; i++) {
        const px = (Math.sin(time * 0.5 + i) + 1) / 2 * rect.width;
        const py = (Math.cos(time * 0.3 + i * 2) + 1) / 2 * rect.height;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary + '30';
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, edges, hoveredNode, colors]);

  // Mouse interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Check for node hover
    const hovered = nodes.find((node) => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });
    setHoveredNode(hovered || null);
  };

  return (
    <div className="relative h-full min-h-[240px] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Hover tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-2 text-sm shadow-xl z-10"
          style={{
            left: Math.min(mousePos.x + 10, 200),
            top: Math.min(mousePos.y + 10, 180),
          }}
        >
          <div className="font-medium text-white">{hoveredNode.label}</div>
          <div className="text-xs text-slate-400 capitalize">{hoveredNode.type}</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          Interactive
        </span>
      </div>
    </div>
  );
}
