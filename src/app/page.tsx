import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Home as HomeIcon, Search, Shield, Train } from "lucide-react";
import Image from 'next/image';
import HeroSearch from "@/components/landing/hero-search";
import { AnimatedSection } from "@/components/landing/animated-section";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <HomeIcon className="h-8 w-8 text-primary" />,
    title: "Property Insights",
    description: "In-depth analysis of local house prices, market trends, and rental yields.",
    image: PlaceHolderImages[0]
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Crime & Safety",
    description: "Detailed crime statistics and safety ratings to keep you informed.",
    image: PlaceHolderImages[1]
  },
  {
    icon: <Train className="h-8 w-8 text-primary" />,
    title: "Transport Links",
    description: "Comprehensive overview of public transport options and commute times.",
    image: PlaceHolderImages[2]
  },
];

const reportTypes = [
  "Executive Summary",
  "Demographics",
  "House Price Trends",
  "Local Schools",
  "Crime Rates",
  "Amenities",
  "Transport Links",
  "Broadband Speed",
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute top-0 left-0 right-0 z-10 py-4 px-4 sm:px-6 lg:px-8">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">LocalScope AI</span>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative flex h-[80vh] min-h-[600px] w-full items-center justify-center bg-gradient-to-br from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection className="fade-in animate-delay-100">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Unlock Local Insights with AI
              </h1>
            </AnimatedSection>
            <AnimatedSection className="fade-in animate-delay-300">
              <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
                Enter a UK postcode to generate a comprehensive, AI-powered report on any area.
              </p>
            </AnimatedSection>
            <AnimatedSection className="fade-in animate-delay-500">
              <HeroSearch />
            </AnimatedSection>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                Everything You Need to Know, in One Place
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
                Our reports cover all aspects of a local area, giving you a complete picture.
              </p>
            </AnimatedSection>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <AnimatedSection key={feature.title} className={`fade-in animate-delay-${(i + 1) * 100}`}>
                  <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {feature.icon}
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <p className="mt-4 text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section id="report-types" className="bg-muted py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <AnimatedSection className="fade-in animate-delay-100">
                <div className="space-y-4">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    Comprehensive Analysis
                  </span>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Detailed Report Sections
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    From schools to broadband, we analyze dozens of data points to create a holistic view of the area.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {reportTypes.map((type) => (
                    <div key={type} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{type}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
              <AnimatedSection className="fade-in animate-delay-300">
                <Image
                  src={PlaceHolderImages[3]?.imageUrl || "https://picsum.photos/seed/report/600/400"}
                  alt={PlaceHolderImages[3]?.description || "Report sample"}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                  data-ai-hint={PlaceHolderImages[3]?.imageHint || "report sample"}
                />
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto py-8 px-4 text-center">
          <p>&copy; {new Date().getFullYear()} LocalScope AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
