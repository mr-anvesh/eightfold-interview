import { Navbar } from "@/components/landing/navbar";
import { HeroShowcase } from "@/components/landing/hero-showcase";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { RoleExplorer } from "@/components/landing/role-explorer";
import { ScoredReportPreview } from "@/components/landing/scored-report-preview";
import { PipelineArchitecture } from "@/components/landing/pipeline-architecture";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="grain flex min-h-screen flex-col bg-cream text-ink">
      <Navbar />

      <main className="flex-1">
        <HeroShowcase />
        <FeaturesGrid />
        <RoleExplorer />
        <ScoredReportPreview />
        <PipelineArchitecture />
        <ComparisonSection />
        <FAQSection />
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
