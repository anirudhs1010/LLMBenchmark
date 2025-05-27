export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LLM Judge",
  description: "Benchmark large language models with a panel of AI judges: Llama, DeepSeek, and Mistral.",
  disclaimer: {
    title: "Usage Instructions & Disclaimer",
    text: "Enter a prompt in the text area below and click 'Rate Prompt'. Our panel of AI judges (distilled versions of Llama, DeepSeek, and Mistral) will evaluate your prompt on a scale of 1 to 10. Please note: these evaluations are performed in a sandboxed local environment. The ratings might not be fully representative of actual performance on full-scale models due to limitations with local compute resources and model distillation. This tool is intended for comparative insights and educational purposes.",
  },
};
