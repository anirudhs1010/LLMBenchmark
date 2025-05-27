import type { RatePromptOutput } from '@/ai/flows/schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, Target, ThumbsUp, Zap } from 'lucide-react';

interface ResultsDisplayProps {
  originalPrompt: string;
  generatedText: string;
  ratings: RatePromptOutput;
}

const ratingDetails = [
  { name: 'Clarity', key: 'clarity' as const, Icon: Target, color: "text-blue-500", description: "How clear and understandable the prompt is" },
  { name: 'Relevance', key: 'relevance' as const, Icon: ThumbsUp, color: "text-green-500", description: "How well the generated text matches the prompt" },
  { name: 'Coherence', key: 'coherence' as const, Icon: Brain, color: "text-purple-500", description: "How logical and well-structured the generated text is" },
  { name: 'Creativity', key: 'creativity' as const, Icon: Sparkles, color: "text-yellow-500", description: "How original and imaginative the generated text is" },
  { name: 'Overall', key: 'overall' as const, Icon: Zap, color: "text-red-500", description: "Overall quality of both prompt and generated text" },
];

export function ResultsDisplay({ originalPrompt, generatedText, ratings }: ResultsDisplayProps) {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Your Control Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{originalPrompt}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Generated Text</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{generatedText}</p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold text-center text-foreground mb-6">AI Evaluation Results</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-center text-foreground mb-4">Perplexity Sonar Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ratingDetails.map(({ name, key, Icon, color, description }) => (
                <Card key={`sonar-${name}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{name}</CardTitle>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{ratings.sonar[key]}</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-center text-foreground mb-4">Perplexity R1-1776 Ratings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ratingDetails.map(({ name, key, Icon, color, description }) => (
                <Card key={`r1-${name}`} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{name}</CardTitle>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{ratings.r1[key]}</div>
                    <CardDescription className="text-xs text-muted-foreground">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
