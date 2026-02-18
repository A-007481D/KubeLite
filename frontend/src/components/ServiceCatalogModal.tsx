
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Server, Layout, Database, Cpu, Search, ArrowRight, Box } from "lucide-react";

interface ServiceCatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectService: (type: "backend" | "frontend" | "database" | "worker") => void;
}

const CatalogItem = ({
    icon,
    title,
    description,
    onClick
}: {
    icon: React.ReactNode,
    title: string,
    description: string,
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className="group flex flex-col items-start p-4 rounded-xl border border-[#2C2C2C] bg-[#141414] hover:bg-[#1A1A1A] hover:border-[#444] transition-all text-left h-full relative overflow-hidden"
    >
        <div className="mb-3 p-2 rounded-lg bg-[#222] text-[#AAA] group-hover:text-white group-hover:bg-[#333] transition-colors">
            {icon}
        </div>
        <h3 className="text-sm font-medium text-[#E3E3E3] mb-1">{title}</h3>
        <p className="text-xs text-[#888] leading-relaxed">{description}</p>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
            <ArrowRight className="w-4 h-4 text-[#00E5FF]" />
        </div>
    </button>
);

export default function ServiceCatalogModal({ isOpen, onClose, onSelectService }: ServiceCatalogModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-[#0F0F0F] border border-[#242424] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-[#242424] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 border border-white/5">
                            <Box className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-white">Service Catalog</h2>
                            <p className="text-xs text-[#666]">Browse and launch managed services</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 text-[#666] hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Search (Visual only for now) */}
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#555]" />
                        <input
                            type="text"
                            placeholder="Search catalog (e.g., Postgres, Node.js)..."
                            className="w-full bg-[#141414] border border-[#2C2C2C] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#555] focus:border-[#444] outline-none"
                        />
                    </div>

                    <div className="space-y-8">
                        {/* Compute Section */}
                        <section>
                            <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-4 px-1">Compute</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <CatalogItem
                                    icon={<Server className="w-5 h-5" />}
                                    title="Backend API"
                                    description="Deploy Go, Node.js, Python servers. Auto-scaled & managed."
                                    onClick={() => onSelectService("backend")}
                                />
                                <CatalogItem
                                    icon={<Layout className="w-5 h-5" />}
                                    title="Frontend App"
                                    description="Host React, Vue, Svelte, or Next.js applications."
                                    onClick={() => onSelectService("frontend")}
                                />
                                <CatalogItem
                                    icon={<Cpu className="w-5 h-5" />}
                                    title="Background Worker"
                                    description="Process queues, cron jobs, and async tasks."
                                    onClick={() => onSelectService("worker")}
                                />
                            </div>
                        </section>

                        {/* Data Section */}
                        <section>
                            <h3 className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-4 px-1">Data Store</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <CatalogItem
                                    icon={<Database className="w-5 h-5" />}
                                    title="PostgreSQL"
                                    description="Relational database with automated backups."
                                    onClick={() => onSelectService("database")}
                                />
                                <CatalogItem
                                    icon={<Database className="w-5 h-5" />}
                                    title="Redis"
                                    description="In-memory data store for caching and queues."
                                    onClick={() => onSelectService("database")}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
