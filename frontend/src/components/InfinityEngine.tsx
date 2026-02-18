"use client";

import { motion, useAnimate } from "framer-motion";
import { GitBranch, Box, Rocket, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const InfinityEngine = () => {
    const [scope, animate] = useAnimate();
    const [activeStage, setActiveStage] = useState(0); // 0=Idle, 1=Source, 2=Build, 3=Deploy, 4=Live

    // Infinity Path Definition (Optimized Figure 8)
    // Left Loop: Center(400,150) -> TopLeft -> Left -> BottomLeft -> Center
    // Right Loop: Center -> TopRight -> Right -> BottomRight -> Center
    // Total Length is roughly 1500 units.
    const infinityPath = "M 400 150 C 350 100 250 50 150 50 C 50 50 50 250 150 250 C 250 250 350 200 400 150 C 450 100 550 50 650 50 C 750 50 750 250 650 250 C 550 250 450 200 400 150 Z";

    useEffect(() => {
        const runSequence = async () => {
            while (true) {
                // -- RESET --
                setActiveStage(0);
                await animate("#traveler", { offsetDistance: "0%" }, { duration: 0 });

                // -- TRAVEL TO SOURCE (Top Left) --
                // Path starts at Center(400,150), goes Up-Left. 
                // "Source" is roughly at 12% of the path length.
                await animate("#traveler", { offsetDistance: "12%" }, { duration: 1.5, ease: "easeInOut" });

                // -- STOP @ SOURCE --
                setActiveStage(1);
                await new Promise(r => setTimeout(r, 800)); // Process

                // -- TRAVEL TO BUILD (Bottom Left) --
                // "Build" is roughly at 37% of the path length (bottom of left loop).
                setActiveStage(0); // In transit
                await animate("#traveler", { offsetDistance: "37%" }, { duration: 1.5, ease: "easeInOut" });

                // -- STOP @ BUILD --
                setActiveStage(2);
                await new Promise(r => setTimeout(r, 1200)); // Build takes longer (Compiling...)

                // -- TRAVEL TO DEPLOY (Top Right) --
                // "Deploy" is roughly at 62% of the path length (top of right loop).
                setActiveStage(0); // In transit (Crossing center)
                await animate("#traveler", { offsetDistance: "62%" }, { duration: 2.0, ease: "easeInOut" }); // Long travel across bridge

                // -- STOP @ DEPLOY --
                setActiveStage(3);
                await new Promise(r => setTimeout(r, 800));

                // -- TRAVEL TO LIVE (Bottom Right) --
                // "Live" is roughly at 87% of the path length (bottom of right loop).
                setActiveStage(0); // In transit
                await animate("#traveler", { offsetDistance: "87%" }, { duration: 1.5, ease: "easeInOut" });

                // -- STOP @ LIVE --
                setActiveStage(4);
                await new Promise(r => setTimeout(r, 2000)); // Live state holds

                // -- RETURN TO CENTER --
                setActiveStage(0); // In transit
                await animate("#traveler", { offsetDistance: "100%" }, { duration: 1.5, ease: "easeInOut" });
            }
        };

        runSequence();
    }, [animate]);

    return (
        <div className="w-full relative flex items-center justify-center py-20 overflow-visible" ref={scope}>

            {/* Container */}
            <div className="relative w-[800px] h-[300px]">

                {/* SVG Layer */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 800 300">
                    <defs>
                        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background Track (Dark) */}
                    <path
                        d={infinityPath}
                        fill="none"
                        stroke="#1a1a1a"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* Overlay Track (Thin) */}
                    <path
                        d={infinityPath}
                        fill="none"
                        stroke="white"
                        strokeOpacity="0.1"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>

                {/* THE TRAVELER (The CSS Offset Path Particle) */}
                {/* Note: offset-path requires the path string. Tailwind supports arbitrary values. */}
                <div
                    id="traveler"
                    className="absolute top-0 left-0 w-[40px] h-[40px] z-30 flex items-center justify-center"
                    style={{
                        offsetPath: `path('${infinityPath}')`,
                        offsetAnchor: "center center",
                    }}
                >
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white] animate-pulse relative">
                        <div className="absolute inset-0 bg-blue-500 blur-sm rounded-full" />
                    </div>
                </div>

                {/* NODES */}
                {/* Positions calculated manually based on path curve extrema */}
                <Station x={150} y={50} icon={<GitBranch size={20} />} label="Source" active={activeStage === 1} />
                <Station x={150} y={250} icon={<Box size={20} />} label="Build" active={activeStage === 2} />
                <Station x={650} y={50} icon={<Rocket size={20} />} label="Deploy" active={activeStage === 3} />
                <Station x={650} y={250} icon={<Globe size={20} />} label="Live" active={activeStage === 4} />

                {/* Center Reactor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center z-20">
                    <div className="absolute inset-0 bg-black/80 rounded-full border border-white/10 backdrop-blur-sm" />
                    <div className={clsx(
                        "w-3 h-3 rounded-full transition-all duration-500",
                        activeStage === 0 ? "bg-blue-500 shadow-[0_0_20px_#3b82f6] scale-100" : "bg-white/20 scale-75"
                    )} />
                </div>

            </div>
        </div>
    );
};

const Station = ({ x, y, icon, label, active }: any) => {
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10"
            style={{ left: x, top: y }}
        >
            <motion.div
                className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 z-10 backdrop-blur-md",
                    active
                        ? "bg-black/90 border-blue-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)] scale-110"
                        : "bg-black/60 border-white/10 text-white/30 scale-100"
                )}
            >
                {icon}
            </motion.div>

            <div className="absolute top-16 w-32 text-center">
                <span className={clsx(
                    "text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                    active ? "text-white" : "text-white/20"
                )}>
                    {label}
                </span>
                {/* Status Indicator */}
                {active && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] text-blue-400 font-mono mt-1"
                    >
                        Processing...
                    </motion.div>
                )}
            </div>

            {/* Active Ripple */}
            {active && (
                <motion.div
                    className="absolute inset-0 rounded-2xl border border-blue-500/50 -z-10"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}
        </div>
    );
};

export default InfinityEngine;
