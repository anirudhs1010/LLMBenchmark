
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Long-Text Generator & Evaluator",
  description: "Generate controlled long-form text using an LLM and evaluate it with AI judges and quality metrics.",
  disclaimer: {
    title: "Controllable Long-Text Generation: Instructions & Disclaimer",
    text: "Define a prompt and control conditions (target length, style). The system will generate text attempting to meet these constraints. Afterwards, AI judges (simulated Llama, DeepSeek, Mistral) will score the generated text. Implementation follows a pipeline: (1) User provides prompt + controls, (2) LLM generates text, (3) AI judges evaluate the text. Results (generated text and scores) are displayed. Please note: Constraint adherence (e.g., exact word count) is an instruction to the LLM and not strictly enforced by automated checkers in this version. This tool is for exploring controllable generation and AI-based evaluation.",
  },
};
