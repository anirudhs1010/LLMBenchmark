'use client';

import { type RatePromptOutput } from '@/ai/flows/schemas';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  originalPrompt: string;
  generatedText: string;
  results: RatePromptOutput;
  allPrompts: string[];
  allGeneratedTexts: string[];
  allTargetLengths: string[];
  allStyles: string[];
  allRatings: RatePromptOutput[];
  targetLength: string;
  style: string;
}

// Helper to properly quote and escape CSV fields
function csvEscape(field: any): string {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes('"')) {
    // Escape double quotes by doubling them
    return '"' + str.replace(/"/g, '""') + '"';
  }
  if (str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str + '"';
  }
  return str;
}

export function ExportButton({
  originalPrompt,
  generatedText,
  results,
  allPrompts,
  allGeneratedTexts,
  allTargetLengths,
  allStyles,
  allRatings,
  targetLength,
  style
}: ExportButtonProps) {
  const handleExport = () => {
    // Create headers for all columns
    const headers = [
      'Prompt',
      'Generated Text',
      'Target Length',
      'Style/Tone',
      'Sonar Clarity',
      'Sonar Relevance',
      'Sonar Coherence',
      'Sonar Creativity',
      'Sonar Overall',
      'Llama Clarity',
      'Llama Relevance',
      'Llama Coherence',
      'Llama Creativity',
      'Llama Overall',
      'R1 Clarity',
      'R1 Relevance',
      'R1 Coherence',
      'R1 Creativity',
      'R1 Overall'
    ];

    // Prepare arrays for export, ensuring the current values are included if not already present
    let exportPrompts = [...allPrompts];
    let exportGeneratedTexts = [...allGeneratedTexts];
    let exportTargetLengths = [...allTargetLengths];
    let exportStyles = [...allStyles];
    let exportRatings = [...allRatings];

    const lastPrompt = allPrompts[allPrompts.length - 1];
    const lastGeneratedText = allGeneratedTexts[allGeneratedTexts.length - 1];
    const lastTargetLength = allTargetLengths[allTargetLengths.length - 1];
    const lastStyle = allStyles[allStyles.length - 1];
    const lastRatings = allRatings[allRatings.length - 1];

    const isCurrentIncluded =
      lastPrompt === originalPrompt &&
      lastGeneratedText === generatedText &&
      lastTargetLength === targetLength &&
      lastStyle === style &&
      JSON.stringify(lastRatings) === JSON.stringify(results);

    if (!isCurrentIncluded) {
      exportPrompts.push(originalPrompt);
      exportGeneratedTexts.push(generatedText);
      exportTargetLengths.push(targetLength);
      exportStyles.push(style);
      exportRatings.push(results);
    }

    // Create rows for each prompt, escaping all fields
    const rows = exportPrompts.map((prompt, index) => {
      const ratings = exportRatings[index];
      return [
        csvEscape(prompt),
        csvEscape(exportGeneratedTexts[index]),
        csvEscape(exportTargetLengths[index]),
        csvEscape(exportStyles[index]),
        csvEscape(ratings.sonar.clarity),
        csvEscape(ratings.sonar.relevance),
        csvEscape(ratings.sonar.coherence),
        csvEscape(ratings.sonar.creativity),
        csvEscape(ratings.sonar.overall),
        csvEscape(ratings.llama.clarity),
        csvEscape(ratings.llama.relevance),
        csvEscape(ratings.llama.coherence),
        csvEscape(ratings.llama.creativity),
        csvEscape(ratings.llama.overall),
        csvEscape(ratings.r1.clarity),
        csvEscape(ratings.r1.relevance),
        csvEscape(ratings.r1.coherence),
        csvEscape(ratings.r1.creativity),
        csvEscape(ratings.r1.overall)
      ];
    });

    // Convert to CSV
    const csvContent = [
      headers.map(csvEscape).join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'llm_benchmark_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} className="gap-2">
      <Download className="h-4 w-4" />
      Export Results
    </Button>
  );
}
