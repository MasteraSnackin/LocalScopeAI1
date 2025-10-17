"use client";

import { useEffect, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getReport, getSuggestedQuestions } from "@/lib/actions";
import type { ReportData, ReportSection as ReportSectionType } from "@/lib/types";
import type { GenerateReportFromPostcodeInput } from "@/ai/flows/generate-report-from-postcode";
import { AlertTriangle, BarChart, Home, School, Shield, Train } from "lucide-react";
import ExecutiveSummary from "./executive-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReportSection from "./report-section";
import Citations from "./citations";
import HousePriceChart from "./charts/house-price-chart";
import CrimeChart from "./charts/crime-chart";
import SchoolsChart from "./charts/schools-chart";
import InteractiveMap from "./interactive-map";
import Loading from "@/app/report/[postcode]/loading";
import ChatRoot from "../chat/chat-root";
import { useToast } from "@/hooks/use-toast";
import { exportToPdf } from "@/lib/pdf-export";

interface ReportViewProps {
    postcode: string;
    persona: GenerateReportFromPostcodeInput['persona'];
}

const SectionWrapper = ({ id, children }: { id: string, children: React.ReactNode }) => (
    <div id={id} className="pt-4 -mt-4">
        {children}
    </div>
);

const getSectionIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("housing")) return <Home className="h-6 w-6 text-primary" />;
    if (lowerTitle.includes("crime")) return <Shield className="h-6 w-6 text-primary" />;
    if (lowerTitle.includes("school")) return <School className="h-6 w-6 text-primary" />;
    if (lowerTitle.includes("transport")) return <Train className="h-6 w-6 text-primary" />;
    return <BarChart className="h-6 w-6 text-primary" />;
}

export default function ReportView({ postcode, persona }: ReportViewProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialQuestions, setInitialQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleExport = useCallback(async () => {
    const reportElement = document.getElementById('report-content');
    if (report && reportElement) {
      toast({
        title: "Generating PDF...",
        description: "Your report is being prepared for download.",
      });
      try {
        await exportToPdf(reportElement, postcode);
      } catch (err) {
        console.error("PDF Export Error: ", err);
        toast({
          variant: "destructive",
          title: "PDF Export Failed",
          description: "There was an error creating the PDF file.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Cannot Export PDF",
        description: "The report data is not available or the report content could not be found.",
      });
    }
  }, [report, postcode, toast]);

  useEffect(() => {
    window.addEventListener('export-pdf', handleExport);
    return () => {
      window.removeEventListener('export-pdf', handleExport);
    };
  }, [handleExport]);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      const result = await getReport(postcode, persona);
      if (result.success) {
        setReport(result.data);
        const questionsResult = await getSuggestedQuestions(result.data.executiveSummary);
        if (questionsResult.success) {
          setInitialQuestions(questionsResult.questions);
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchReport();
  }, [postcode, persona]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Report</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!report) {
    return null;
  }
  
  const createSectionId = (title: string) => title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

  const mainSections = report.reportSections.slice(0, 4);
  const otherSections = report.reportSections.slice(4);

  return (
    <>
      <div id="report-content" className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <SectionWrapper id="summary">
          <ExecutiveSummary summary={report.executiveSummary} />
        </SectionWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {mainSections.map((section, index) => (
               <SectionWrapper key={index} id={createSectionId(section.title)}>
                  <Card>
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3">
                            {getSectionIcon(section.title)}
                            <span>{section.title}</span>
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <ReportSection section={section} />
                          {section.title.toLowerCase().includes("housing") && <HousePriceChart />}
                          {section.title.toLowerCase().includes("crime") && <CrimeChart />}
                          {section.title.toLowerCase().includes("school") && <SchoolsChart />}
                      </CardContent>
                  </Card>
              </SectionWrapper>
            ))}
          </div>
          <div className="lg:col-span-1 space-y-8">
             <SectionWrapper id="map">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractiveMap postcode={postcode} />
                  </CardContent>
                </Card>
            </SectionWrapper>
             {otherSections.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {otherSections.map((section, index) => (
                            <div key={index} id={createSectionId(section.title)}>
                                <ReportSection section={section} />
                                {index < otherSections.length - 1 && <hr className="my-6"/>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
             )}
          </div>
        </div>

        <Citations citations={report.citations} />
      </div>
      <ChatRoot 
        postcode={postcode} 
        reportSummary={report.executiveSummary} 
        initialQuestions={initialQuestions}
      />
    </>
  );
}
