"use client";

import { motion, useAnimate } from "framer-motion";
import { GitBranch, Cpu, Box, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const PipelineReactor = () => {
    const [scope, animate] = useAnimate();
    const [activeStage, setActiveStage] = useState(0);

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                // RESET
                setActiveStage(0);
                await animate("#traveler", {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    rotate: 0,
                    borderWidth: "0px"
                }, { duration: 0 }); // Instant reset

                // 1. INGEST (Source -> Intelligence)
                // Move to Node 2 (approx 33% of width)
                await animate("#traveler", { x: 280 }, { duration: 1, ease: "easeInOut" });

                // 2. INTELLIGENCE (The Reactor)
                setActiveStage(1);
                // Morph to Wireframe Ring
                await animate("#traveler", {
                    backgroundColor: "transparent",
                    borderColor: "#06b6d4", // Cyan
                    borderWidth: "4px",
                    scale: 1.5
                }, { duration: 0.3 });

                // Spin and Glow
                await animate("#traveler", {
                    rotate: 360,
                    boxShadow: "0 0 30px #06b6d4"
                }, { duration: 1.5, ease: "linear" });

                // 3. TRANSITION (Implode -> Artifact)
                // Implode
                await animate("#traveler", {
                    scale: 0.5,
                    borderWidth: "0px",
                    boxShadow: "none"
                }, { duration: 0.2 });

                // Morph to Amber Cube
                setActiveStage(2);
                await animate("#traveler", {
                    backgroundColor: "#f59e0b", // Amber
                    borderRadius: "0%", // Cube
                    scale: 1,
                    rotate: 0
                }, { duration: 0.3 });

                // Move to Node 3 (Artifact) -> Node 4 (Edge)
                // Actually, physically moving significantly? Let's say Node 2 is at 280px.
                // Node 3 (Containerize) is at approx 560px.
                await animate("#traveler", { x: 560 }, { duration: 1, ease: "easeInOut" });

                // Wait at Artifact briefly?
                // Let's slide smoothly to Edge (approx 840px)
                await animate("#traveler", { x: 840 }, { duration: 1, ease: "easeInOut" });

                // 4. EDGE (The Strike)
                setActiveStage(3);
                // Vanish Traveler
                await animate("#traveler", { opacity: 0, scale: 0 }, { duration: 0.1 });

                // Beam Effect (triggered by state change mostly, but let's wait)
                await new Promise(r => setTimeout(r, 1500)); // Wait for beam/shockwave to finish visually
            }
        };
        sequence();
    }, [animate]);

    return (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-black" ref={scope}>
            <div className="relative w-[1000px] h-[300px] flex items-center justify-between px-10">

                {/* The Track */}
                <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-white/10" />

                {/* The Traveler */}
                <motion.div
                    id="traveler"
                    className="absolute top-1/2 left-10 w-8 h-8 -mt-4 z-20"
                    initial={{ borderRadius: "50%", backgroundColor: "#fff" }}
                />

                {/* BEAM (Only at Stage 3) */}
                {activeStage === 3 && (
                    <motion.div
                        className="absolute top-1/2 right-10 w-2 h-full bg-green-500 origin-bottom z-10"
                        style={{ bottom: "50%" }}
                        initial={{ scaleY: 0, opacity: 1 }}
                        animate={{ scaleY: 1.5, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                )}

                {/* SHOCKWAVE (Only at Stage 3) */}
                {activeStage === 3 && (
                    <motion.div
                        className="absolute top-1/2 right-10 w-4 h-4 rounded-full border-2 border-green-500 z-10"
                        style={{ marginTop: "-8px", marginRight: "-8px" }}
                        initial={{ scale: 1, opacity: 1, borderWidth: "4px" }}
                        animate={{ scale: 20, opacity: 0, borderWidth: "0px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                )}

                {/* NODES */}
                <Node label="Source" sub="Ingest" icon={<GitBranch />} active={activeStage >= 0} color="text-white" />
                <Node label="Intelligence" sub="Smart Build" icon={<Cpu />} active={activeStage === 1} color="text-cyan-400" />
                <Node label="Artifact" sub="Containerize" icon={<Box />} active={activeStage === 2} color="text-amber-400" />
                <Node label="Edge" sub="Delivery" icon={<Globe />} active={activeStage === 3} color="text-green-400" />

            </div>
        </div>
    );
};

const Node = ({ label, sub, icon, active, color }: any) => {
    return (
        <motion.div
            className={clsx(
                "relative z-10 w-40 h-48 border border-white/5 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center gap-4 transition-all duration-500 rounded-xl",
                active ? `border-current ${color} shadow-[0_0_30px_rgba(255,255,255,0.1)]` : "border-white/5 text-white/20"
            )}
            animate={{
                y: active ? -10 : 0,
                scale: active ? 1.05 : 1
            }}
        >
            <div className={clsx("p-4 rounded-full bg-white/5", active ? "bg-white/10" : "")}>
                {icon}
            </div>
            <div className="text-center">
                <div className="text-lg font-bold tracking-tight">{label}</div>
                <div className="text-xs uppercase tracking-widest opacity-50">{sub}</div>
            </div>

            {/* Active Status Indicator */}
            <div className={clsx("absolute bottom-0 left-0 w-full h-1 transition-all duration-300", active ? "bg-current" : "bg-transparent")} />
        </motion.div>
    );
}

export default PipelineReactor;
