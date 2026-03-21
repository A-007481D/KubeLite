import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Activity, Server, Cpu, HardDrive, AlertTriangle, CheckCircle2, 
    XCircle, Clock, ArrowUpRight, ArrowDownRight, RotateCcw, Zap
} from "lucide-react";
import type { Organization, Team, Project } from "../types/index";
import {
    AreaChart, Area, LineChart, Line, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

interface ObservabilityDashboardProps {
    org: Organization | null;
}

// ---- Metric Card ----
const MetricCard = ({ label, value, unit, trend, trendUp, icon: Icon, color }: any) => (
    <div className="bg-[#141414] border border-[#2C2C2C] rounded-xl p-5 flex flex-col gap-3 hover:border-[#444] transition-all group">
        <div className="flex items-center justify-between">
            <span className="text-xs text-[#888] font-medium uppercase tracking-wider">{label}</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-10`} style={{ backgroundColor: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
            </div>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#E3E3E3]">{value}</span>
            {unit && <span className="text-sm text-[#888]">{unit}</span>}
        </div>
        {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
            </div>
        )}
    </div>
);

// ---- Chart Container ----
const ChartPanel = ({ title, subtitle, children }: any) => (
    <div className="bg-[#141414] border border-[#2C2C2C] rounded-xl overflow-hidden hover:border-[#444] transition-all">
        <div className="px-5 py-4 border-b border-[#2C2C2C]">
            <h3 className="text-sm font-semibold text-[#E3E3E3]">{title}</h3>
            {subtitle && <p className="text-xs text-[#888] mt-0.5">{subtitle}</p>}
        </div>
        <div className="p-4 h-[240px]">
            {children}
        </div>
    </div>
);

// Tooltip styling
const tooltipStyle = {
    contentStyle: { backgroundColor: '#1A1A1A', border: '1px solid #333', borderRadius: '8px', fontSize: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
    itemStyle: { color: '#E3E3E3' },
    labelStyle: { color: '#888', marginBottom: '4px', fontWeight: 600 }
};

export default function ObservabilityDashboard({ org }: ObservabilityDashboardProps) {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem("token") || "");
    const [isLoading, setIsLoading] = useState(true);

    const [allApps, setAllApps] = useState<any[]>([]);
    const [cpuTimeSeries, setCpuTimeSeries] = useState<any[]>([]);
    const [memTimeSeries, setMemTimeSeries] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);

    // Summary stats
    const [totalPods, setTotalPods] = useState(0);
    const [healthyPods, setHealthyPods] = useState(0);
    const [totalRestarts, setTotalRestarts] = useState(0);
    const [avgCpu, setAvgCpu] = useState(0);

    useEffect(() => {
        if (!token) navigate("/login");
    }, [token, navigate]);

    const fetchPlatformData = useCallback(async () => {
        if (!token || !org) return;
        
        try {
            const teamsRes = await fetch("/api/v1/teams", {
                headers: { Authorization: `Bearer ${token}`, "X-Org-ID": org.id }
            });
            const teamsData: Team[] = await teamsRes.json();

            const projectPromises = teamsData.map(t =>
                fetch(`/api/v1/projects?teamId=${t.id}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
            );
            const allProjects = (await Promise.all(projectPromises)).flat() as Project[];

            let combinedApps: any[] = [];
            let podCount = 0, healthy = 0, restarts = 0, cpuTotal = 0;
            const cpuSeries: Record<string, number> = {};
            const memSeries: Record<string, number> = {};
            let combinedEvents: any[] = [];

            for (const p of allProjects) {
                const [metricsRes, sparklinesRes, eventsRes] = await Promise.all([
                    fetch(`/api/v1/apps/projects/${p.id}/metrics`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
                    fetch(`/api/v1/apps/projects/${p.id}/sparklines`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : {}),
                    fetch(`/api/v1/apps/projects/${p.id}/events`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : [])
                ]);

                if (metricsRes) {
                    for (const app of metricsRes.appBreakdown) {
                        podCount += (app.pods || 0) + (app.errorPods || 0);
                        healthy += app.pods || 0;
                        restarts += app.restartCount || 0;
                        cpuTotal += app.cpu || 0;

                        combinedApps.push({ ...app, projectName: p.name });

                        const series = sparklinesRes[app.appId] || [];
                        for (const s of series) {
                            const t = new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            cpuSeries[t] = (cpuSeries[t] || 0) + (s.cpu || 0);
                            memSeries[t] = (memSeries[t] || 0) + (s.memory || 0);
                        }
                    }
                }
                combinedEvents.push(...eventsRes);
            }

            setTotalPods(podCount);
            setHealthyPods(healthy);
            setTotalRestarts(restarts);
            setAvgCpu(combinedApps.length > 0 ? cpuTotal / combinedApps.length : 0);

            const toSeries = (dict: Record<string, number>, scale = 1) =>
                Object.keys(dict).sort().map(t => ({ time: t, value: Math.round(dict[t] * scale * 100) / 100 }));

            setCpuTimeSeries(toSeries(cpuSeries, 100)); // percentage
            setMemTimeSeries(toSeries(memSeries, 1 / (1024 * 1024))); // MB

            combinedApps.sort((a, b) => (b.restartCount || 0) - (a.restartCount || 0));
            setAllApps(combinedApps);

            combinedEvents.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setEvents(combinedEvents);

        } catch (e) {
            console.error("Observability Fetch Error:", e);
        } finally {
            setIsLoading(false);
        }
    }, [token, org]);

    useEffect(() => {
        setIsLoading(true);
        fetchPlatformData();
        const interval = setInterval(fetchPlatformData, 10000);
        return () => clearInterval(interval);
    }, [fetchPlatformData]);

    const availability = totalPods > 0 ? ((healthyPods / totalPods) * 100) : 100;

    if (isLoading && allApps.length === 0) {
        return (
            <div className="flex flex-col min-h-full w-full bg-[#0A0A0A] items-center justify-center p-8 gap-3">
                <div className="w-6 h-6 border-2 border-[#333] border-t-[#E3E3E3] rounded-full animate-spin" />
                <span className="text-sm text-[#888]">Loading observability data...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full w-full bg-[#0A0A0A] p-6 lg:p-8 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* Top KPI Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Fleet Availability"
                    value={availability === 100 ? '100' : availability.toFixed(1)}
                    unit="%"
                    trend={availability >= 99 ? "Within SLO" : "SLO breach"}
                    trendUp={availability >= 99}
                    icon={Activity}
                    color={availability >= 99 ? '#10B981' : '#EF4444'}
                />
                <MetricCard
                    label="Total Pods"
                    value={totalPods}
                    unit={`${healthyPods} healthy`}
                    icon={Server}
                    color="#3B82F6"
                />
                <MetricCard
                    label="Avg CPU"
                    value={(avgCpu * 100).toFixed(1)}
                    unit="%"
                    trend={avgCpu > 0.8 ? "High utilization" : "Normal"}
                    trendUp={avgCpu <= 0.8}
                    icon={Cpu}
                    color="#F59E0B"
                />
                <MetricCard
                    label="Restart Count"
                    value={totalRestarts}
                    unit="across fleet"
                    trend={totalRestarts > 5 ? "Instability detected" : "Stable"}
                    trendUp={totalRestarts <= 5}
                    icon={RotateCcw}
                    color={totalRestarts > 5 ? '#EF4444' : '#10B981'}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartPanel title="CPU Utilization" subtitle="Aggregated across all services (%)">
                    {cpuTimeSeries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cpuTimeSeries}>
                                <defs>
                                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={35} />
                                <Tooltip {...tooltipStyle} />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#cpuGrad)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : <EmptyChart />}
                </ChartPanel>

                <ChartPanel title="Memory Consumption" subtitle="Aggregated across all services (MB)">
                    {memTimeSeries.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={memTimeSeries}>
                                <defs>
                                    <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={35} />
                                <Tooltip {...tooltipStyle} />
                                <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fill="url(#memGrad)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : <EmptyChart />}
                </ChartPanel>
            </div>

            {/* Service Health Table + Cluster Events in 2-col */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Service Grid (2/3) */}
                <div className="lg:col-span-2 bg-[#141414] border border-[#2C2C2C] rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#2C2C2C] flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#E3E3E3]">Service Health</h3>
                        <span className="text-xs text-[#888]">{allApps.length} services</span>
                    </div>
                    <div className="overflow-y-auto max-h-[360px] custom-scrollbar">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-[#141414] z-10 border-b border-[#2C2C2C]">
                                <tr className="text-[#888] uppercase tracking-wider">
                                    <th className="px-5 py-3 font-medium">Service</th>
                                    <th className="px-5 py-3 font-medium">Project</th>
                                    <th className="px-5 py-3 font-medium text-center">Status</th>
                                    <th className="px-5 py-3 font-medium text-right">CPU</th>
                                    <th className="px-5 py-3 font-medium text-right">Pods</th>
                                    <th className="px-5 py-3 font-medium text-right">Restarts</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2C2C2C]/50">
                                {allApps.map((app) => (
                                    <tr key={app.appId} className="hover:bg-[#1A1A1A] transition-colors">
                                        <td className="px-5 py-3 font-medium text-[#E3E3E3]">{app.appName}</td>
                                        <td className="px-5 py-3 text-[#888]">{app.projectName}</td>
                                        <td className="px-5 py-3 text-center">
                                            {app.status === 'Healthy' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                                                    <CheckCircle2 className="w-3 h-3" /> Healthy
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold">
                                                    <XCircle className="w-3 h-3" /> {app.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-right font-mono text-[#E3E3E3]">{(app.cpu * 100).toFixed(1)}%</td>
                                        <td className="px-5 py-3 text-right font-mono text-[#E3E3E3]">{app.pods || 0}</td>
                                        <td className="px-5 py-3 text-right">
                                            <span className={`font-mono ${(app.restartCount || 0) > 0 ? 'text-amber-400' : 'text-[#888]'}`}>
                                                {app.restartCount || 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {allApps.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-[#555] text-sm">
                                            No services deployed yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Cluster Events (1/3) */}
                <div className="bg-[#141414] border border-[#2C2C2C] rounded-xl overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-[#2C2C2C]">
                        <h3 className="text-sm font-semibold text-[#E3E3E3]">Cluster Events</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[360px] custom-scrollbar">
                        {events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-[#555]">
                                <Clock className="w-5 h-5 mb-2 opacity-50" />
                                <span className="text-xs">Watching for events...</span>
                            </div>
                        ) : (
                            <ul className="divide-y divide-[#2C2C2C]/50">
                                {events.slice(0, 30).map((ev: any, i: number) => {
                                    const isWarning = ev.type === 'Warning' || (ev.reason || '').toLowerCase().includes('fail') || (ev.reason || '').toLowerCase().includes('backoff');
                                    return (
                                        <li key={i} className="px-5 py-3 hover:bg-[#1A1A1A] transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${isWarning ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                            {ev.reason}
                                                        </span>
                                                        <span className="text-[10px] text-[#555]">
                                                            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#AAA] truncate" title={ev.message}>{ev.message}</p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Restart Bar Chart - Full Width */}
            <ChartPanel title="Service Restart Distribution" subtitle="Restarts per service over the monitoring window">
                {allApps.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={allApps.map(a => ({ name: a.appName, restarts: a.restartCount || 0 }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={30} allowDecimals={false} />
                            <Tooltip {...tooltipStyle} />
                            <Bar dataKey="restarts" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <EmptyChart />}
            </ChartPanel>

        </div>
    );
}

const EmptyChart = () => (
    <div className="w-full h-full flex items-center justify-center text-[#555] text-xs">
        No data available yet
    </div>
);
