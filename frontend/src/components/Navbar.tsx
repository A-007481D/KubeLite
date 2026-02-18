"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 py-4"
                    : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                            O
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
                            ork8stra
                        </span>
                    </Link>

                    {/* DESKTOP LINKS */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink text="Products" hasDropdown />
                        <NavLink text="Solutions" />
                        <NavLink text="Documentation" />
                        <NavLink text="Pricing" />
                    </div>

                    {/* ACTIONS */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)] active:scale-95">
                            Get Started
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed top-[70px] left-0 ring-0 w-full bg-[#0F172A] border-b border-white/10 z-40 overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <a href="#" className="text-lg text-slate-300 font-medium">Products</a>
                            <a href="#" className="text-lg text-slate-300 font-medium">Solutions</a>
                            <a href="#" className="text-lg text-slate-300 font-medium">Documentation</a>
                            <a href="#" className="text-lg text-slate-300 font-medium">Pricing</a>
                            <div className="h-px bg-white/10 my-2" />
                            <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                                Sign In
                            </button>
                            <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ text, hasDropdown }: { text: string; hasDropdown?: boolean }) {
    return (
        <div className="relative group cursor-pointer flex items-center gap-1">
            <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                {text}
            </span>
            {hasDropdown && (
                <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
            )}
        </div>
    );
}
