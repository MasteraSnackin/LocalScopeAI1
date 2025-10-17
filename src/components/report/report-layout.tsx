"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import ReportHeader from "./report-header";
import ReportSidebar from "./report-sidebar";

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full flex-col bg-muted/40">
        <ReportSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <ReportHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
