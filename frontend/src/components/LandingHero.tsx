"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

const LandingHero = () => {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">

            {/* Spotlight Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 max-w-5xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-400 mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    System Operational
                </div>

                <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent drop-shadow-sm">
                    Deploy.<br />
                    Don't Despair.
                </h1>

                <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                    The Zero-Config Platform Engineering Engine.<br />
                    <span className="text-white/80 font-normal">Push code. We handle the rest.</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <button className="group relative px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]">
                        <span className="flex items-center gap-2">
                            Start Engine <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <button className="group px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2">
                        <BookOpen size={20} className="text-white/50 group-hover:text-white transition-colors" />
                        Read the Docs
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

export default LandingHero;
