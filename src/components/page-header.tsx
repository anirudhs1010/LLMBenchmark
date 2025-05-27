import { siteConfig } from '@/config/site';
import { LlmJudgeLogo } from '@/components/llm-judge-logo';

export function PageHeader() {
  return (
    <header className="py-6 px-4 md:px-6 border-b">
      <div className="container mx-auto flex items-center gap-3">
        <LlmJudgeLogo />
        <h1 className="text-2xl font-bold text-foreground">
          {siteConfig.name}
        </h1>
      </div>
    </header>
  );
}
