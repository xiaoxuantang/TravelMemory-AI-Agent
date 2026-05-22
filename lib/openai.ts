export type OpenAIConfig = {
  apiKey: string | undefined;
  model: string;
};

export function getOpenAIConfig(): OpenAIConfig {
  return {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  };
}
