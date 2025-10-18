"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, PanelLeft, Search, User, Building, Leaf, Store, Users, GraduationCap, Landmark } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Logo } from "../icons/logo";
import Link from "next/link";
import ReportSidebarNav from "./report-sidebar-nav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";

export default function ReportHeader() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const postcode = params.postcode ? decodeURIComponent(params.postcode as string) : "";
  const persona = searchParams.get("persona") || "default";

  const personas = [
    { value: "default", label: "Default User", icon: <User className="mr-2 h-4 w-4" /> },
    { value: "first_time_buyer", label: "First-Time Buyer", icon: <User className="mr-2 h-4 w-4" /> },
    { value: "family_with_children", label: "Family with Children", icon: <Users className="mr-2 h-4 w-4" /> },
    { value: "renter_student", label: "Renter / Student", icon: <GraduationCap className="mr-2 h-4 w-4" /> },
    { value: "developer", label: "Real Estate Developer", icon: <Building className="mr-2 h-4 w-4" /> },
    { value: "small_business_owner", label: "Small Business Owner", icon: <Store className="mr-2 h-4 w-4" /> },
    { value: "researcher", label: "Climate Researcher", icon: <Leaf className="mr-2 h-4 w-4" /> },
    { value: "urban_planner", label: "Urban Planner", icon: <Landmark className="mr-2 h-4 w-4" /> },
  ];

  const handlePersonaChange = (newPersona: string) => {
    router.push(`/report/${encodeURIComponent(postcode)}?persona=${newPersona}`);
  };

  const { theme, setTheme } = useTheme();

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent('export-pdf'));
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">LocalScope AI</span>
            </Link>
            <ReportSidebarNav isMobile={true} />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="relative ml-auto flex-1 md:grow-0 flex items-center gap-4">
        <h1 className="text-xl font-semibold hidden sm:block">Report for {postcode}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">Persona:</span>
          <Select value={persona} onValueChange={handlePersonaChange}>
            <SelectTrigger className="w-48 h-8 text-sm bg-background border border-muted-foreground">
              <div className="flex items-center">
                {personas.find(p => p.value === persona)?.icon}
                <SelectValue placeholder="Persona" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {personas.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <div className="flex items-center">
                    {p.icon}
                    {p.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle dark mode"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        {theme === "dark" ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3m9-9a9 9 0 100 18 9 9 0 000-18z"></path></svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3m9-9a9 9 0 100 18 9 9 0 000-18z"></path></svg>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={() => router.push('/')}>
        <Search className="mr-2 h-4 w-4" />
        New Search
      </Button>
      <Button size="sm" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </header>
  );
}
