"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postcode.trim()) {
      router.push(`/report/${encodeURIComponent(postcode.trim().toUpperCase())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 max-w-xl"
    >
      <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg">
        <Input
          type="text"
          name="postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter a UK postcode (e.g., SW1A 0AA)"
          className="flex-grow border-none text-lg text-gray-800 placeholder:text-gray-400 focus-visible:ring-0"
          aria-label="Postcode"
        />
        <Button type="submit" size="lg" className="shrink-0">
          <Search className="mr-2 h-5 w-5" />
          Generate Report
        </Button>
      </div>
    </form>
  );
}
