"use client";


import { motion } from "framer-motion";
import { Globe, BarChart3, Lock, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";
import CommandPalette from "./CommandPalette";
import Navbar from "./Navbar";

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-grid-white opacity-40 mix-blend-overlay" />
            </div>

            {/* ---------------------------------------------------------------------------
          HERO SECTION: COMMAND PALETTE FIRST
          --------------------------------------------------------------------------- */}
            <section className="relative pt-48 pb-32 px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center z-10">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-8">
                        The Cloud Platform for Professionals
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8">
                        Deploy in <span className="text-slate-400">Seconds.</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto mb-16 leading-relaxed">
                        KubeLite is the unified control plane for modern engineering teams. 
                        Automate the lifecycle of your entire fleet with a single interface.
                    </p>
                </motion.div>

                {/* The Interactive Command Palette */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full mb-32"
                >
                    <CommandPalette />
                </motion.div>
            </section>

            {/* ---------------------------------------------------------------------------
          SECTION 1: THE UNIFIED CONTROL PLANE
          --------------------------------------------------------------------------- */}
            <section className="relative py-40 px-6 max-w-[1200px] mx-auto z-10 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                            Operational Excellence
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight leading-[1.1]">The Unified <br />Control Plane.</h2>
                        <p className="text-slate-400 text-xl leading-relaxed font-light">
                            Manage your entire infrastructure fleet from a single, high-fidelity 
                            interface. Orchestrate deployments, scale resources, and monitor 
                            health without ever context-switching.
                        </p>
                        <div className="grid grid-cols-1 gap-6 pt-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                                    <LayoutGrid className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-white font-semibold mb-1">Global Visibility</div>
                                    <div className="text-sm text-slate-500 leading-relaxed text-pretty">Instant access to every environment, project, and service across your entire organization.</div>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-white font-semibold mb-1">Edge Provisioning</div>
                                    <div className="text-sm text-slate-500 leading-relaxed text-pretty">Automatic traffic routing and certificate management as soon as your service is live.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Visual: Clean Operation Graph */}
                    <div className="relative p-1 glass rounded-[40px] border border-white/10 shadow-2xl overflow-hidden group">
                        <div className="bg-[#050505] rounded-[39px] p-8 space-y-12 h-[450px] relative overflow-hidden">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                  {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-white/10" />
                                  ))}
                                </div>
                                <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">system_status: optimal</div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center h-full -mt-10 gap-16">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                                    </div>
                                    {/* Orbital rings */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5 opacity-50" />
                                </div>
                                
                                <div className="grid grid-cols-4 gap-4 w-full px-4">
                                     {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-1 rounded-full bg-white/5 relative overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-0 bg-blue-500/50"
                                                initial={{ left: '-100%' }}
                                                animate={{ left: '100%' }}
                                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.5, ease: "linear" }}
                                            />
                                        </div>
                                     ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------------------
          SECTION 2: INSTANT ENVIRONMENTS
          --------------------------------------------------------------------------- */}
            <section className="relative py-40 px-6 max-w-[1200px] mx-auto z-10">
                <div className="text-center mb-24 space-y-6">
                    <h2 className="text-5xl font-bold tracking-tight">Instant Previews. <br />Every time.</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        Eliminate manual staging. Every branch, every pull request, and every 
                        deployment gets an isolated, ephemeral environment automatically.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="p-10 glass rounded-3xl border border-white/10 hover:border-white/20 transition-all group">
                         <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-mono text-sm">01</div>
                         <h4 className="text-xl font-bold mb-4 text-white">Push to Branch</h4>
                         <p className="text-slate-500 text-sm leading-relaxed">Simply push your changes to your collaborative workflow. We detect the intent and begin the lifecycle.</p>
                    </div>
                    <div className="p-10 glass rounded-3xl border border-white/10 hover:border-white/20 transition-all group">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 font-mono text-sm">02</div>
                         <h4 className="text-xl font-bold mb-4 text-white">Automatic Build</h4>
                         <p className="text-slate-500 text-sm leading-relaxed">Changes are validated and packaged securely behind the scenes. No infrastructure management required.</p>
                    </div>
                    <div className="p-10 glass rounded-3xl border border-white/10 hover:border-white/20 transition-all group">
                         <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 font-mono text-sm">03</div>
                         <h4 className="text-xl font-bold mb-4 text-white">Live URL</h4>
                         <p className="text-slate-500 text-sm leading-relaxed">Receive a public, SSL-secured preview URL instantly. Share with stakeholders and get feedback immediately.</p>
                    </div>
                </div>
            </section>

            {/* ---------------------------------------------------------------------------
          SECTION 3: INTEGRATED INSIGHTS (OBSERVABILITY)
          --------------------------------------------------------------------------- */}
            <section className="relative py-40 px-6 max-w-[1200px] mx-auto z-10 bg-[#020202]/50">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2">
                         <div className="relative glass rounded-[40px] border border-white/10 shadow-[0_0_100px_-40px_rgba(59,130,246,0.3)] overflow-hidden p-2">
                            <DashboardPreview />
                        </div>
                    </div>
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                            Deep Insights
                        </div>
                        <h2 className="text-5xl font-bold tracking-tight leading-[1.1]">Integrated <br />Observability.</h2>
                        <p className="text-slate-400 text-xl leading-relaxed font-light">
                            Stop installing agents and configuring dashboards. Real-time metrics 
                            and logs are built into the platform core, providing immediate 
                            visibility into every service.
                        </p>
                        <div className="space-y-6 pt-4">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-white font-bold mb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-blue-400" />
                                    Resource Intelligence
                                </div>
                                <div className="text-sm text-slate-500">Monitor CPU, Memory, and Latency profiles for every service version in real-time.</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-white font-bold mb-2 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-emerald-400" />
                                    Security Policy
                                </div>
                                <div className="text-sm text-slate-500">Enforce enterprise-grade isolation and access control across all projects automatically.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION: MINIMALIST */}
            <section className="py-48 px-6 text-center border-t border-white/5">
                <h2 className="text-5xl font-bold mb-8">Stop managing, <br />start building.</h2>
                <Link to="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black text-lg hover:scale-105 transition-transform inline-block">
                    Deploy Now
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 max-w-[1200px] mx-auto opacity-50 text-xs flex justify-between items-center">
                <span>© 2026 KubeLite Inc. All rights reserved.</span>
                <div className="flex gap-8">
                    <Link to="#" className="hover:text-white transition-colors">Twitter</Link>
                    <Link to="#" className="hover:text-white transition-colors">GitHub</Link>
                    <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </footer>
        </div>
    );
}
