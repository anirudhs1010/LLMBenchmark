
'use client';

import type { RatePromptOutput } from '@/ai/flows/llm-rating';
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
      ['Llama Rating (for Generated Text)', String(results.llamaRating)],
      ['DeepSeek Rating (for Generated Text)', String(results.deepSeekRating)],
      ['Mistral Rating (for Generated Text)', String(results.mistralRating)],
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
