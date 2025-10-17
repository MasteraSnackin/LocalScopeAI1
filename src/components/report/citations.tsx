import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "lucide-react";

export default function Citations({ citations }: { citations: string[] }) {
  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
            <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span>View Data Sources & Citations</span>
            </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            {citations.map((citation, index) => (
              <li key={index}>{citation}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
