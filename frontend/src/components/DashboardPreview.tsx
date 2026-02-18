"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Server, GitCommit, Clock, CheckCircle2, AlertCircle, Terminal, Search } from "lucide-react";

export default function DashboardPreview() {
    // Simulated live data
    const [reqs, setReqs] = useState(2430);
    const [latency, setLatency] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setReqs(prev => prev + Math.floor(Math.random() * 10));
            setLatency(prev => 12 + Math.floor(Math.random() * 4) - 2);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[500px] bg-[#0B0C10] rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-[10px] md:text-xs select-none">

            {/* ----------------------------------
          TOP BAR (Fake Browser/App Header)
          ---------------------------------- */}
            <div className="h-10 bg-[#0F1115] border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="h-4 w-[1px] bg-white/10 mx-2" />
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="font-bold text-white">ork8stra</span>
                        <span className="text-slate-600">/</span>
                        <span>us-east-1</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-blue-400">production</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-500">Connected</span>
                    </div>
                </div>
            </div>

            {/* ----------------------------------
          MAIN CONTENT LAYOUT
          ---------------------------------- */}
            <div className="flex h-[calc(100%-40px)]">

                {/* SIDEBAR */}
                <div className="w-12 md:w-16 border-r border-white/5 bg-[#0D0E12] flex flex-col items-center py-4 gap-4">
                    <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30"><Activity className="w-4 h-4" /></div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-slate-500 flex items-center justify-center transition-colors"><Server className="w-4 h-4" /></div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-slate-500 flex items-center justify-center transition-colors"><GitCommit className="w-4 h-4" /></div>
                    <div className="w-8 h-8 rounded hover:bg-white/5 text-slate-500 flex items-center justify-center transition-colors"><Clock className="w-4 h-4" /></div>
                </div>

                {/* DASHBOARD GRID */}
                <div className="flex-1 p-6 bg-[#08090B] overflow-hidden relative">

                    {/* HEADER AREA */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight mb-1">Overview</h2>
                            <p className="text-slate-500">Last deployed 2m ago by <span className="text-blue-400">@malik</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded bg-blue-600/10 text-blue-400 border border-blue-600/20 hover:bg-blue-600/20 transition-colors">Redeploy</button>
                            <button className="px-3 py-1.5 rounded bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors">View Logs</button>
                        </div>
                    </div>

                    {/* METRICS ROW */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <MetricCard label="Requests/sec" value={reqs.toLocaleString()} trend="+12%" icon={<Activity className="w-3 h-3 text-emerald-400" />} chartColor="bg-emerald-500" />
                        <MetricCard label="Avg Latency" value={`${latency}ms`} trend="-2%" icon={<Clock className="w-3 h-3 text-blue-400" />} chartColor="bg-blue-500" />
                        <MetricCard label="Error Rate" value="0.01%" trend="0%" icon={<AlertCircle className="w-3 h-3 text-slate-400" />} chartColor="bg-slate-500" isFlat />
                    </div>

                    {/* ACTIVE DEPLOYMENTS LIST */}
                    <div className="border border-white/5 rounded-lg bg-[#0D0E12] overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-[#111216]">
                            <span className="font-semibold text-slate-300">Active Containers</span>
                            <Search className="w-3 h-3 text-slate-600" />
                        </div>
                        <div className="divide-y divide-white/5">
                            <DeploymentRow name="api-gateway-v2" status="Running" cpu="45%" ram="128MB" uptime="2d 4h" />
                            <DeploymentRow name="auth-service" status="Running" cpu="12%" ram="64MB" uptime="5d 1h" />
                            <DeploymentRow name="worker-queue" status="Updating" cpu="8%" ram="24MB" uptime="12s" isUpdating />
                            <DeploymentRow name="cron-scheduler" status="Running" cpu="1%" ram="18MB" uptime="12d" />
                        </div>
                    </div>

                    {/* FLOATING TERMINAL (Visual Flair) */}
                    <motion.div
                        className="absolute bottom-6 right-6 w-80 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="h-6 bg-white/5 border-b border-white/5 flex items-center px-3 gap-2">
                            <Terminal className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-500">build-logs</span>
                        </div>
                        <div className="p-3 font-mono text-[9px] text-slate-400 space-y-1">
                            <div className="flex gap-2"><span className="text-blue-500">info</span><span>Pulling image ork8stra/api:latest...</span></div>
                            <div className="flex gap-2"><span className="text-blue-500">info</span><span>Verifying checksum... OK</span></div>
                            <div className="flex gap-2"><span className="text-green-500">success</span><span>Container started in 42ms</span></div>
                            <div className="flex gap-2"><span className="text-slate-600">debug</span><span>Listening on port 8080</span></div>
                            <motion.div
                                className="w-2 h-4 bg-blue-500/50"
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                            />
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, trend, icon, chartColor, isFlat }: any) {
    return (
        <div className="p-4 rounded-lg bg-[#0D0E12] border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500">{label}</span>
                {icon}
            </div>
            <div className="text-2xl font-mono text-white mb-1">{value}</div>
            <div className={`text-[10px] ${isFlat ? 'text-slate-500' : 'text-emerald-500'} flex items-center gap-1`}>
                {!isFlat && <span className="bg-emerald-500/10 px-1 rounded">{trend}</span>}
                {isFlat && <span className="bg-slate-500/10 px-1 rounded">Stable</span>}
                <span className="text-slate-600">vs last hour</span>
            </div>

            {/* Fake Sparkline */}
            <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end opacity-20 group-hover:opacity-40 transition-opacity">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`flex-1 mx-[1px] ${chartColor}`} style={{ height: `${20 + ((i * 17 + label.charCodeAt(0)) % 80)}%` }} />
                ))}
            </div>
        </div>
    )
}

function DeploymentRow({ name, status, cpu, ram, uptime, isUpdating }: any) {
    return (
        <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{name}</span>
            </div>
            <div className="flex items-center gap-6 text-slate-500">
                <span className="w-12 text-right">{cpu}</span>
                <span className="w-16 text-right">{ram}</span>
                <span className="w-16 text-right text-slate-600">{uptime}</span>
            </div>
        </div>
    )
}
