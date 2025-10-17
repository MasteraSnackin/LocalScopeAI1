import ReportLayout from "@/components/report/report-layout";

export default function PostcodeReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReportLayout>{children}</ReportLayout>;
}
