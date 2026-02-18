"use client";

import { motion } from "framer-motion";
import { Box, Code2, Globe, Server, Database, Container, FileCode } from "lucide-react";

export default function ArchitectureDiagram() {
    return (
        <div className="relative w-full max-w-5xl mx-auto h-[300px] md:h-[400px] flex items-center justify-center select-none pointer-events-none">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />

            {/* ---------------------------------------------------------------------------
         PIPELINE VISUALIZATION
         --------------------------------------------------------------------------- */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 items-center w-full px-4 md:px-8">

                {/* STEP 1: CODE */}
                <StageNode
                    icon={<Code2 className="w-5 h-5 md:w-6 md:h-6 text-white" />}
                    label="Source"
                    sub="Git Push"
                    color="bg-slate-800"
                />

                {/* CONNECTION 1-2 (Desktop Only for simplicity in this view) */}
                <div className="hidden md:block absolute left-[15%] right-[85%] top-1/2 h-[2px] bg-slate-700/50 -z-10" />
                <div className="hidden md:block absolute left-[35%] right-[65%] top-1/2 h-[2px] bg-slate-700/50 -z-10" />
                <div className="hidden md:block absolute left-[60%] right-[40%] top-1/2 h-[2px] bg-slate-700/50 -z-10" />

                {/* STEP 2: BUILD */}
                <StageNode
                    icon={<Box className="w-5 h-5 md:w-6 md:h-6 text-blue-200" />}
                    label="Build"
                    sub="Nixpacks"
                    color="bg-blue-900/60"
                    border="border-blue-500/50"
                    glow="shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]"
                />

                {/* STEP 3: DEPLOY */}
                <StageNode
                    icon={<Server className="w-5 h-5 md:w-6 md:h-6 text-purple-200" />}
                    label="Deploy"
                    sub="Kubernetes"
                    color="bg-purple-900/60"
                    border="border-purple-500/50"
                    glow="shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]"
                />

                {/* STEP 4: EDGE */}
                <StageNode
                    icon={<Globe className="w-5 h-5 md:w-6 md:h-6 text-green-200" />}
                    label="Edge"
                    sub="Global CDN"
                    color="bg-emerald-900/60"
                    border="border-emerald-500/50"
                    glow="shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]"
                />

            </div>

            {/* Animated Packets Moving Across */}
            <PipelinePacket delay={0} start="10%" end="30%" />
            <PipelinePacket delay={2} start="35%" end="55%" />
            <PipelinePacket delay={4} start="60%" end="80%" />


            {/* Decorative Floating Elements (The "Clerk" Floaties) */}
            <FloatingCard
                icon={<FileCode className="w-4 h-4 text-blue-300" />}
                label="main.go"
                x="-35%" y="-100px" delay={0}
            />

            <FloatingCard
                icon={<Container className="w-4 h-4 text-purple-300" />}
                label="image:v2"
                x="-5%" y="90px" delay={1.5}
            />

            <FloatingCard
                icon={<Database className="w-4 h-4 text-emerald-300" />}
                label="Postgres"
                x="30%" y="-80px" delay={3}
            />

        </div>
    );
}

function StageNode({ icon, label, sub, color, border = "border-white/10", glow = "" }: { icon: any, label: string, sub: string, color: string, border?: string, glow?: string }) {
    return (
        <div className="relative flex flex-col items-center group">
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${color} backdrop-blur-md border ${border} ${glow} flex items-center justify-center z-20 transition-transform group-hover:scale-110 duration-500`}>
                {icon}
            </div>
            <div className="mt-4 text-center">
                <h3 className="text-white font-medium text-sm md:text-lg tracking-tight">{label}</h3>
                <p className="text-slate-400 text-[10px] md:text-xs font-mono mt-1 uppercase tracking-wider">{sub}</p>
            </div>
        </div>
    )
}

function PipelinePacket({ delay, start, end }: { delay: number, start: string, end: string }) {
    return (
        <motion.div
            className="hidden md:block absolute top-[calc(50%-10px)] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent w-[20%] z-0"
            initial={{ left: start, opacity: 0 }}
            animate={{ left: end, opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: delay, ease: "linear" }}
        />
    )
}

function FloatingCard({ icon, label, x, y, delay }: { icon: any, label: string, x: string, y: string, delay: number }) {
    return (
        <motion.div
            className="absolute hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 border border-white/10 backdrop-blur-md shadow-xl z-30"
            initial={{ y: 0 }}
            animate={{
                y: [0, -15, 0],
            }}
            style={{ left: `calc(50% + ${x})`, top: `calc(50% + ${y})` }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay }}
        >
            {icon}
            <span className="text-xs font-mono text-slate-300">{label}</span>
        </motion.div>
    )
}
