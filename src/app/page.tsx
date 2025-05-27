import { DisclaimerSection } from '@/components/disclaimer-section';
import { LlmJudgeForm } from '@/components/llm-judge-form';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <DisclaimerSection />
          <LlmJudgeForm />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
