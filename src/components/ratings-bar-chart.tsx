import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface RatingsBarChartProps {
  prompts: string[];
  llamaScores: number[];
  sonarScores: number[];
  r1Scores: number[];
}

// This component renders a grouped bar chart for Llama (blue), Sonar (black), R1-1776 (red)
export function RatingsBarChart({ prompts, llamaScores, sonarScores, r1Scores }: RatingsBarChartProps) {
  // Prepare data for Recharts
  const data = prompts.map((prompt, i) => ({
    prompt: prompt.length > 20 ? prompt.slice(0, 20) + '…' : prompt, // Truncate for axis
    Llama: llamaScores[i] ?? 0,
    Sonar: sonarScores[i] ?? 0,
    'R1-1776': r1Scores[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis dataKey="prompt" angle={-30} textAnchor="end" interval={0} height={80} />
        <YAxis domain={[0, 5]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Llama" fill="blue" />
        <Bar dataKey="Sonar" fill="black" />
        <Bar dataKey="R1-1776" fill="red" />
      </BarChart>
    </ResponsiveContainer>
  );
} 