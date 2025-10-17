import ReportView from '@/components/report/report-view';
import type { GenerateReportFromPostcodeInput } from '@/ai/flows/generate-report-from-postcode';


export default function ReportPage({ params, searchParams }: { params: { postcode: string }, searchParams: { persona?: GenerateReportFromPostcodeInput['persona'] } }) {
  const postcode = decodeURIComponent(params.postcode);
  const persona = searchParams.persona || 'default';
  
  return (
    <div className="flex-1 overflow-auto">
      <ReportView postcode={postcode} persona={persona} />
    </div>
  );
}
