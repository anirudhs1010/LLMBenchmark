# **App Name**: LLM Judge

## Core Features:

- Prompt Input: Allow users to enter prompts.
- LLM Rating Tool: Run Llama, DeepSeek and Mistral distilled models in a local sandbox environment. Each LLM should use a rating scale of 1 to 10 to rate the user's prompt.
- Results Display: Show side by side display of ratings, per LLM.
- Export Results: Include export/download functionality to save a comparison. This would produce a single file in CSV format.
- Disclaimer: Basic usage instructions and disclaimers to explain the limits of local evaluations. The intro screen shall state that model evaluations might not be fully representative of actual performance due to limitations with local compute/sandbox env.

## Style Guidelines:

- Primary color: A calm and authoritative blue (#4682B4) to convey trust and intelligence in the evaluation process. This hue suggests reliability without being overly clinical.
- Background color: A very light blue-gray (#F0F8FF). This provides a neutral backdrop that prevents eye strain during extended use and contrasts subtly with the darker elements.
- Accent color: A muted teal (#708090), is used to highlight key interactive elements. The teal complements the primary blue, creating visual interest without overwhelming the user.
- A clean, sans-serif font to ensure readability and accessibility of prompt inputs, LLM ratings, and comparative analyses.
- A clear, sectioned layout that allows for easy comparison. Prompts should always be visible next to each LLM rating. Display should be optimized for side by side display on larger screens, and linear display on smaller screens.
- Minimal icons, using the proposed accent color to signal export, and comparison operations.