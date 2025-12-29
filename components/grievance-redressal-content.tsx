import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  ExternalLink,
  Shield,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";

export function GrievanceRedressalContent() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm font-medium">
                Customer Support
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Grievance{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Redressal Policy
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are committed to resolving your concerns promptly and fairly.
              Our dedicated team ensures your grievances are addressed with
              utmost care and professionalism.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Grievance Redressal Officer Card */}
            <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/30">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Grievance Redressal Officer
                  </CardTitle>
                </div>
                <p className="text-muted-foreground">
                  If you have any complaints, please contact our dedicated Nodal
                  Officer who will assist you promptly.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Officer Details */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border/50">
                    <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20 flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-lg">
                        Kiran Biradar
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Nodal Officer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border/50">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        +91 8618629391
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Available during business hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border/50">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        grievance@kucash.in
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Email us your concerns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border/50">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">
                        Office Address
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        NO:8, K.NO.13-3, 28TH CROSS, HULIMAVU MAIN ROAD,
                        <br />
                        Hulimavu, Bangalore South,
                        <br />
                        Bangalore - 560076, Karnataka
                      </p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      Response Guarantee
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      We will respond to your complaint within 14 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RBI Ombudsman Card */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-orange-300 dark:hover:border-orange-700">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    RBI Ombudsman
                  </CardTitle>
                </div>
                <p className="text-muted-foreground">
                  If your issue is not resolved within 14 days, you can escalate
                  your complaint to the Reserve Bank of India.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Escalation Process */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50 flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                        When to Escalate
                      </p>
                      <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                        <li>• No response within 14 days</li>
                        <li>• Unsatisfactory resolution</li>
                        <li>• Need independent review</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                        RBI Complaint Management System
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Lodge your complaint directly with the Reserve Bank of
                      India through their official portal.
                    </p>
                    <Link
                      href="https://cms.rbi.org.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full"
                    >
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit RBI CMS Portal
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border/50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        Free Service
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Filing a complaint with RBI Ombudsman is completely free
                        of charge.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Timeline */}
          <div className="mt-16">
            <Card className="bg-card/80 backdrop-blur-sm border-2 border-border/50 shadow-xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Grievance Resolution Process
                </CardTitle>
                <p className="text-muted-foreground">
                  Follow these simple steps to get your concerns addressed
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Step 1 */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        1
                      </div>
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Contact Our Officer
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Reach out to our Nodal Officer via phone, email, or visit
                      our office
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-accent to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        2
                      </div>
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent"></div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      14-Day Resolution
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We investigate and provide a resolution within 14 working
                      days
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-secondary to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        3
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      RBI Escalation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      If unsatisfied, escalate to RBI Ombudsman for independent
                      review
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 dark:from-primary/20 dark:via-accent/20 dark:to-secondary/20 border-2 border-primary/20 shadow-xl">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Need Help? We're Here for You
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Don't hesitate to reach out. Our team is committed to
                  resolving your concerns quickly and fairly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="tel:+918618629391">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Call Now
                    </Button>
                  </Link>
                  <Link href="mailto:grievance@kucash.in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-primary hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Send Email
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
