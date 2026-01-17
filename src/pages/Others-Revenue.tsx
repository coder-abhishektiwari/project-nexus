import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, Lock, ShieldCheck, IndianRupee, 
  BarChart3, Download, Zap, ArrowRight, 
  Globe, PieChart, Activity, Award, 
  CheckCircle, Briefcase, HelpCircle, Server
} from "lucide-react";

// --- EXPANDED SELLER DATA (12+) ---
const SELLERS = [
    { id: 1, stack: "MERN Stack Specialist", projects: 6, sales: 214, earnings: 128400, trend: "+12%", status: "Elite" },
    { id: 2, stack: "Python + AI Models", projects: 4, sales: 318, earnings: 205900, trend: "+18%", status: "Pro" },
    { id: 3, stack: "Android (Kotlin) Pro", projects: 5, sales: 189, earnings: 174300, trend: "+8%", status: "Elite" },
    { id: 4, stack: "React + Firebase", projects: 3, sales: 122, earnings: 96500, trend: "+5%", status: "Rising" },
    { id: 5, stack: "Blockchain Expert", projects: 2, sales: 410, earnings: 280000, trend: "+22%", status: "Elite" },
    { id: 6, stack: "Next.js SaaS Builder", projects: 4, sales: 560, earnings: 345600, trend: "+30%", status: "Top Seller" },
    { id: 7, stack: "Java + Spring Boot", projects: 5, sales: 245, earnings: 155200, trend: "+10%", status: "Pro" },
    { id: 8, stack: "Data Science Lead", projects: 3, sales: 331, earnings: 210750, trend: "+15%", status: "Elite" },
    { id: 9, stack: "Flutter Apps", projects: 4, sales: 198, earnings: 132000, trend: "+7%", status: "Pro" },
    { id: 10, stack: "DevOps Architect", projects: 2, sales: 176, earnings: 195000, trend: "+12%", status: "Elite" },
    { id: 11, stack: "Cyber Security Kits", projects: 3, sales: 402, earnings: 265400, trend: "+20%", status: "Top Seller" },
    { id: 12, stack: "Full Stack Engineer", projects: 6, sales: 648, earnings: 390800, trend: "+25%", status: "Legend" },
];

const SellerEarnings = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100">
            <Navbar />

            {/* 1. TOP LIVE TICKER (Infinite Feel) */}
            <div className="bg-indigo-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-indigo-700 mt-16">
                <div className="flex animate-scroll space-x-12 px-4 font-mono text-sm uppercase tracking-widest">
                    {[1,2,3,4,5].map(i => (
                        <span key={i} className="flex items-center gap-2">
                            <Activity className="h-4 w-4" /> Live Sale: Project #742 Sold (₹499) • 
                            Payout Dispatched to Seller #102 • New Seller Approved: #189
                        </span>
                    ))}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-16 space-y-32">
                
                {/* 2. HERO SECTION - High Impact */}
                <header className="text-center max-w-5xl mx-auto space-y-8">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-6 py-2 rounded-full border-emerald-200">
                        Total Payouts to Developers: ₹4.2 Crore+
                    </Badge>
                    <h1 className="text-6xl md:text-8xl font-[1000] tracking-tighter text-slate-950 leading-[0.9]">
                        Real Work. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient">
                            Measurable Impact.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                        We don't just sell code; we build a sustainable Financial Ecosystem for creators. 
                        This page serves as a transparent ledger of our platform's real-time growth and developer success.
                    </p>
                </header>

                {/* 3. PLATFORM CUMULATIVE STATS (The "Thuns do" part) */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Platform Revenue", value: "₹5.12 Cr", icon: <IndianRupee />, color: "text-slate-900" },
                        { label: "Community Payout (80%)", value: "₹4.09 Cr", icon: <ShieldCheck />, color: "text-emerald-600" },
                        { label: "Project Deployments", value: "1.2M+", icon: <Globe />, color: "text-indigo-600" },
                        { label: "Active Buyers", value: "85K+", icon: <Briefcase />, color: "text-violet-600" },
                        { label: "Successful Transactions", value: "450K+", icon: <CheckCircle />, color: "text-blue-600" },
                        { label: "Avg. Seller Income", value: "₹42K/mo", icon: <TrendingUp />, color: "text-orange-600" },
                        { label: "Admin Verified Code", value: "9,400+", icon: <Zap />, color: "text-yellow-600" },
                        { label: "Countries Reached", value: "12+", icon: <Activity />, color: "text-pink-600" },
                    ].map((stat, i) => (
                        <Card key={i} className="p-8 border-none shadow-sm bg-white hover:shadow-xl transition-all group">
                            <div className={`p-3 rounded-2xl bg-slate-50 w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <h3 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter mt-1">{stat.label}</p>
                        </Card>
                    ))}
                </section>

                {/* 4. REVENUE BREAKDOWN (Transparency) */}
                <section className="bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-indigo-100 flex flex-col lg:flex-row gap-16 items-center border border-indigo-50">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl font-black tracking-tight">How the Money is <br /><span className="text-indigo-600">Actually Split?</span></h2>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Our model is built on radical transparency. 
                            We believe developers deserve the lion's share of their hard work. 
                            The remaining portion is reinvested into aggressive global marketing and high-performance infrastructure to keep your projects scaling.
                        </p>
                        <div className="space-y-6">
                            {[
                                { label: "Seller's Direct Share", val: "80%", desc: "The lion's share goes to the creator.", color: "bg-emerald-500" },
                                { label: "Marketing & Lead Gen", val: "10%", desc: "To bring 10k+ daily students to your projects.", color: "bg-indigo-500" },
                                { label: "Platform Maintenance", val: "10%", desc: "Server, Hosting, and Admin Verification costs.", color: "bg-slate-400" },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between font-black text-sm">
                                        <span>{item.label}</span>
                                        <span>{item.val}</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: item.val }} />
                                    </div>
                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-50 p-12 rounded-[2rem] border border-slate-100 relative">
                         <PieChart className="h-64 w-64 text-indigo-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                         <div className="relative z-10 text-center space-y-4">
                            <h4 className="text-xl font-bold italic">"Marketplace with a Conscience"</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Our goal is to maintain the lowest commission in the education-tech industry 
                                while providing the highest code standards.
                            </p>
                         </div>
                    </div>
                </section>

                {/* 5. TOP SELLERS LEADERBOARD (Full Data) */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-[1000] tracking-tight">The 1% Club: Our Top Sellers</h2>
                        <p className="text-slate-500">Verified data of developers making consistent monthly revenue.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {SELLERS.map((s) => (
                            <Card key={s.id} className="p-6 border-none shadow-md hover:shadow-2xl transition-all bg-white relative">
                                <Badge className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 border-none font-bold uppercase text-[9px]">
                                    {s.status}
                                </Badge>
                                <div className="space-y-4">
                                    <p className="text-xs font-mono text-slate-400">#UID_00{s.id}</p>
                                    <h4 className="text-lg font-black leading-tight h-12 line-clamp-2">{s.stack}</h4>
                                    <div className="py-4 border-y border-slate-50 grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Inventory</p>
                                            <p className="font-black text-slate-800">{s.projects}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Total Sales</p>
                                            <p className="font-black text-slate-800">{s.sales}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Earnings</p>
                                            <span className="text-xs font-bold text-emerald-600">{s.trend} ↑</span>
                                        </div>
                                        <p className="text-2xl font-black text-indigo-600 flex items-center gap-1">
                                            <IndianRupee className="h-5 w-5 stroke-[3]" />
                                            {s.earnings.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* 6. GROWTH GRAPHS (Revenue & Downloads) */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Card className="p-10 border-none shadow-2xl bg-white space-y-6">
                        <h3 className="text-2xl font-black flex items-center gap-3"><BarChart3 className="text-indigo-600" /> Revenue Growth Velocity</h3>
                        <div className="h-64 w-full relative">
                            {/* SVG Graph for Revenue */}
                            <svg viewBox="0 0 500 200" className="w-full h-full">
                                <path d="M0,180 L50,170 L100,150 L150,155 L200,120 L250,130 L300,90 L350,100 L400,40 L450,50 L500,10" fill="none" stroke="#4f46e5" strokeWidth="4" />
                                <circle cx="400" cy="40" r="6" fill="#4f46e5" />
                                <text x="360" y="30" fontSize="12" fontWeight="bold" fill="#4f46e5">Peak: ₹4.2Cr</text>
                            </svg>
                        </div>
                        <p className="text-sm text-slate-500 text-center italic">Exponential growth recorded between Q3 2024 and Q2 2025.</p>
                    </Card>

                    <Card className="p-10 border-none shadow-2xl bg-white space-y-6">
                        <h3 className="text-2xl font-black flex items-center gap-3"><Download className="text-emerald-600" /> Deployment Frequency</h3>
                        <div className="h-64 w-full relative">
                            {/* SVG Bars for Downloads */}
                            <svg viewBox="0 0 500 200" className="w-full h-full flex items-end">
                                <rect x="50" y="100" width="40" height="80" fill="#10b981" rx="4" opacity="0.4" />
                                <rect x="150" y="80" width="40" height="100" fill="#10b981" rx="4" opacity="0.6" />
                                <rect x="250" y="50" width="40" height="130" fill="#10b981" rx="4" opacity="0.8" />
                                <rect x="350" y="20" width="40" height="160" fill="#10b981" rx="4" />
                                <text x="340" y="15" fontSize="10" fill="#10b981" fontWeight="bold">1,200/day</text>
                            </svg>
                        </div>
                        <p className="text-sm text-slate-500 text-center italic">Project downloads have tripled due to mobile app integration.</p>
                    </Card>
                </section>

                {/* 7. WHY CHOOSE US VS OTHERS (The Content Boost) */}
                <section className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-4xl font-black text-center tracking-tight">The Nexus Advantage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { title: "Direct Payouts", desc: "No middleman. No waiting 30 days. Get paid when the student buys." },
                            { title: "Zero Marketing Cost", desc: "We spend ₹5L+ monthly on SEO/Ads so you don't have to." },
                            { title: "Code Privacy", desc: "Advanced obfuscation and IP tracking to prevent code leakage." },
                            { title: "Admin Support", desc: "Our engineers review your code to make it market-ready." },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                                <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-black text-slate-900">{item.title}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 8. FAQ SECTION (More Content) */}
                <section className="max-w-3xl mx-auto space-y-8">
                    <h2 className="text-3xl font-black text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "How much can I realistically earn?", a: "Top sellers with 5+ projects earn between ₹30k - ₹80k monthly." },
                            { q: "Do I need to be a professional?", a: "No, as long as your project is working, clean, and solves a problem." },
                            { q: "Is the 80% share fixed?", a: "Yes, it's our platform promise to maintain this ratio for all creators." },
                        ].map((faq, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-black flex items-center gap-2"><HelpCircle className="h-4 w-4 text-indigo-600" /> {faq.q}</p>
                                <p className="text-sm text-slate-500 mt-2 ml-6">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 9. FINAL CALL TO ACTION */}
                <section className="text-center bg-indigo-600 rounded-[4rem] p-16 md:p-32 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <Server className="h-full w-full scale-150 rotate-12" />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            Your Code is a <br /> Gold Mine.
                        </h2>
                        <p className="text-indigo-100 text-xl max-w-xl mx-auto font-medium">
                            Join 180+ developers who are building their wealth one project at a time. 
                            Approval takes less than 24 hours.
                        </p>
                        <Button 
                            size="lg" 
                            className="bg-white text-indigo-600 hover:bg-slate-50 px-12 py-8 rounded-3xl text-2xl font-black shadow-2xl hover:scale-105 transition-transform"
                            onClick={() => window.location.href = "/become-seller"}
                        >
                            Start Selling Now <ArrowRight className="ml-4 h-8 w-8" />
                        </Button>
                    </div>
                </section>

            </main>

            <Footer />

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    display: flex;
                    width: 200%;
                    animation: scroll 30s linear infinite;
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s linear infinite;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

export default SellerEarnings;