"use client";

import { motion } from "framer-motion";
import { GitBranch, ShieldCheck, Workflow, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const PipelineVisualizer = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2000); // 2s per step cycle
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center py-24">
            {/* Pipeline Container */}
            <div className="relative w-full max-w-5xl flex items-center justify-between px-16">

                {/* Base Line (Dark) */}
                <div className="absolute top-8 left-16 right-16 h-[2px] bg-white/10 -z-20" />

                {/* Progress Line (Glowing Blue) */}
                <motion.div
                    className="absolute top-8 left-16 h-[2px] bg-primary shadow-[0_0_15px_var(--primary)] -z-10"
                    initial={{ width: "0%" }}
                    animate={{
                        width: step === 0 ? "0%" : step === 1 ? "33%" : step === 2 ? "66%" : "100%"
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Nodes */}
                <Node
                    icon={<GitBranch size={24} />}
                    label="Source Integration"
                    active={step >= 0}
                    current={step === 0}
                />
                <Node
                    icon={<ShieldCheck size={24} />}
                    label="Automated Build & Security Scan"
                    active={step >= 1}
                    current={step === 1}
                />
                <Node
                    icon={<Workflow size={24} />}
                    label="Orchestration & Delivery"
                    active={step >= 2}
                    current={step === 2}
                />
                <Node
                    icon={<Globe size={24} />}
                    label="Global Availability"
                    active={step >= 3}
                    current={step === 3}
                />

            </div>
        </div>
    );
};

const Node = ({ icon, label, active, current }: any) => {
    return (
        <div className="relative flex flex-col items-center gap-6 group">
            {/* Icon Circle */}
            <motion.div
                animate={{
                    scale: current ? 1.1 : 1,
                    borderColor: active ? (current ? "#3b82f6" : "#3b82f6") : "#ffffff10", // Blue border if active
                    backgroundColor: current ? "rgba(59, 130, 246, 0.1)" : "transparent",
                    boxShadow: current ? "0 0 30px rgba(59, 130, 246, 0.5), inset 0 0 10px rgba(59, 130, 246, 0.2)" : "none",
                }}
                transition={{ duration: 0.5 }}
                className={clsx(
                    "w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 z-10 bg-black/50 backdrop-blur-md", // Added bg-black/50 to hide line behind
                    active ? "text-white border-primary/50" : "text-white/20 border-white/5"
                )}
            >
                {icon}
            </motion.div>

            {/* Label */}
            <div className="flex flex-col items-center text-center gap-1 h-12 w-40">
                <span className={clsx(
                    "text-sm font-medium tracking-wide transition-colors duration-500",
                    active ? "text-white" : "text-white/20"
                )}>
                    {label.split(' & ').map((part: string, i: number) => (
                        // Split label for better 2-line layout if containing spaces
                        <span key={i} className="block">{part} {i === 0 && label.includes('&') ? '&' : ''}</span>
                    ))}
                    {!label.includes('&') && label}
                </span>
            </div>

        </div>
    );
};

export default PipelineVisualizer;
