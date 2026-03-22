import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Key, Activity, Search, 
  AlertCircle, 
  ChevronRight, Building2, Clock, Filter,
  ShieldCheck, ShieldAlert, Zap, Lock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

interface IAMSummary {
  totalUsers: number;
  activeOrganizations: number;
  totalPolicies: number;
  pendingInvitations: number;
  auditLogCount: number;
}

interface UserIdentity {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  enabled: boolean;
  memberships: {
    organizationId: string;
    organizationName: string;
    role: string;
  }[];
}

interface Policy {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  organizationId?: string;
}

interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  details: string;
  status: string;
  ipAddress: string;
  createdAt: string;
}

const IAMDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'policies' | 'audit'>('overview');
  const [summary, setSummary] = useState<IAMSummary | null>(null);
  const [users, setUsers] = useState<UserIdentity[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview' || !summary) {
        const res = await fetch('/api/v1/iam/summary');
        if (res.ok) setSummary(await res.json());
        else if (res.status === 403) setError('Access Denied: Platform Admin required.');
      }
      
      if (activeTab === 'users') {
        const res = await fetch('/api/v1/iam/users');
        if (res.ok) setUsers(await res.json());
      }

      if (activeTab === 'policies') {
        const res = await fetch('/api/v1/iam/policies');
        if (res.ok) setPolicies(await res.json());
      }

      if (activeTab === 'audit') {
        const res = await fetch('/api/v1/iam/audit-logs');
        if (res.ok) setAuditLogs(await res.json());
      }
      
    } catch (err) {
      console.error('Failed to fetch IAM data:', err);
      setError('Failed to load IAM Center data. The platform might be restarting to apply security updates.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'users', label: 'Identity Hub', icon: Users },
    { id: 'policies', label: 'Policy Templates', icon: Key },
    { id: 'audit', label: 'Security Audit', icon: Activity },
  ] as const;

  if (loading && !summary && users.length === 0 && policies.length === 0 && auditLogs.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-[#666] animate-pulse">Synchronizing Platform Integrity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg max-w-md text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Security Override Required</h2>
          <p className="text-[#999] mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
            Re-verify Permissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">IAM Center</h1>
        </div>
        <p className="text-[#999] max-w-2xl">
          Centralized Identity and Access Management. Manage global users, define platform-wide policy templates, 
          and audit security events across all organizations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#242424]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? 'text-white' : 'text-[#666] hover:text-[#999]'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-purple-400' : ''}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={summary.totalUsers} icon={Users} color="blue" />
              <StatCard label="Active Organizations" value={summary.activeOrganizations} icon={Building2} color="green" />
              <StatCard label="Policy Templates" value={summary.totalPolicies} icon={Key} color="purple" />
              <StatCard label="Pending Invites" value={summary.pendingInvitations} icon={Clock} color="orange" />
              
              <Card className="lg:col-span-4 bg-[#141414] border-[#242424]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    Security Posture: Optimized
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-lg border border-[#242424]">
                    <div>
                      <h4 className="text-white font-medium">Automatic Guard Duty</h4>
                      <p className="text-xs text-[#666]">Platform-wide security policies are being enforced across {summary.activeOrganizations} organizations.</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-lg">
                    <div className="flex gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-full h-fit mt-1">
                        <Zap className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold mb-1">Global platform privileges acquired.</h3>
                        <p className="text-[#999] text-sm leading-relaxed mb-4">
                          You are currently in the Platform Administration view. Any users created or invited will now 
                          be visible here for cross-organization auditing and management.
                        </p>
                        <div className="flex gap-3">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white" onClick={() => setActiveTab('audit')}>
                            View Audit Stream
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#333] text-[#999] hover:text-white" onClick={() => setActiveTab('policies')}>
                            Policy Manager
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                  <input
                    type="text"
                    placeholder="Search global users by email or ID..."
                    className="w-full bg-[#141414] border border-[#242424] rounded-md py-2 pl-10 pr-4 text-sm text-[#E3E3E3] focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <Button className="bg-[#1f1f1f] text-[#E3E3E3] hover:bg-[#252525] border border-[#333]">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
              </div>

              <div className="bg-[#141414] border border-[#242424] rounded-lg overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-[#1a1a1a] border-b border-[#242424]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Organizations</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242424]">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#1a1a1a]/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/5 flex items-center justify-center text-white font-bold text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{user.username}</div>
                              <div className="text-xs text-[#666]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2 max-w-sm">
                            {user.memberships.map((m) => (
                              <Badge key={m.organizationId} variant="outline" className="bg-[#0F0F0F] border-[#242424] text-xs text-[#999] group-hover:text-[#E3E3E3]">
                                {m.organizationName}
                              </Badge>
                            ))}
                            {user.memberships.length === 0 && (
                              <span className="text-xs italic text-[#444]">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit text-[11px] font-medium">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            {user.enabled ? 'Active' : 'Disabled'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#666]">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-[#444] hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Global Policy Templates</h3>
                  <p className="text-xs text-[#666]">Pre-defined reusable cross-organization permission sets.</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy) => (
                  <Card key={policy.id} className="bg-[#141414] border-[#242424] hover:border-purple-500/30 transition-all group">
                    <CardHeader className="pb-2">
                       <div className="flex items-center justify-between">
                          <Lock className="w-5 h-5 text-purple-400" />
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Template</Badge>
                       </div>
                       <CardTitle className="text-white mt-4">{policy.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <p className="text-sm text-[#888] line-clamp-2">{policy.description}</p>
                       <div className="flex flex-wrap gap-2">
                          {policy.permissions.slice(0, 3).map((p) => (
                             <Badge key={p} variant="outline" className="text-[10px] bg-[#1a1a1a] border-[#333] text-[#666]">
                                {p}
                             </Badge>
                          ))}
                          {policy.permissions.length > 3 && (
                             <span className="text-[10px] text-[#444]">+{policy.permissions.length - 3} more</span>
                          )}
                       </div>
                       <Button variant="outline" size="sm" className="w-full border-[#333] text-[#999] group-hover:bg-[#1f1f1f] group-hover:text-white">
                          View Definition
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Security Audit Stream</h3>
                  <p className="text-xs text-[#666]">Real-time monitoring of all authorization events across organizations.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-[#333] text-[#888] hover:text-white">
                    Export CSV
                  </Button>
                  <Button className="bg-[#1f1f1f] text-white border border-[#333]">
                    <Clock className="w-4 h-4 mr-2" />
                    Last 24 Hours
                  </Button>
                </div>
              </div>

              <div className="bg-[#141414] border border-[#242424] rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#1a1a1a] border-b border-[#242424]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Resource</th>
                      <th className="px-6 py-4 text-xs font-semibold text-[#555] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242424]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#1a1a1a]/50 transition-colors">
                        <td className="px-6 py-4 text-xs text-[#666] font-mono">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-white font-medium">{log.username}</span>
                        </td>
                        <td className="px-6 py-4">
                          <code className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-xs text-nowrap">
                            {log.action}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#888]">
                          {log.details || log.resource}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] font-bold ${
                              log.status === 'SUCCESS' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}
                          >
                            {log.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => {
  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  } as any;

  return (
    <Card className="bg-[#141414] border-[#242424] hover:border-[#333] transition-colors group shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-[#666] uppercase tracking-wider">{label}</CardTitle>
        <Icon className={`w-4 h-4 ${colorMap[color].split(' ')[0]} group-hover:scale-110 transition-transform`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default IAMDashboard;
