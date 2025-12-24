"use client"

import { Button } from "@/components/ui/button"
import { Calculator, ArrowRight, Zap, ShieldCheck, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function EMICTASection() {
    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -z-10" />

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
                    {/* Animated pattern background */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                    <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/90 font-medium text-sm border border-white/20 backdrop-blur-md">
                                <Calculator className="w-4 h-4 text-primary" />
                                Planning your finances?
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                Calculate Your EMI <br />
                                <span className="text-primary italic">In Seconds.</span>
                            </h2>

                            <p className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed">
                                Don't guess your monthly installments. Use our smart calculator to plan your loan better and see exactly how much you'll pay.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link href="/emi-calculator">
                                    <Button size="lg" className="rounded-full bg-primary text-white text-lg px-8 py-7 shadow-xl hover:scale-105 transition-all group">
                                        Try EMI Calculator <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <div className="flex -space-x-3 items-center">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`https://i.pravatar.cc/100?u=${i}`}
                                                alt="User"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    <span className="ml-4 text-sm text-slate-400 font-medium">Joined by 5,000+ users</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Zap className="w-4 h-4 text-primary" />
                                    Instant Results
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                    No Data Logs
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Clock className="w-4 h-4 text-primary" />
                                    Saves Time
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-slate-400">Monthly EMI</span>
                                        <span className="text-2xl font-bold text-white">₹15,240</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500 uppercase tracking-widest font-bold">
                                            <span>Principal</span>
                                            <span>85%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full w-[85%] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500 uppercase tracking-widest font-bold">
                                            <span>Interest</span>
                                            <span>15%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full w-[15%] bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex items-center justify-center">
                                        <div className="w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center relative">
                                            <div className="text-center">
                                                <div className="text-xs text-slate-400">Total</div>
                                                <div className="text-sm font-bold text-white">₹10L</div>
                                            </div>
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle
                                                    cx="50%" cy="50%" r="41%"
                                                    className="fill-none stroke-primary stroke-[8px]"
                                                    strokeDasharray="200 100"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating element */}
                            <div className="absolute -bottom-6 -left-6 z-20 bg-primary p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                                <Calculator className="w-6 h-6 text-white" />
                                <span className="text-white font-bold text-sm leading-tight">Smart <br />Calculation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
