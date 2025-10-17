"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KeyInsight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Key, TrendingDown, TrendingUp } from "lucide-react";
import type { GenerateReportFromPostcodeInput } from "@/ai/flows/generate-report-from-postcode";

interface KeyInsightsProps {
  insights: KeyInsight[];
  persona?: GenerateReportFromPostcodeInput['persona'];
}

const getPersonaLabel = (persona: KeyInsightsProps['persona']) => {
    switch (persona) {
        case 'first_time_buyer': return 'First-Time Buyer';
        case 'family_with_children': return 'Family with Children';
        case 'renter_student': return 'Renter / Student';
        case 'developer': return 'Real Estate Developer';
        case 'small_business_owner': return 'Small Business Owner';
        case 'researcher': return 'Climate Researcher';
        case 'urban_planner': return 'Urban Planner';
        default: return 'User';
    }
}

const InsightIcon = ({ type }: { type: KeyInsight['type'] }) => {
  switch (type) {
    case 'positive':
      return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />;
    case 'negative':
      return <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />;
    case 'neutral':
      return <div className="h-5 w-5 flex items-center justify-center shrink-0"><div className="h-2 w-2 bg-gray-500 rounded-full"></div></div>;
  }
};

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Briefly highlight the section
        element.classList.add('transition-all', 'duration-300', 'ring-2', 'ring-primary', 'rounded-lg');
        setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'rounded-lg');
        }, 1500);
    }
}

export default function KeyInsights({ insights, persona }: KeyInsightsProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Key className="h-6 w-6 text-primary" />
          <span>Key Insights for a {getPersonaLabel(persona)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {insights.map((item, index) => (
            <li key={index} >
                <button 
                    onClick={() => scrollToSection(item.sectionId)}
                    className="flex items-start gap-3 text-left w-full p-2 rounded-md hover:bg-primary/10 transition-colors"
                >
                    <InsightIcon type={item.type} />
                    <span className="text-sm md:text-base">{item.insight}</span>
                </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
