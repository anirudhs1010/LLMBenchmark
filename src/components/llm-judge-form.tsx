'use client';

import { generateControlledText } from '@/ai/flows/generate-controlled-text';
import { ratePrompt } from '@/ai/flows/llm-rating';
import { type RatePromptOutput } from '@/ai/flows/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ExportButton } from '@/components/export-button';
import { RatingsBarChart } from '@/components/ratings-bar-chart';
import { ResultsDisplay } from '@/components/results-display';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PenTool, Terminal } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }).max(2000, {
    message: 'Prompt must not exceed 2000 characters.',
  }),
  targetLength: z.string().optional(),
  style: z.string().optional(),
});

const styleOptions = ["Neutral", "Formal", "Humorous", "Creative", "Technical", "Persuasive", "Informative"];

export function LlmJudgeForm() {
  const [currentRatings, setCurrentRatings] = useState<RatePromptOutput | null>(null);
  const [currentGeneratedText, setCurrentGeneratedText] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  
  // Separate arrays for each piece of data
  const [prompts, setPrompts] = useState<string[]>([]);
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
  const [targetLengths, setTargetLengths] = useState<string[]>([]);
  const [styles, setStyles] = useState<string[]>([]);
  const [allRatings, setAllRatings] = useState<RatePromptOutput[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [showChart, setShowChart] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      targetLength: 'around 200 words',
      style: 'Neutral',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    setError(null);
    setCurrentRatings(null);
    setCurrentGeneratedText(null);
    setCurrentPrompt(null);

    startTransition(async () => {
      try {
        toast({
          title: 'Generating Text...',
          description: 'The AI is crafting your text based on the controls.',
        });
        console.log('Calling generateControlledText with:', {
          prompt: values.prompt,
          targetLength: values.targetLength,
          style: values.style,
        });
        
        const generationResult = await generateControlledText({
          prompt: values.prompt,
          targetLength: values.targetLength,
          style: values.style,
        });
        
        console.log('Generation result:', generationResult);
        
        if (!generationResult || !generationResult.generatedText) {
          throw new Error('Text generation failed to produce content.');
        }
        setCurrentGeneratedText(generationResult.generatedText);
        setCurrentPrompt(values.prompt);

        toast({
          title: 'Text Generated!',
          description: 'Now, AI judges are evaluating the generated text.',
        });

        console.log('Calling ratePrompt with:', {
          prompt: values.prompt,
          generatedText: generationResult.generatedText
        });
        const aiRatings = await ratePrompt({ 
          prompt: values.prompt,
          generatedText: generationResult.generatedText 
        });
        console.log('AI ratings result:', aiRatings);
        setCurrentRatings(aiRatings);

        // Add each piece of data to its respective array
        setPrompts(prev => [...prev, values.prompt]);
        setGeneratedTexts(prev => [...prev, generationResult.generatedText]);
        setTargetLengths(prev => [...prev, values.targetLength || '']);
        setStyles(prev => [...prev, values.style || '']);
        setAllRatings(prev => [...prev, aiRatings]);
        
        toast({
          title: 'Success!',
          description: 'Text generated and rated successfully.',
        });
      } catch (e: any) {
        console.error('Error in generation/rating process:', e);
        const errorMessage = e.message || 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: `Process failed: ${errorMessage}`,
          variant: 'destructive',
        });
      }
    });
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-lg bg-card">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="prompt-input" className="text-lg font-semibold">Enter Your Core Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    id="prompt-input"
                    placeholder="e.g., Write a short story about a robot who discovers music..."
                    className="min-h-[150px] resize-y text-base shadow-sm focus:ring-primary focus:border-primary"
                    {...field}
                    aria-label="Core prompt for text generation"
                  />
                </FormControl>
                <FormDescription>
                  This is the main topic or instruction for the text generation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="targetLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="targetLength-input">Target Length</FormLabel>
                  <FormControl>
                    <Input 
                      id="targetLength-input"
                      placeholder="e.g., approx 300 words" 
                      {...field} 
                      className="shadow-sm focus:ring-primary focus:border-primary"
                      aria-label="Target length for generated text"
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the desired length (e.g., "a short paragraph", "about 500 words").
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="style-select">Style/Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                    <FormControl>
                      <SelectTrigger id="style-select" className="shadow-sm focus:ring-primary focus:border-primary" aria-label="Style or tone for generated text">
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {styleOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   <FormDescription>
                    Choose the desired style for the generated text.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full md:w-auto text-lg py-3 px-6 shadow-md hover:shadow-lg transition-shadow">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <PenTool className="mr-2 h-5 w-5" />
                Generate & Evaluate
              </>
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentGeneratedText && currentPrompt && currentRatings && (
        <div className="space-y-6">
          <ResultsDisplay 
            originalPrompt={currentPrompt} 
            generatedText={currentGeneratedText} 
            ratings={currentRatings} 
          />
          <div className="text-center mt-8 flex flex-col items-center gap-4">
            <ExportButton 
              originalPrompt={currentPrompt} 
              generatedText={currentGeneratedText} 
              results={currentRatings}
              allPrompts={prompts}
              allGeneratedTexts={generatedTexts}
              allTargetLengths={targetLengths}
              allStyles={styles}
              allRatings={allRatings}
              targetLength={form.getValues('targetLength') || ''}
              style={form.getValues('style') || ''}
            />
            <Button onClick={() => setShowChart(v => !v)} variant="outline" className="mt-2">
              {showChart ? 'Hide Bar Chart' : 'Show Bar Chart'}
            </Button>
            {showChart && (
              <div className="w-full max-w-4xl mx-auto mt-4">
                <RatingsBarChart 
                  prompts={prompts}
                  llamaScores={allRatings.map(r => r.llama?.overall ?? 0)}
                  sonarScores={allRatings.map(r => r.sonar?.overall ?? 0)}
                  r1Scores={allRatings.map(r => r.r1?.overall ?? 0)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
