"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  url: string;
  date: string;
  source: string;
}

export default function WhatsNew({ postcode }: { postcode: string }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder: Replace with real API call to fetch news or events for the postcode
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        // Example: Use a news API or property feed here
        // For now, use static sample data
        setNews([
          {
            title: "New housing development approved near " + postcode,
            url: "#",
            date: "2025-10-01",
            source: "Local News",
          },
          {
            title: "Crime rates drop in " + postcode + " area",
            url: "#",
            date: "2025-09-15",
            source: "Police.uk",
          },
          {
            title: "Transport disruption: Rail works this weekend",
            url: "#",
            date: "2025-09-10",
            source: "National Rail",
          },
        ]);
      } catch (err) {
        setError("Could not load live data.");
      }
      setLoading(false);
    }
    fetchNews();
  }, [postcode]);

  if (loading) {
    return <Card className="mb-6"><CardHeader><CardTitle>What's New in This Area?</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <Newspaper className="h-4 w-4" />
        <AlertTitle>Live Data Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>What's New in This Area?</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {news.map((item, idx) => (
            <li key={idx}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                {item.title}
              </a>
              <span className="ml-2 text-xs text-muted-foreground">({item.source}, {item.date})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
