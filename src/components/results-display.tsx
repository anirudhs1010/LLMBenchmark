
import type { RatePromptOutput } from '@/ai/flows/llm-rating';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Cpu, Bot, FileText, MessageSquare } from 'lucide-react'; 

interface ResultsDisplayProps {
  originalPrompt: string;
  generatedText: string;
  ratings: RatePromptOutput;
}

const llmDetails = [
  { name: 'Llama', key: 'llamaRating' as keyof RatePromptOutput, Icon: Brain, color: "text-chart-1" },
  { name: 'DeepSeek', key: 'deepSeekRating' as keyof RatePromptOutput, Icon: Cpu, color: "text-chart-2" },
  { name: 'Mistral', key: 'mistralRating' as keyof RatePromptOutput, Icon: Bot, color: "text-chart-3" },
];

export function ResultsDisplay({ originalPrompt, generatedText, ratings }: ResultsDisplayProps) {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Your Control Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{originalPrompt}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Generated Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{generatedText}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold text-center text-foreground mb-6">AI Judge Ratings (for Generated Text)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {llmDetails.map(({ name, key, Icon, color }) => (
            <Card key={name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{name}</CardTitle>
                <Icon className={`h-6 w-6 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{ratings[key]}</div>
                <CardDescription className="text-xs text-muted-foreground">
                  out of 10
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
