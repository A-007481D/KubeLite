"use client";

import { motion, useAnimate } from "framer-motion";
import { GitBranch, Package, Layers, Globe, Check } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const PipelineTracker = () => {
    const [scope, animate] = useAnimate();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const runSequence = async () => {
            while (true) {
                // RESET
                setActiveStep(0);
                await animate("#progress-bar", { width: "0%" }, { duration: 0 });

                // STEP 1: SOURCE ACTIVATED
                setActiveStep(1);
                // Wait for "Source Processing"
                await new Promise(r => setTimeout(r, 1000));

                // MOVE TO STEP 2
                await animate("#progress-bar", { width: "33%" }, { duration: 0.8, ease: "easeInOut" });

                // STEP 2: BUILD ACTIVATED
                setActiveStep(2);
                await new Promise(r => setTimeout(r, 1500)); // Build takes longer

                // MOVE TO STEP 3
                await animate("#progress-bar", { width: "66%" }, { duration: 0.8, ease: "easeInOut" });

                // STEP 3: DEPLOY ACTIVATED
                setActiveStep(3);
                await new Promise(r => setTimeout(r, 1000));

                // MOVE TO STEP 4
                await animate("#progress-bar", { width: "100%" }, { duration: 0.8, ease: "easeInOut" });

                // STEP 4: LIVE ACTIVATED
                setActiveStep(4);
                await new Promise(r => setTimeout(r, 2000)); // Stay live for a bit

                // Fade out? Or just reset loop
                await new Promise(r => setTimeout(r, 500));
            }
        };

        runSequence();
    }, [animate]);

    return (
        <div className="w-full flex flex-col items-center justify-center py-20" ref={scope}>
            <div className="relative w-full max-w-4xl flex items-center justify-between px-10">

                {/* Background Track */}
                <div className="absolute top-1/2 left-10 right-10 h-1 bg-white/10 -z-20 rounded-full" />

                {/* Active Progress Bar (The Beam) */}
                <motion.div
                    id="progress-bar"
                    className="absolute top-1/2 left-10 h-1 bg-blue-500 -z-10 rounded-full shadow-[0_0_15px_#3b82f6]"
                    style={{ maxWidth: "calc(100% - 80px)" }} // Match the track length between first and last node centers
                >
                    {/* Glowing Head */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white]" />
                </motion.div>

                {/* Steps */}
                <Step index={1} currentStep={activeStep} icon={<GitBranch size={20} />} label="Source" />
                <Step index={2} currentStep={activeStep} icon={<Package size={20} />} label="Build" />
                <Step index={3} currentStep={activeStep} icon={<Layers size={20} />} label="Deploy" />
                <Step index={4} currentStep={activeStep} icon={<Globe size={20} />} label="Live" />

            </div>
        </div>
    );
};

const Step = ({ index, currentStep, icon, label }: any) => {
    // Logic:
    // Completed: If current step > this index (beam has passed).
    // Active: If current step === this index (beam is here).
    // Pending: If current step < this index.

    // Note: Since the beam connects 1->2->3->4, 
    // At Step 2, Node 1 is Completed, Node 2 is Active.

    const isCompleted = currentStep > index;
    const isActive = currentStep === index;
    const isPending = currentStep < index;

    return (
        <div className="relative flex flex-col items-center gap-4">
            <motion.div
                className={clsx(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                    isCompleted ? "bg-blue-500 border-blue-500 text-white" :
                        isActive ? "bg-black border-blue-500 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" :
                            "bg-black border-white/10 text-white/20"
                )}
                animate={{
                    scale: isActive ? 1.15 : 1,
                    backgroundColor: isCompleted ? "#3b82f6" : "#000000"
                }}
            >
                {isCompleted ? <Check size={20} /> : icon}
            </motion.div>

            {/* Label */}
            <div className="absolute top-16 flex flex-col items-center w-24 text-center">
                <span className={clsx(
                    "text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                    isPending ? "text-white/20" : "text-white"
                )}>
                    {label}
                </span>
            </div>

            {/* Active Pulse */}
            {isActive && (
                <motion.div
                    className="absolute top-0 left-0 w-12 h-12 rounded-full border border-blue-500 z-0"
                    animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
            )}
        </div>
    );
};

export default PipelineTracker;
