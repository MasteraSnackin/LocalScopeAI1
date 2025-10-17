"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building, Leaf } from "lucide-react";

const personas = [
  { value: "default", label: "Default User", icon: <User className="mr-2 h-4 w-4" /> },
  { value: "first_time_buyer", label: "First-Time Buyer", icon: <User className="mr-2 h-4 w-4" /> },
  { value: "developer", label: "Real Estate Developer", icon: <Building className="mr-2 h-4 w-4" /> },
  { value: "researcher", label: "Climate Researcher", icon: <Leaf className="mr-2 h-4 w-4" /> },
];

export default function HeroSearch() {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [persona, setPersona] = useState("default");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postcode.trim()) {
      router.push(`/report/${encodeURIComponent(postcode.trim().toUpperCase())}?persona=${persona}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 max-w-xl flex flex-col gap-4"
    >
        <Select value={persona} onValueChange={setPersona}>
            <SelectTrigger className="w-full text-lg text-gray-800 bg-white rounded-lg shadow-lg border-none focus:ring-2 focus:ring-primary h-14 px-4">
                <div className="flex items-center">
                {personas.find(p => p.value === persona)?.icon}
                <SelectValue placeholder="Select a report type..." />
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
