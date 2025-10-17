import ReportView from '@/components/report/report-view';

export default function ReportPage({ params }: { params: { postcode: string } }) {
  const postcode = decodeURIComponent(params.postcode);
  
  return (
    <div className="flex-1 overflow-auto">
      <ReportView postcode={postcode} />
    </div>
  );
}
