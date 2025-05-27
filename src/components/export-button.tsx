'use client';

import type { RatePromptOutput } from '@/ai/flows/llm-rating';
import { Button } from '@/components/ui/button';
import { exportToCsv } from '@/lib/csv-utils';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  prompt: string;
  results: RatePromptOutput;
}

export function ExportButton({ prompt, results }: ExportButtonProps) {
  const handleExport = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `llm_judge_results_${timestamp}.csv`;
    
    const dataToExport: string[][] = [
      ['Metric', 'Value'],
      ['Prompt', prompt],
      ['Llama Rating', String(results.llamaRating)],
      ['DeepSeek Rating', String(results.deepSeekRating)],
      ['Mistral Rating', String(results.mistralRating)],
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
