'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { ratePrompt, type RatePromptOutput } from '@/ai/flows/llm-rating';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ResultsDisplay } from '@/components/results-display';
import { ExportButton } from '@/components/export-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Zap, Loader2 } from 'lucide-react';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }).max(2000, {
    message: 'Prompt must not exceed 2000 characters.',
  }),
});

export function LlmJudgeForm() {
  const [results, setResults] = useState<RatePromptOutput | null>(null);
  const [submittedPrompt, setSubmittedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setResults(null);
    setSubmittedPrompt(null);

    startTransition(async () => {
      try {
        const aiResult = await ratePrompt({ prompt: values.prompt });
        setResults(aiResult);
        setSubmittedPrompt(values.prompt);
        toast({
          title: 'Success!',
          description: 'Prompt rated successfully by AI judges.',
        });
      } catch (e: any) {
        console.error('Error rating prompt:', e);
        const errorMessage = e.message || 'An unexpected error occurred.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: `Failed to rate prompt: ${errorMessage}`,
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
                <FormLabel htmlFor="prompt-input" className="text-lg font-semibold">Enter Your Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    id="prompt-input"
                    placeholder="e.g., Write a short story about a robot who discovers music..."
                    className="min-h-[150px] resize-y text-base shadow-sm focus:ring-primary focus:border-primary"
                    {...field}
                    aria-label="Prompt input for LLM evaluation"
                  />
                </FormControl>
                <FormDescription>
                  Enter the prompt you want the AI judges to evaluate.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full md:w-auto text-lg py-3 px-6 shadow-md hover:shadow-lg transition-shadow">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Rating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Rate Prompt
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

      {results && submittedPrompt && (
        <div className="space-y-6">
          <ResultsDisplay results={results} prompt={submittedPrompt} />
          <div className="text-center mt-8">
            <ExportButton prompt={submittedPrompt} results={results} />
          </div>
        </div>
      )}
    </div>
  );
}
