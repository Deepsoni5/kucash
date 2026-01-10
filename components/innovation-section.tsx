"use client";

import {
    Cpu,
    AlertTriangle,
    Lightbulb,
    Workflow,
    TrendingUp,
    ShieldCheck,
    Cloud,
    Users,
    Award,
} from "lucide-react";

export function InnovationSection() {
    return (
        <section id="innovation" className="py-20 lg:py-24 bg-background border-t">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header: Innovation & Technology Overview */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Cpu className="w-4 h-4" />
                        <span>Digital-First Innovation</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
                        <span className="text-foreground">Innovation & </span>
                        <span className="text-primary">Technology</span>
                    </h2>
                    <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                        KuCash is a technology-driven, digital-first loan facilitation platform that improves traditional lending processes through automation and digital workflows. We bridge the gap between borrowers and lenders using advanced algorithms and seamless API integrations.
                    </p>
                </div>

                {/* Problem & Solution Comparison */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Problem */}
                    <div className="bg-red-50/50 dark:bg-red-950/20 p-8 rounded-3xl border border-red-100 dark:border-red-900/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">The Problem</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Traditional loan systems suffer from significant inefficiencies:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-red-500 mt-1">•</span>
                                Excessive paperwork and manual data entry.
                            </li>
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-red-500 mt-1">•</span>
                                Lengthy physical verification processes and approval times.
                            </li>
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-red-500 mt-1">•</span>
                                Fragmented access to lenders, limiting borrower options.
                            </li>
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-red-500 mt-1">•</span>
                                Lack of transparency in loan status and terms.
                            </li>
                        </ul>
                    </div>

                    {/* Solution */}
                    <div className="bg-green-50/50 dark:bg-green-950/20 p-8 rounded-3xl border border-green-100 dark:border-green-900/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Our Innovative Solution</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4 relative z-10">
                            KuCash solves these inefficiencies through a single digital application:
                        </p>
                        <ul className="space-y-3 relative z-10">
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-green-500 mt-1">✓</span>
                                Automated routing of applications to suitable lenders.
                            </li>
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-green-500 mt-1">✓</span>
                                100% paperless onboarding and digital KYC.
                            </li>
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-green-500 mt-1">✓</span>
                                Consent-based data sharing for secure and fast processing.
                            </li>
                            <li className="flex items-start gap-2 text-muted-foreground">
                                <span className="text-green-500 mt-1">✓</span>
                                Real-time status tracking and transparent terms.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Detailed Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {/* Tech Driven Processing */}
                    <div className="bg-card hover:bg-muted/50 transition-colors p-6 rounded-2xl border shadow-sm">
                        <Workflow className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-3">Technology-Driven workflows</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            We utilize automated workflows for digital onboarding and smart application routing. Our real-time processing and scalable system architecture ensure that applications are handled with speed and precision, minimizing manual intervention.
                        </p>
                    </div>

                    {/* Improvement Over Traditional */}
                    <div className="bg-card hover:bg-muted/50 transition-colors p-6 rounded-2xl border shadow-sm">
                        <TrendingUp className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-3">Improvement Over Traditional Models</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Unlike traditional models that rely on physical branches and legacy software, KuCash offers a cloud-native platform. This results in higher efficiency, faster approvals, and vastly improved accessibility for borrowers in remote areas.
                        </p>
                    </div>

                    {/* Data Security */}
                    <div className="bg-card hover:bg-muted/50 transition-colors p-6 rounded-2xl border shadow-sm">
                        <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-3">Data Security & Compliance</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            We prioritize privacy-first design. Our platform adheres to ethical lending facilitation principles and secure data handling standards. All data sharing is strictly user-consent-based, ensuring trust and compliance with regulations.
                        </p>
                    </div>

                    {/* Scalability */}
                    <div className="bg-card hover:bg-muted/50 transition-colors p-6 rounded-2xl border shadow-sm">
                        <Cloud className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-3">Scalability & Sustainability</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Built on a modular, cloud-based architecture, KuCash is designed for pan-India scalability. Our systems can handle increasing volumes without linear operational growth, ensuring sustainability and consistent performance as we expand.
                        </p>
                    </div>

                    {/* Economic Impact */}
                    <div className="bg-card hover:bg-muted/50 transition-colors p-6 rounded-2xl border shadow-sm md:col-span-2 lg:col-span-2">
                        <Users className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-xl font-semibold mb-3">Economic & Social Impact</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            By democratizing access to credit, KuCash contributes significantly to financial inclusion. We drive operational efficiency for our lender partners and generate employment opportunities through our growing ecosystem of digital support and technology development.
                        </p>
                    </div>
                </div>

                {/* Start-Up India / DPIIT Compliance Summary */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-8 lg:p-12 text-center border border-primary/20">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-full mb-6">
                        <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-6">Why KuCash Qualifies as an Innovative Startup</h3>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                        KuCash meets the DPIIT definition of innovation by systematically improving the credit delivery mechanism. through our proprietary use of technology for process improvement, our scalable business model, and our tangible contribution to economic value creation and financial accessibility across India.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
                        <div className="bg-background/80 backdrop-blur p-4 rounded-xl border">
                            <span className="block font-bold text-primary mb-1">Process Innovation</span>
                            <span className="text-sm text-muted-foreground">Automated, digital-first workflows replacing manual legacy systems.</span>
                        </div>
                        <div className="bg-background/80 backdrop-blur p-4 rounded-xl border">
                            <span className="block font-bold text-primary mb-1">Technology Use</span>
                            <span className="text-sm text-muted-foreground">Cloud-native architecture and smart routing algorithms.</span>
                        </div>
                        <div className="bg-background/80 backdrop-blur p-4 rounded-xl border">
                            <span className="block font-bold text-primary mb-1">Scalability</span>
                            <span className="text-sm text-muted-foreground">Modular design capable of serving pan-India without physical branches.</span>
                        </div>
                        <div className="bg-background/80 backdrop-blur p-4 rounded-xl border">
                            <span className="block font-bold text-primary mb-1">Value Creation</span>
                            <span className="text-sm text-muted-foreground">Enhancing financial inclusion and operational efficiency.</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
