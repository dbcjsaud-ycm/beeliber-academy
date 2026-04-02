"use client";

import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────

export interface Position { x: number; y: number }

export interface NodeData {
  id: string;
  name: string;
  type: string;
  color: string;
  glowColor: string;
  position: Position;
  fields: { label: string; value: string }[];
  inputs: number;
  outputs: number;
  description: string;
  icon?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface CanvasPreset {
  nodes: NodeData[];
  connections: Connection[];
  extraNodes: Omit<NodeData, "id" | "position">[];
  title: string;
  subtitle: string;
  guide: string[];
}

// ─── Constants ───────────────────────────────────────

const NODE_WIDTH = 260;
const NODE_HEIGHT = 150;

function getPortPosition(node: NodeData, port: "input" | "output"): Position {
  if (port === "input") return { x: node.position.x, y: node.position.y + NODE_HEIGHT / 2 };
  return { x: node.position.x + NODE_WIDTH, y: node.position.y + NODE_HEIGHT / 2 };
}

function bezierPath(from: Position, to: Position): string {
  const dx = Math.abs(to.x - from.x) * 0.5;
  return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
}

// ─── Canvas Component ────────────────────────────────

export default function WorkflowCanvas({ preset }: { preset: CanvasPreset }) {
  const [nodes, setNodes] = useState<NodeData[]>(preset.nodes);
  const [connections, setConnections] = useState<Connection[]>(preset.connections);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const getCanvasCoords = useCallback((clientX: number, clientY: number): Position => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: clientX, y: clientY };
    return { x: (clientX - rect.left - pan.x) / zoom, y: (clientY - rect.top - pan.y) / zoom };
  }, [pan, zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setDragging(nodeId);
    setDragOffset({ x: coords.x - node.position.x, y: coords.y - node.position.y });
    setSelectedNode(nodeId);
  }, [nodes, getCanvasCoords]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setMousePos(coords);

    if (isPanning) {
      setPan(prev => ({
        x: prev.x + (e.clientX - panStart.x),
        y: prev.y + (e.clientY - panStart.y),
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }

    if (dragging) {
      setNodes(prev => prev.map(n =>
        n.id === dragging ? { ...n, position: { x: coords.x - dragOffset.x, y: coords.y - dragOffset.y } } : n
      ));
    }
  }, [dragging, dragOffset, getCanvasCoords, isPanning, panStart]);

  const handleMouseUp = useCallback(() => { setDragging(null); setIsPanning(false); }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === "svg") {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedNode(null);
      setConnecting(null);
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      setZoom(z => Math.max(0.3, Math.min(2, z - e.deltaY * 0.001)));
    } else {
      setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  }, []);

  const handlePortClick = useCallback((nodeId: string, port: "input" | "output") => {
    if (port === "output") {
      setConnecting(nodeId);
    } else if (connecting && connecting !== nodeId) {
      if (!connections.some(c => c.from === connecting && c.to === nodeId)) {
        setConnections(prev => [...prev, { id: `c-${Date.now()}`, from: connecting, to: nodeId }]);
      }
      setConnecting(null);
    }
  }, [connecting, connections]);

  const addNode = useCallback((template: Omit<NodeData, "id" | "position">) => {
    setNodes(prev => [...prev, { ...template, id: `n-${Date.now()}`, position: { x: 200 + Math.random() * 400, y: 100 + Math.random() * 300 } }]);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setConnections(prev => prev.filter(c => c.from !== nodeId && c.to !== nodeId));
    setSelectedNode(null);
  }, []);

  const resetCanvas = useCallback(() => {
    setNodes(preset.nodes);
    setConnections(preset.connections);
    setSelectedNode(null);
    setZoom(1);
  }, [preset]);

  const selected = nodes.find(n => n.id === selectedNode);

  return (
    <div className="flex flex-1 overflow-hidden gap-3">
      {/* 좌측 사이드바 */}
      <aside className="glass-panel w-[280px] shrink-0 overflow-y-auto p-4">
        {selected ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: selected.color, boxShadow: `0 0 8px ${selected.glowColor}` }} />
                <h3 className="font-bold text-sm">{selected.icon} {selected.name}</h3>
              </div>
              <button className="text-xs text-red-400 hover:text-red-300" onClick={() => deleteNode(selected.id)}>삭제</button>
            </div>
            <Badge className="mb-3 text-[10px]" style={{ background: `${selected.color}20`, color: selected.color }}>{selected.type}</Badge>
            <p className="text-xs text-secondary-dark mb-4">{selected.description}</p>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-secondary-dark">파라미터</p>
              {selected.fields.map((f, i) => (
                <div key={i}>
                  <label className="text-[10px] text-secondary-dark block mb-1">{f.label}</label>
                  <input className="glass-input w-full px-3 py-2 text-xs" defaultValue={f.value} />
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1 text-xs text-secondary-dark">
              <p>입력: <strong className="text-white">{connections.filter(c => c.to === selected.id).length}</strong>개</p>
              <p>출력: <strong className="text-white">{connections.filter(c => c.from === selected.id).length}</strong>개</p>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-bold mb-1 text-sm">{preset.title}</h3>
            <p className="text-xs text-secondary-dark mb-4">{preset.subtitle}</p>

            <p className="text-[10px] font-semibold text-secondary-dark mb-2">노드 추가</p>
            <div className="space-y-2 mb-4">
              {preset.extraNodes.map((n, i) => (
                <button key={i} onClick={() => addNode(n)} className="w-full text-left glass-panel-light p-2.5 rounded-lg hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: n.color }} />
                    <span className="text-xs font-semibold">{n.icon} {n.name}</span>
                  </div>
                  <p className="text-[10px] text-secondary-dark mt-1">{n.description}</p>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5">
              <p className="text-[10px] font-semibold text-secondary-dark mb-2">실습 가이드</p>
              <ol className="text-[10px] text-secondary-dark space-y-1.5 list-decimal list-inside">
                {preset.guide.map((g, i) => <li key={i}>{g}</li>)}
              </ol>
            </div>
          </div>
        )}
      </aside>

      {/* 캔버스 */}
      <div
        ref={canvasRef}
        className="flex-1 rounded-2xl overflow-hidden relative cursor-crosshair"
        style={{ background: "#08080a", backgroundImage: "radial-gradient(circle, #1f2025 1px, transparent 1px)", backgroundSize: "24px 24px", cursor: isPanning ? "grabbing" : "grab" }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}>
          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            const from = getPortPosition(fromNode, "output");
            const to = getPortPosition(toNode, "input");
            return (
              <g key={conn.id}>
                <path d={bezierPath(from, to)} fill="none" stroke="#333" strokeWidth={2} />
                <path d={bezierPath(from, to)} fill="none" stroke={fromNode.color} strokeWidth={2} strokeOpacity={0.5} strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
                </path>
              </g>
            );
          })}
          {connecting && (() => {
            const fromNode = nodes.find(n => n.id === connecting);
            if (!fromNode) return null;
            return <path d={bezierPath(getPortPosition(fromNode, "output"), mousePos)} fill="none" stroke="#666" strokeWidth={2} strokeDasharray="6 3" />;
          })()}
        </svg>

        <div className="absolute inset-0" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}>
          {nodes.map((node) => (
            <div
              key={node.id}
              className="absolute select-none"
              style={{ left: node.position.x, top: node.position.y, width: NODE_WIDTH }}
              onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            >
              <div
                className="rounded-2xl p-4 transition-all"
                style={{
                  background: "rgba(18, 18, 22, 0.9)", backdropFilter: "blur(12px)",
                  border: `1px solid ${selectedNode === node.id ? node.color : "rgba(255,255,255,0.08)"}`,
                  boxShadow: selectedNode === node.id ? `0 0 30px ${node.glowColor}` : "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: node.color, boxShadow: `0 0 8px ${node.glowColor}` }} />
                  <span className="font-bold text-xs">{node.icon} {node.name}</span>
                  <Badge className="ml-auto text-[9px] px-1.5 py-0" style={{ background: `${node.color}20`, color: node.color }}>{node.type}</Badge>
                </div>
                {node.fields.map((f, i) => (
                  <div key={i} className="mb-1.5">
                    <span className="text-[9px] text-secondary-dark">{f.label}</span>
                    <div className="glass-input px-2 py-1 text-[11px] mt-0.5">{f.value}</div>
                  </div>
                ))}
              </div>

              {node.inputs > 0 && (
                <button className="absolute w-3.5 h-3.5 rounded-full border-2 hover:scale-150 transition-transform z-10"
                  style={{ left: -7, top: NODE_HEIGHT / 2 - 7, background: connecting ? node.color : "#1a1a1e", borderColor: node.color, boxShadow: connecting ? `0 0 12px ${node.glowColor}` : "none" }}
                  onClick={(e) => { e.stopPropagation(); handlePortClick(node.id, "input"); }} />
              )}
              {node.outputs > 0 && (
                <button className="absolute w-3.5 h-3.5 rounded-full border-2 hover:scale-150 transition-transform z-10"
                  style={{ right: -7, top: NODE_HEIGHT / 2 - 7, background: connecting === node.id ? node.color : "#1a1a1e", borderColor: node.color, boxShadow: connecting === node.id ? `0 0 12px ${node.glowColor}` : "none" }}
                  onClick={(e) => { e.stopPropagation(); handlePortClick(node.id, "output"); }} />
              )}
            </div>
          ))}
        </div>

        {/* 하단 툴바 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel-light rounded-full px-4 py-2 flex items-center gap-3 z-10">
          <button className="text-secondary-dark hover:text-white text-sm px-2" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}>−</button>
          <span className="text-xs text-secondary-dark w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button className="text-secondary-dark hover:text-white text-sm px-2" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>+</button>
          <div className="w-px h-4 bg-white/10" />
          <button className="text-xs text-secondary-dark hover:text-white" onClick={resetCanvas}>리셋</button>
        </div>

        {connecting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel-light rounded-full px-4 py-2 z-10">
            <span className="text-xs text-amber-400">🔗 연결 모드: 대상 노드의 입력 포트(●)를 클릭하세요</span>
          </div>
        )}
      </div>
    </div>
  );
}
