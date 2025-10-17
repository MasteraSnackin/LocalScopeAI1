"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, PanelLeft, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "../icons/logo";
import Link from "next/link";
import ReportSidebarNav from "./report-sidebar-nav";

export default function ReportHeader() {
  const params = useParams();
  const router = useRouter();
  const postcode = params.postcode ? decodeURIComponent(params.postcode as string) : "";

  // The PDF export functionality will be triggered from the ReportView component,
  // so this button is primarily for UI.
  const handleExport = () => {
    // A global event can be dispatched here, and listened to in ReportView
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

      <div className="relative ml-auto flex-1 md:grow-0">
        <h1 className="text-xl font-semibold hidden sm:block">Report for {postcode}</h1>
      </div>
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
