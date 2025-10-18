"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getReport } from "@/lib/actions";
import ReportView from "@/components/report/report-view";

const personas = [
  { value: "default", label: "Default User" },
  { value: "first_time_buyer", label: "First-Time Buyer" },
  { value: "family_with_children", label: "Family with Children" },
  { value: "renter_student", label: "Renter / Student" },
  { value: "developer", label: "Real Estate Developer" },
  { value: "small_business_owner", label: "Small Business Owner" },
  { value: "researcher", label: "Climate Researcher" },
  { value: "urban_planner", label: "Urban Planner" },
];

export default function ComparePage() {
  const [postcode1, setPostcode1] = useState("");
  const [persona1, setPersona1] = useState("default");
  const [postcode2, setPostcode2] = useState("");
  const [persona2, setPersona2] = useState("default");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Compare Two Postcodes</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Postcode 1</h2>
          <Input
            type="text"
            value={postcode1}
            onChange={e => setPostcode1(e.target.value)}
            placeholder="Enter first UK postcode"
            required
          />
          <Select value={persona1} onValueChange={setPersona1}>
            <SelectTrigger>
              <SelectValue placeholder="Select persona" />
            </SelectTrigger>
            <SelectContent>
              {personas.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Postcode 2</h2>
          <Input
            type="text"
            value={postcode2}
            onChange={e => setPostcode2(e.target.value)}
            placeholder="Enter second UK postcode"
            required
          />
          <Select value={persona2} onValueChange={setPersona2}>
            <SelectTrigger>
              <SelectValue placeholder="Select persona" />
            </SelectTrigger>
            <SelectContent>
              {personas.map(p => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 flex justify-center">
          <Button type="submit" size="lg">Compare</Button>
        </div>
      </form>
      {submitted && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Report for {postcode1.toUpperCase()}</h3>
            <ReportView postcode={postcode1} persona={persona1 as any} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Report for {postcode2.toUpperCase()}</h3>
            <ReportView postcode={postcode2} persona={persona2 as any} />
          </div>
        </div>
      )}
    </div>
  );
}
