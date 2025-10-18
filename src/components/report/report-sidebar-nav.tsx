'use client';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { BarChart, BarChart2, FileText, Home, Landmark, Map, School, Shield, Train } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";

const defaultNavItems = [
    { id: "summary", icon: FileText, label: "Summary" },
    { id: "housing", icon: Home, label: "Housing" },
    { id: "crime-&-safety", icon: Shield, label: "Crime" },
    { id: "local-schools-&-childcare", icon: School, label: "Schools" },
    { id: "transport-links", icon: Train, label: "Transport" },
    { id: "map", icon: Map, label: "Interactive Map" },
];

export default function ReportSidebarNav({
    isMobile = false,
    sections = defaultNavItems,
}: {
    isMobile?: boolean;
    sections?: { id: string; icon: any; label: string }[];
}) {
    const [activeId, setActiveId] = useState<string>("summary");

    useEffect(() => {
        const handleScroll = () => {
            let found = "summary";
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < 120) {
                        found = section.id;
                    }
                }
            }
            setActiveId(found);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (isMobile) return;
        e.preventDefault();
        const targetElement = document.getElementById(id);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (isMobile) {
        return (
            <>
                {sections.map(item => (
                    <Link
                        key={item.label}
                        href={`#${item.id}`}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </>
        )
    }

    return (
        <TooltipProvider>
            {sections.map(item => (
                <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                    <Link
                        href={`#${item.id}`}
                        onClick={(e) => handleClick(e, item.id)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8
                          ${activeId === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
                        `}
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>
    )
}
