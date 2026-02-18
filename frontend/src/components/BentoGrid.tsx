"use client";

import { motion } from "framer-motion";
import { Sparkles, Globe, Rewind, Share2, Scan } from "lucide-react";
import clsx from "clsx";

const BentoGrid = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Magical</span> Infrastructure.
                </h2>
                <p className="text-white/40 text-lg">Advanced engineering, simplified into pure energy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-6 h-[800px] md:h-[600px]">

                {/* Large Card: Intelligent Detection (Abstract Magic) */}
                <BentoCard className="md:col-span-4 md:row-span-2 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Visualizer: Abstract Scanner */}
                    <div className="relative h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />

                        {/* Ring 1 */}
                        <motion.div
                            className="w-48 h-48 rounded-full border border-blue-500/30"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        {/* Ring 2 */}
                        <motion.div
                            className="absolute w-32 h-32 rounded-full border border-purple-500/30"
                            animate={{ scale: [1.2, 1, 1.2], rotate: 180 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Core */}
                        <div className="absolute z-10 flex flex-col items-center gap-2">
                            <Scan size={40} className="text-white animate-pulse" />
                            <div className="text-xs font-mono text-blue-400 bg-blue-950/50 px-2 py-1 rounded">ANALYZING SOURCE</div>
                        </div>

                        {/* Flying Particles */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        x: (Math.random() - 0.5) * 400,
                                        y: (Math.random() - 0.5) * 400,
                                        opacity: 0
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20">
                        <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles className="text-amber-400" /> Omni-Detection
                        </h3>
                        <p className="text-white/60 max-w-lg">
                            We don't just read code; we understand it. Our engine automatically infers your framework, language, and dependencies, constructing the perfect build environment in milliseconds.
                        </p>
                    </div>
                </BentoCard>

                {/* Small Card: Global Mesh */}
                <BentoCard className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-indigo-900/20 to-black overflow-hidden relative">
                    <Globe size={32} className="text-indigo-400 mb-4 z-10 relative" />
                    <h3 className="text-xl font-bold text-white z-10 relative">Planetary Scale</h3>
                    <p className="text-sm text-white/50 mt-2 z-10 relative">
                        Deploy to a unified global mesh. Your code runs everywhere, instantly.
                    </p>
                    {/* Background Animation */}
                    <div className="absolute right-[-20%] bottom-[-20%] w-[150%] h-[150%] opacity-20">
                        <motion.div
                            className="w-full h-full border-[20px] border-indigo-500 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </BentoCard>

                {/* Small Card: Temporal Rollbacks */}
                <BentoCard className="md:col-span-1 md:row-span-1 border-accents-2">
                    <Rewind size={32} className="text-rose-400 mb-4" />
                    <h3 className="text-xl font-bold text-white">Time Travel</h3>
                    <p className="text-sm text-white/50 mt-2">
                        Instant rollbacks. Undo any deployment in <span className="text-white">0.3s</span>.
                    </p>
                </BentoCard>

                {/* Small Card: Ephemeral Links */}
                <BentoCard className="md:col-span-1 md:row-span-1">
                    <Share2 size={32} className="text-emerald-400 mb-4" />
                    <h3 className="text-xl font-bold text-white">Holographic PRs</h3>
                    <p className="text-sm text-white/50 mt-2">
                        Every Pull Request generates a unique, ephemeral live environment.
                    </p>
                </BentoCard>

            </div>
        </section>
    );
};

const BentoCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={clsx(
                "glass-panel rounded-3xl p-8 hover:bg-white/10 transition-colors duration-500 border border-white/10 shadow-2xl",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default BentoGrid;
