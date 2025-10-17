"use client";

import { useEffect, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getReport } from "@/lib/actions";
import type { ReportData } from "@/lib/types";
import type { GenerateReportFromPostcodeInput } from "@/ai/flows/generate-report-from-postcode";
import { AlertTriangle } from "lucide-react";
import ExecutiveSummary from "./executive-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function ReportView({ postcode, persona }: ReportViewProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  
  const allSectionTitles = report.reportSections.map(s => s.title);

  return (
    <>
      <div id="report-content" className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div id="summary">
          <ExecutiveSummary summary={report.executiveSummary} />
        </div>

        <Tabs defaultValue={allSectionTitles[0] || 'section-0'}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {allSectionTitles.map((title, index) => (
                  <TabsTrigger key={index} value={title}>{title}</TabsTrigger>
              ))}
              <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>

          {report.reportSections.map((section, index) => (
              <TabsContent key={index} value={section.title} className="mt-4" id={section.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}>
                  <Card>
                      <CardHeader>
                          <CardTitle>{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <ReportSection section={section} />
                          {section.title.toLowerCase().includes("housing") && <HousePriceChart />}
                          {section.title.toLowerCase().includes("crime") && <CrimeChart />}
                          {section.title.toLowerCase().includes("school") && <SchoolsChart />}
                      </CardContent>
                  </Card>
              </TabsContent>
          ))}

          <TabsContent value="map" id="map" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Map</CardTitle>
              </CardHeader>
              <CardContent>
                <InteractiveMap postcode={postcode} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Citations citations={report.citations} />
      </div>
      <ChatRoot postcode={postcode} reportSummary={report.executiveSummary} />
    </>
  );
}
