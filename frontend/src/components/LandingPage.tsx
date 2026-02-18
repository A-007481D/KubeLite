"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Check, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";
import Navbar from "./Navbar";

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">

            <Navbar />

            {/* ---------------------------------------------------------------------------
          HERO SECTION (Split Layout)
         --------------------------------------------------------------------------- */}
            <section className="relative pt-32 pb-20 px-6 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* LEFT COLUMN: Copy & CLI */}
                <div className="space-y-8 z-10">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-800/30 text-blue-400 text-xs font-mono tracking-wide">
                        <span>V2.4 RELEASED</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                        Orchestration <br />
                        for <span className="text-blue-500">Engineers.</span>
                    </h1>

                    {/* Subhead */}
                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                        Stop wrestling with YAML. Ork8stra is the developer-first platform
                        that treats your infrastructure as code.
                    </p>

                    {/* CLI Input (The "Real" feel) */}
                    <div className="max-w-md">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0F1115] border border-white/10 group hover:border-white/20 transition-colors cursor-text">
                            <div className="flex items-center gap-3 font-mono text-sm text-slate-300">
                                <span className="text-blue-500">$</span>
                                <span>npm install -g @ork8stra/cli</span>
                            </div>
                            <button className="text-slate-500 hover:text-white transition-colors">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="mt-2 text-xs text-slate-600 font-mono">
                            Requires Node.js 18+ • Linux/macOS
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Link href="/register" className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-900/20">
                            Get Started
                        </Link>
                        <button className="px-6 py-3 rounded-md bg-transparent border border-white/10 hover:bg-white/5 text-slate-300 text-sm font-medium transition-colors">
                            Read Documentation
                        </button>
                    </div>

                </div>

                {/* RIGHT COLUMN: The Dashboard Visual */}
                <div className="relative z-0 lg:pl-10">
                    {/* Glow behind dashboard */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[100px] rounded-full" />
                    <DashboardPreview />
                </div>

            </section>


            {/* ---------------------------------------------------------------------------
          SOCIAL PROOF STRIP
         --------------------------------------------------------------------------- */}
            <section className="border-y border-white/5 bg-[#08080A] py-8">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between opacity-40 grayscale mix-blend-screen">
                    <span className="text-xl font-bold tracking-tighter">ACME</span>
                    <span className="text-xl font-bold tracking-tighter">Vercel</span>
                    <span className="text-xl font-bold tracking-tighter">Stripe</span>
                    <span className="text-xl font-bold tracking-tighter">Linear</span>
                    <span className="text-xl font-bold tracking-tighter">Raycast</span>
                </div>
            </section>


            {/* ---------------------------------------------------------------------------
          FEATURE: DEPLOYMENT (Left Text, Right Code)
         --------------------------------------------------------------------------- */}
            <section className="py-32 px-6 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

                <div className="space-y-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-900/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Terminal className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold">Declare your infrastructure.</h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        No more clicking through consoles. Define your entire stack in a single
                        <code className="text-sm font-mono bg-white/10 px-1 py-0.5 rounded mx-1 text-white">ork8stra.yaml</code>
                        file and version control it with Git.
                    </p>
                    <ul className="space-y-3 pt-4">
                        {['Zero-downtime rollouts', 'Automatic SSL provisioning', 'Global CDN propagation'].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-slate-300">
                                <Check className="w-4 h-4 text-blue-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative rounded-xl border border-white/10 bg-[#0B0C10] p-6 shadow-2xl font-mono text-sm leading-6 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-[#ffffff30] text-6xl opacity-10 font-black tracking-tighter select-none">YAML</div>
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                    <pre className="text-slate-300">
                        <span className="text-purple-400">service</span>:<br />
                        &nbsp;&nbsp;<span className="text-blue-400">name</span>: <span className="text-green-400">api-gateway</span><br />
                        &nbsp;&nbsp;<span className="text-blue-400">replicas</span>: <span className="text-amber-400">3</span><br />
                        &nbsp;&nbsp;<span className="text-blue-400">region</span>: <span className="text-green-400">us-east-1</span><br />
                        <br />
                        <span className="text-purple-400">runtime</span>:<br />
                        &nbsp;&nbsp;<span className="text-blue-400">image</span>: <span className="text-green-400">node:18-alpine</span><br />
                        &nbsp;&nbsp;<span className="text-blue-400">command</span>: <span className="text-green-400">["npm", "start"]</span><br />
                        <br />
                        <span className="text-purple-400">exposure</span>:<br />
                        &nbsp;&nbsp;<span className="text-blue-400">port</span>: <span className="text-amber-400">8080</span><br />
                        &nbsp;&nbsp;<span className="text-blue-400">public</span>: <span className="text-amber-400">true</span>
                    </pre>
                </div>

            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/5 py-12 text-center text-slate-600 text-sm">
                <p>© 2026 Ork8stra Inc. Designed for engineers.</p>
            </footer>

        </div>
    );
}
