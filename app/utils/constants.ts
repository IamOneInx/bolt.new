export const WORK_DIR_NAME = 'project';
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = 'bolt_file_modifications';

export const MODEL_REGEX = /^\[Model: (.*?)\]\n\n/;
export const PROVIDER_REGEX = /\[Provider: (.*?)\]\n\n/;

export interface ModelInfo {
  name: string;
  label: string;
  provider: string;
  maxTokenAllowed: number;
}

export interface ProviderInfo {
  name: string;
  staticModels: ModelInfo[];
}

export const PROVIDER_LIST: ProviderInfo[] = [
  {
    name: 'Anthropic',
    staticModels: [
      { name: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', maxTokenAllowed: 8000 },
      { name: 'claude-3-5-haiku-20241022', label: 'Claude 3.5 Haiku', provider: 'Anthropic', maxTokenAllowed: 8000 },
      { name: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'Anthropic', maxTokenAllowed: 8000 },
      { name: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', provider: 'Anthropic', maxTokenAllowed: 8000 },
      { name: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', provider: 'Anthropic', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'OpenAI',
    staticModels: [
      { name: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'gpt-4', label: 'GPT-4', provider: 'OpenAI', maxTokenAllowed: 8000 },
      { name: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'Google',
    staticModels: [
      { name: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro', provider: 'Google', maxTokenAllowed: 8192 },
      { name: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash', provider: 'Google', maxTokenAllowed: 8192 },
      { name: 'gemini-pro', label: 'Gemini Pro', provider: 'Google', maxTokenAllowed: 8192 },
    ],
  },
  {
    name: 'Groq',
    staticModels: [
      { name: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B', provider: 'Groq', maxTokenAllowed: 8000 },
      { name: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', provider: 'Groq', maxTokenAllowed: 8000 },
      { name: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', provider: 'Groq', maxTokenAllowed: 8000 },
      { name: 'gemma2-9b-it', label: 'Gemma2 9B', provider: 'Groq', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'Mistral',
    staticModels: [
      { name: 'mistral-large-latest', label: 'Mistral Large', provider: 'Mistral', maxTokenAllowed: 8000 },
      { name: 'mistral-small-latest', label: 'Mistral Small', provider: 'Mistral', maxTokenAllowed: 8000 },
      { name: 'codestral-latest', label: 'Codestral', provider: 'Mistral', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'Deepseek',
    staticModels: [
      { name: 'deepseek-coder', label: 'Deepseek Coder', provider: 'Deepseek', maxTokenAllowed: 8000 },
      { name: 'deepseek-chat', label: 'Deepseek Chat', provider: 'Deepseek', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'xAI',
    staticModels: [
      { name: 'grok-beta', label: 'Grok Beta', provider: 'xAI', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'OpenRouter',
    staticModels: [
      { name: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (OR)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      { name: 'openai/gpt-4o', label: 'GPT-4o (OR)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
      { name: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B (OR)', provider: 'OpenRouter', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'HuggingFace',
    staticModels: [
      { name: 'Qwen/Qwen2.5-Coder-32B-Instruct', label: 'Qwen 2.5 Coder 32B', provider: 'HuggingFace', maxTokenAllowed: 8000 },
    ],
  },
  {
    name: 'Ollama',
    staticModels: [],
  },
];

export const DEFAULT_PROVIDER = PROVIDER_LIST[0];
export const DEFAULT_MODEL = PROVIDER_LIST[0].staticModels[0].name;

export const MODEL_LIST: ModelInfo[] = PROVIDER_LIST.flatMap((p) => p.staticModels);
