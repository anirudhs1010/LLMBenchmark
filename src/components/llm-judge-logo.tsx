import type { SVGProps } from 'react';

export function LlmJudgeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LLM Judge Logo"
      {...props}
    >
      <rect width="100" height="100" rx="15" fill="hsl(var(--primary))" />
      <text
        x="50%"
        y="55%" 
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        fill="hsl(var(--primary-foreground))"
      >
        LLM
      </text>
    </svg>
  );
}
