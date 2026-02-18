"use client";

import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    ConnectionMode,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import type {
    Node,
    Edge,
    NodeProps,
    Connection,
    EdgeChange,
    NodeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Service } from '../types';
import { GitBranch, Server } from 'lucide-react';

// --- Custom Node Component ---
const ServiceNode = ({ data }: NodeProps<{ service: Service; onSelect: (s: Service) => void }>) => {
    const { service, onSelect } = data;

    // Determine status color
    const statusColor = service.status === 'live' ? 'bg-emerald-500' :
        service.status === 'failed' ? 'bg-red-500' :
            service.status === 'building' ? 'bg-amber-500' : 'bg-slate-500';

    return (
        <div
            onClick={() => onSelect(service)}
            className="w-[200px] bg-[#141414] border border-[#2C2C2C] rounded-lg shadow-xl overflow-hidden group hover:border-[#444] transition-colors cursor-pointer"
        >
            <div className="h-1 bg-[#2C2C2C] w-full relative">
                <div className={`absolute left-0 top-0 h-full ${statusColor} w-full opacity-80`} />
            </div>

            <Handle type="target" position={Position.Top} className="!bg-[#444] !w-2 !h-2" />

            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                        <span className="text-[#E3E3E3] font-medium text-xs truncate max-w-[120px]">{service.name}</span>
                    </div>
                    <Server className="w-3.5 h-3.5 text-[#666]" />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#888]">
                        <GitBranch className="w-3 h-3" />
                        <span className="truncate">{service.branch}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#666] font-mono bg-[#0A0A0A] px-1.5 py-0.5 rounded border border-[#222]">
                        <span>PORT</span>
                        <span className="text-[#AAA]">{service.port || 80}</span>
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-[#444] !w-2 !h-2" />
        </div>
    );
};

// Define nodeTypes outside logic component to avoid re-creation
const nodeTypes = {
    serviceNode: ServiceNode,
};

interface ServiceGraphProps {
    services: Service[];
    onSelect: (s: Service) => void;
}

export default function ServiceGraph({ services, onSelect }: ServiceGraphProps) {
    // Initial layout calculation
    const getLayout = (list: Service[]) => {
        return list.map((s, index) => ({
            id: s.id,
            type: 'serviceNode',
            position: { x: (index % 3) * 280, y: Math.floor(index / 3) * 180 }, // Spaced out grid
            data: { service: s, onSelect },
        }));
    };

    const initialNodes = useMemo(() => getLayout(services), [services, onSelect]);
    const initialEdges: Edge[] = [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync when services change
    useEffect(() => {
        setNodes(getLayout(services));
    }, [services, setNodes]); // Added setNodes to deps

    return (
        <div className="w-full h-full bg-[#050505] relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                className="bg-[#050505]"
                minZoom={0.5}
                maxZoom={2}
            >
                {/* Lighter dots for visibility */}
                <Background color="#333" gap={24} size={1.5} />

                {/* Custom Styled Controls */}
                <Controls
                    className="!bg-[#141414] !border-[#333] !shadow-xl [&>button]:!border-b-[#333] [&>button]:!fill-[#888] [&>button:hover]:!bg-[#222] [&>button:hover]:!fill-white"
                    showInteractive={false}
                />
            </ReactFlow>
        </div>
    );
}
