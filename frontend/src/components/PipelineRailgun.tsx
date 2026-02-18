"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";

const PipelineRailgun = () => {
    const [scope, animate] = useAnimate();
    const [activeStage, setActiveStage] = useState(0);
    const [showBeam, setShowBeam] = useState(false);

    useEffect(() => {
        const runSequence = async () => {
            // SCENE CONFIG
            // Container is 1000px wide. Padding 50px.
            // Rail starts at 50px, ends at 950px. Length 900px.
            // Node Positions (Center of nodes):
            // Source: 50px
            // Intelligence: 350px (+300)
            // Artifact: 650px (+300)
            // Edge: 950px (+300)

            const POS = [50, 350, 650, 950];

            // --- STEP 0: RESET ---
            setActiveStage(0);
            setShowBeam(false);

            // Instant Reset Traveler to Source (Invisible first)
            await animate("#traveler", {
                x: POS[0],
                y: "-50%", // Center vertically
                opacity: 0,
                scale: 0.5,
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                rotate: 0,
                borderWidth: "0px",
                width: "24px",
                height: "24px",

                boxShadow: "0 0 0px rgba(255,255,255,0)"
            }, { duration: 0 });

            // Fade in at Source
            await animate("#traveler", { opacity: 1, boxShadow: "0 0 15px rgba(255,255,255,0.8)" }, { duration: 0.5 });

            // --- STEP 1: INGEST (Move Source -> Intelligence) ---
            await animate("#traveler", { x: POS[1] }, { duration: 1.5, ease: "linear" });

            // --- STEP 2: ANALYZE (Stop & Spin) ---
            setActiveStage(1);

            // Morph to Ring
            await animate("#traveler", {
                backgroundColor: "transparent",
                borderWidth: "3px",
                borderColor: "#06b6d4", // Cyan
                scale: 1.8,
                borderStyle: "dashed"
            }, { duration: 0.3 });

            // Spin (360 x 3 = 1080 deg) FAST
            await animate("#traveler", {
                rotate: 1080,
                boxShadow: "0 0 30px #06b6d4"
            }, { duration: 2, ease: "easeInOut" });

            // --- STEP 3: BUILD (Morph -> Transfer) ---
            // Morph to Cube
            await animate("#traveler", {
                rotate: 0,
                scale: 1.2,
                borderRadius: "0%", // Cube
                backgroundColor: "#f59e0b", // Amber
                borderColor: "#f59e0b",
                borderWidth: "0px",
                borderStyle: "solid",
                boxShadow: "0 0 30px #f59e0b"
            }, { duration: 0.4 });

            // Move to Artifact
            await animate("#traveler", { x: POS[2] }, { duration: 1.5, ease: "linear" });

            // --- STEP 4: CONTAINERIZE (Stop & Thud) ---
            setActiveStage(2);

            // Heavy Pulse (Scale Up -> Down)
            await animate("#traveler", { scale: 1.6 }, { duration: 0.3, ease: "easeOut" });
            await animate("#traveler", { scale: 1.2 }, { duration: 0.3, ease: "circIn" }); // Thud

            // --- STEP 5: DELIVER (Transfer to Edge) ---
            await animate("#traveler", { x: POS[3] }, { duration: 1.5, ease: "linear" });

            // --- STEP 6: LIVE (Vanish & Beam) ---
            setActiveStage(3);

            // Vanish Traveler
            await animate("#traveler", { opacity: 0, scale: 0 }, { duration: 0.2 });

            // Trigger Beam animation via state
            setShowBeam(true);

            // Wait for Beam cycle to finish visually
            await new Promise(resolve => setTimeout(resolve, 2000));

            // --- LOOP ---
            runSequence();
        };

        runSequence();
    }, [animate]);

    return (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-black/40 rounded-xl border border-white/5 backdrop-blur-sm" ref={scope}>
            {/* The Scene Container - Fixed Width for consistent physics */}
            <div className="relative w-[1000px] h-[300px] flex items-center justify-between px-[50px]">

                {/* The Rail */}
                <div className="absolute top-1/2 left-[50px] right-[50px] h-1 bg-white/10 rounded-full overflow-hidden z-0">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] animate-[shimmer_3s_infinite]" />
                </div>

                {/* THE TRAVELER (Dynamic Actor) */}
                <motion.div
                    id="traveler"
                    className="absolute top-1/2 left-0 z-20 -mt-[12px]" // -mt is half of 24px height
                // Initial movement handled by animate()
                />

                {/* BEAM EFFECT (Separate Element) */}
                {showBeam && (
                    <motion.div
                        className="absolute top-1/2 right-[50px] w-4 h-[200px] bg-green-500 origin-bottom z-10 blur-xl opacity-50" // Glow
                        style={{ bottom: "50%", translateX: "50%" }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: [0, 1.5, 2], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                )}
                {showBeam && (
                    <motion.div
                        className="absolute top-1/2 right-[50px] w-1 h-[200px] bg-white origin-bottom z-20" // Core
                        style={{ bottom: "50%", translateX: "50%" }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: [0, 1.5, 2], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                )}
                {/* Shockwave */}
                {showBeam && (
                    <motion.div
                        className="absolute top-1/2 right-[50px] w-10 h-10 rounded-full border-2 border-green-400 z-20"
                        style={{ marginTop: "-20px", marginRight: "-20px" }}
                        initial={{ scale: 0.5, opacity: 1, borderWidth: "5px" }}
                        animate={{ scale: 4, opacity: 0, borderWidth: "0px" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                )}

                {/* STATIC NODES */}
                <RailNode label="SOURCE" sub="INGEST" active={activeStage >= 0} color="border-white" glow="shadow-white/50" />
                <RailNode label="INTELLIGENCE" sub="BUILD" active={activeStage >= 1} color="border-cyan-500" glow="shadow-cyan-500/50" />
                <RailNode label="ARTIFACT" sub="CONTAINER" active={activeStage >= 2} color="border-amber-500" glow="shadow-amber-500/50" />
                <RailNode label="EDGE" sub="GLOBAL" active={activeStage === 3} color="border-green-500" glow="shadow-green-500/50" />

            </div>
        </div>
    );
};

// Static Node Component
const RailNode = ({ label, sub, active, color, glow }: any) => {
    return (
        <div className="relative flex flex-col items-center justify-center gap-6 z-10 w-20">
            {/* Ring */}
            <div className={clsx(
                "w-16 h-16 rounded-full border-2 transition-all duration-500 flex items-center justify-center bg-black/80 backdrop-blur-md",
                active ? `${color} ${glow} shadow-[0_0_30px_var(--tw-shadow-color)] scale-110` : "border-white/10 scale-100 opacity-50"
            )}>
                {/* Inner Dot */}
                <div className={clsx("w-2 h-2 rounded-full transition-colors", active ? "bg-white animate-pulse" : "bg-white/10")} />
            </div>

            {/* Labels */}
            <div className="absolute top-24 flex flex-col items-center w-32 text-center">
                <span className={clsx("text-xs font-mono font-bold tracking-widest transition-colors duration-500", active ? "text-white" : "text-white/20")}>
                    {label}
                </span>
                <span className="text-[10px] text-white/20 tracking-widest uppercase mt-1">
                    {sub}
                </span>
            </div>
        </div>
    );
}

export default PipelineRailgun;
