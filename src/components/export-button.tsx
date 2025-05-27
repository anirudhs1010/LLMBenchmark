'use client';

import type { RatePromptOutput } from '@/ai/flows/schemas';
import { Button } from '@/components/ui/button';
import { exportToCsv } from '@/lib/csv-utils';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  originalPrompt: string;
  generatedText: string;
  results: RatePromptOutput;
}

export function ExportButton({ originalPrompt, generatedText, results }: ExportButtonProps) {
  const handleExport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `generated_text_evaluation_${timestamp}.csv`;
    
    const dataToExport: string[][] = [
      ['Metric', 'Value'],
      ['Original Prompt', originalPrompt],
      ['Generated Text', generatedText],
      // Sonar Ratings
      ['Sonar - Clarity Rating', String(results.sonar.clarity)],
      ['Sonar - Relevance Rating', String(results.sonar.relevance)],
      ['Sonar - Coherence Rating', String(results.sonar.coherence)],
      ['Sonar - Creativity Rating', String(results.sonar.creativity)],
      ['Sonar - Overall Rating', String(results.sonar.overall)],
      // R1 Ratings
      ['R1-1776 - Clarity Rating', String(results.r1.clarity)],
      ['R1-1776 - Relevance Rating', String(results.r1.relevance)],
      ['R1-1776 - Coherence Rating', String(results.r1.coherence)],
      ['R1-1776 - Creativity Rating', String(results.r1.creativity)],
      ['R1-1776 - Overall Rating', String(results.r1.overall)],
    ];

    exportToCsv(filename, dataToExport);
  };

  return (
    <Button onClick={handleExport} variant="outline" className="shadow">
      <Download className="mr-2 h-4 w-4" />
      Export Results (CSV)
    </Button>
  );
}
