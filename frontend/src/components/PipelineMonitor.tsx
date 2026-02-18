"use client";

import { motion } from "framer-motion";
import { HardDrive, Cpu, ShieldCheck, Globe, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const DUMMY_LOGS = [
    "> INITIALIZING SYSTEM...",
    "> CHECKING KERNEL...",
    "> MOUNTING VOLUMES...",
    "> ESTABLISHING LINK...",
    "> VERIFYING HASH...",
    "> PACKET RECEIVED.",
    "> OPTIMIZING...",
    "> DAEMON STARTING...",
    "> SYNC COMPLETE.",
];

const PipelineMonitor = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 3000); // 3s per step for more "monitoring" time
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center py-20 relative">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] -z-10" />

            {/* Monitor Container */}
            <div className="relative w-full max-w-5xl aspect-video md:aspect-[2/1] border border-white/10 bg-black/40 backdrop-blur-md rounded-xl p-8 shadow-2xl overflow-hidden">
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />

                {/* Header System Status */}
                <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-mono text-blue-400 opacity-70">
                    <Activity size={14} className="animate-pulse" />
                    <span>SYSTEM STATUS: NORMAL</span>
                    <span className="ml-4 text-white/30">UPTIME: 99.99%</span>
                </div>

                {/* SVG Circuit Connections Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L6,3 z" fill="#3b82f6" />
                        </marker>
                    </defs>

                    {/* We define grid areas relative to percentage for SVG lines */}
                    {/* Node 1 (25%, 30%) -> Node 2 (75%, 30%) -> Node 3 (75%, 70%) -> Node 4 (25%, 70%) */}

                    {/* Static Path Background */}
                    <path d="M25% 30% H75% V70% H25%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

                    {/* Active Path Animation */}
                    <motion.path
                        d="M25% 30% H75% V70% H25%"
                        fill="none"
                        stroke="url(#line-gradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: step === 0 ? 0.33 : step === 1 ? 0.66 : step === 2 ? 1 : 0,
                            opacity: step < 3 ? 1 : 0
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                    />

                    {/* Data Packet moving along the path */}
                    {/* This requires cleaner separate segments or a motion value hack, simplifying for reliability:
              We will just light up the path segments as phases change.
          */}
                </svg>

                {/* 2x2 Grid Layout */}
                <div className="relative z-10 grid grid-cols-2 gap-12 sm:gap-24 h-full items-center justify-items-center">

                    {/* 1. Source Ingestion (Top Left) */}
                    <NodeCard
                        title="SOURCE INGESTION"
                        icon={<HardDrive size={18} />}
                        active={step === 0}
                        logs={["DETECTING REPO...", "GIT CLONE: SUCCESS", "HASH: a1b2c3d"]}
                        position="top-left"
                    />

                    {/* 2. Intelligence Engine (Top Right) */}
                    <NodeCard
                        title="RESOLUTION ENGINE"
                        icon={<Cpu size={18} />}
                        active={step === 1}
                        logs={["ANALYZING STRUCTURE...", "NIXPACKS: DETECTED", "PLAN: NODEJS 20"]}
                        position="top-right"
                    />

                    {/* 4. Global Mesh (Bottom Left) - Reordered in DOM for grid but visually this is step 4 */}
                    <div className="col-start-1 row-start-2">
                        <NodeCard
                            title="EDGE DELIVERY"
                            icon={<Globe size={18} />}
                            active={step === 3}
                            logs={["ROUTING TRAFFIC...", "DNS PROPAGATION", "STATUS: 200 OK"]}
                            position="bottom-left"
                        />
                    </div>

                    {/* 3. Immutable Assembly (Bottom Right) */}
                    <div className="col-start-2 row-start-2">
                        <NodeCard
                            title="IMMUTABLE ASSEMBLY"
                            icon={<ShieldCheck size={18} />}
                            active={step === 2}
                            logs={["BUILDING LAYER 1...", "SIGNING ARTIFACT", "PUSH: REGISTRY"]}
                            position="bottom-right"
                        />
                    </div>

                </div>

            </div>
        </div>
    );
};

const NodeCard = ({ title, icon, active, logs, position }: any) => {
    const [logIndex, setLogIndex] = useState(0);

    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => {
            setLogIndex((prev) => (prev + 1) % logs.length);
        }, 800);
        return () => clearInterval(interval);
    }, [active, logs]);

    return (
        <motion.div
            className={clsx(
                "bg-black/80 backdrop-blur-xl border transition-all duration-500 w-64 h-32 rounded-lg overflow-hidden flex flex-col shadow-lg",
                active ? "border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-105" : "border-white/5 opacity-50 grayscale"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: active ? 1 : 0.5, y: 0, scale: active ? 1.05 : 1 }}
        >
            {/* Header */}
            <div className={clsx("px-3 py-2 border-b flex items-center gap-2 text-xs font-bold tracking-wider", active ? "bg-cyan-950/30 text-cyan-400 border-cyan-500/30" : "bg-white/5 text-white/40 border-white/5")}>
                {icon}
                {title}
            </div>

            {/* Body (Terminal) */}
            <div className="p-3 font-mono text-[10px] space-y-1 text-white/70 h-full relative">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" /> {/* Scanline */}

                {active ? (
                    logs.slice(0, logIndex + 1).slice(-3).map((log: string, i: number) => (
                        <div key={i} className="animate-pulse text-cyan-200/80">{log}</div>
                    ))
                ) : (
                    <div className="text-white/20">WAITING FOR SIGNAL...</div>
                )}
            </div>
        </motion.div>
    );
};

export default PipelineMonitor;
