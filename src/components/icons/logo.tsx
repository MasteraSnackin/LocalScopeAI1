import { cn } from "@/lib/utils";

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("h-6 w-6", className)}
    {...props}
  >
    <title>LocalScope AI Logo</title>
    <path d="M10.151 13.573C10.583 13.844 11.233 14 12 14a5 5 0 1 0-5-5c0 .767.156 1.417.427 1.849" />
    <path d="m21 21-4.35-4.35" />
    <path d="M10.5 10.5v-3h-3" />
  </svg>
);
