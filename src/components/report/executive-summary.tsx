import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExecutiveSummary({ summary }: { summary: string }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Executive Summary</CardTitle>
        <CardDescription>An AI-generated overview of the key findings for this area.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-base leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}
