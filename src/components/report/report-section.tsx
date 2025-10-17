import type { ReportSection as ReportSectionType } from "@/lib/types";

export default function ReportSection({ section }: { section: ReportSectionType }) {
  return (
    <div>
      <h4 className="font-semibold text-lg mb-2">{section.title}</h4>
      <p className="whitespace-pre-wrap text-muted-foreground">{section.content}</p>
    </div>
  );
}
