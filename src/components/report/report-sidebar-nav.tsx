'use client';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
import { BarChart, BarChart2, FileText, Home, Landmark, Map, School, Shield, Train } from "lucide-react";
import Link from "next/link";

const navItems = [
    { href: "#summary", icon: FileText, label: "Summary" },
    { href: "#housing", icon: Home, label: "Housing" },
    { href: "#crime", icon: Shield, label: "Crime" },
    { href: "#schools", icon: School, label: "Schools" },
    { href: "#transport", icon: Train, label: "Transport" },
    { href: "#map", icon: Map, label: "Interactive Map" },
];


export default function ReportSidebarNav({ isMobile = false }: { isMobile?: boolean}) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (isMobile) return;
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    if (isMobile) {
        return (
            <>
                {navItems.map(item => (
                    <Link
                        key={item.label}
                        href={item.href}
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
            {navItems.map(item => (
                <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        onClick={(e) => handleClick(e, item.href)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
