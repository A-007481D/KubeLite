"use client";

import { motion } from "framer-motion";
import { GitBranch, Cpu, Box, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const PipelineIsometric = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center py-32 perspective-1000 overflow-hidden">

            {/* 3D Container with Tilt */}
            <div
                className="relative w-full max-w-5xl h-64 flex items-center justify-center preserve-3d transform-style-3d rotate-x-20"
                style={{ transform: "rotateX(20deg)" }}
            >

                {/* Grid Floor */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_80%)] opacity-50 transform scale-150" />

                {/* The Stream Path (Background Line) */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5" />

                {/* The Photon (Animated Orb) */}
                <Photon />

                {/* Gates Container */}
                <div className="absolute inset-0 flex justify-between items-center px-10">
                    <Gate
                        index={0}
                        icon={<GitBranch size={24} />}
                        label="Ingest"
                        subLabel="Code"
                        color="text-white"
                        glowColor="rgba(255, 255, 255, 0.5)"
                    />
                    <Gate
                        index={1}
                        icon={<Cpu size={24} />}
                        label="Smart Build"
                        subLabel="Intelligence"
                        color="text-blue-400"
                        glowColor="rgba(59, 130, 246, 0.5)"
                    />
                    <Gate
                        index={2}
                        icon={<Box size={24} />}
                        label="Containerize"
                        subLabel="Artifact"
                        color="text-amber-400"
                        glowColor="rgba(251, 191, 36, 0.5)"
                    />
                    <Gate
                        index={3}
                        icon={<Globe size={24} />}
                        label="Global Edge"
                        subLabel="Delivery"
                        color="text-green-400"
                        glowColor="rgba(74, 222, 128, 0.5)"
                    />
                </div>

            </div>
        </div>
    );
};

const Photon = () => {
    return (
        <motion.div
            className="absolute top-1/2 left-0 -translate-y-1/2 z-20"
            animate={{
                left: ["0%", "33%", "66%", "100%"],
                // Color transitions: White -> Blue -> Amber -> Green
                backgroundColor: ["#ffffff", "#3b82f6", "#f59e0b", "#4ade80"],
                boxShadow: [
                    "0 0 20px 5px rgba(255,255,255,0.5)",
                    "0 0 30px 10px rgba(59,130,246,0.6)",
                    "0 0 30px 10px rgba(245,158,11,0.6)",
                    "0 0 50px 20px rgba(74,222,128,0.8)" // Explosion effect at end
                ],
                scale: [1, 1.2, 1.2, 2, 0] // Scaled up then vanish
            }}
            transition={{
                duration: 4,
                ease: "linear",
                repeat: Infinity,
                times: [0, 0.33, 0.66, 1]
            }}
        >
            <div className="w-4 h-4 rounded-full bg-inherit" />
        </motion.div>
    );
};

const Gate = ({ index, icon, label, subLabel, color, glowColor }: any) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        // Sync with photon cycle (4s duration)
        const cycle = 4000;
        // Timing: Node 0 at 0s, Node 1 at 1.33s, Node 2 at 2.66s, Node 3 at 4s
        const activationTime = index * (cycle / 3);

        const interval = setInterval(() => {
            setTimeout(() => {
                setActive(true);
                setTimeout(() => setActive(false), 500); // Pulse duration
            }, activationTime);
        }, cycle);

        return () => clearInterval(interval);
    }, [index]);

    return (
        <div className="relative group perspective-500">
            {/* 3D Glass Pane */}
            <motion.div
                className={clsx(
                    "relative w-32 h-40 rounded-xl border flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300 transform-style-3d",
                    active
                        ? "bg-white/10 border-white/40 shadow-[0_0_30px_var(--glow)] z-10 scale-110"
                        : "bg-white/5 border-white/10 grayscale hover:grayscale-0 hover:bg-white/10"
                )}
                style={{ "--glow": glowColor } as any}
                animate={{
                    rotateY: active ? 10 : 0,
                    y: active ? -10 : 0
                }}
            >
                <div className={clsx("mb-2 transition-colors duration-300", active ? color : "text-white/40")}>
                    {icon}
                </div>
                <div className={clsx("text-sm font-bold tracking-wider", active ? "text-white" : "text-white/40")}>
                    {label}
                </div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-1">
                    {subLabel}
                </div>

                {/* Bottom Reflector */}
                <div className={clsx("absolute -bottom-8 w-full h-8 bg-gradient-to-b from-white/10 to-transparent blur-md transition-opacity duration-300", active ? "opacity-100" : "opacity-0")} />

            </motion.div>
        </div>
    );
};

export default PipelineIsometric;
