import type { RatePromptOutput } from '@/ai/flows/llm-rating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Cpu, Bot } from 'lucide-react'; // Using generic icons for LLMs

interface ResultsDisplayProps {
  results: RatePromptOutput;
  prompt: string;
}

const llmDetails = [
  { name: 'Llama', key: 'llamaRating' as keyof RatePromptOutput, Icon: Brain, color: "text-chart-1" },
  { name: 'DeepSeek', key: 'deepSeekRating' as keyof RatePromptOutput, Icon: Cpu, color: "text-chart-2" },
  { name: 'Mistral', key: 'mistralRating' as keyof RatePromptOutput, Icon: Bot, color: "text-chart-3" },
];

export function ResultsDisplay({ results, prompt }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Submitted Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{prompt}</p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold text-center text-foreground">AI Judge Ratings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {llmDetails.map(({ name, key, Icon, color }) => (
          <Card key={name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{name}</CardTitle>
              <Icon className={`h-6 w-6 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{results[key]}</div>
              <CardDescription className="text-xs text-muted-foreground">
                out of 10
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
