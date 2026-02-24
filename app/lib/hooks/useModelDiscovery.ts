import { useState, useEffect } from 'react';
import { PROVIDER_LIST, type ModelInfo, type ProviderInfo } from '~/utils/constants';

async function getOllamaModels(): Promise<ModelInfo[]> {
  try {
    const baseUrl = import.meta.env.VITE_OLLAMA_API_BASE_URL || 'http://localhost:11434';
    const response = await fetch(`${baseUrl}/api/tags`);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { models: { name: string; details: { parameter_size: string } }[] };

    return data.models.map((model) => ({
      name: model.name,
      label: `${model.name} (${model.details?.parameter_size ?? 'local'})`,
      provider: 'Ollama',
      maxTokenAllowed: 8000,
    }));
  } catch {
    return [];
  }
}

async function getLMStudioModels(): Promise<ModelInfo[]> {
  try {
    const baseUrl = import.meta.env.VITE_LMSTUDIO_API_BASE_URL || 'http://localhost:1234';
    const response = await fetch(`${baseUrl}/v1/models`);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { data: { id: string }[] };

    return data.data.map((model) => ({
      name: model.id,
      label: model.id,
      provider: 'LMStudio',
      maxTokenAllowed: 8000,
    }));
  } catch {
    return [];
  }
}

async function getOpenAILikeModels(): Promise<ModelInfo[]> {
  try {
    const baseUrl = import.meta.env.VITE_OPENAI_LIKE_API_BASE_URL || '';

    if (!baseUrl) {
      return [];
    }

    const apiKey = import.meta.env.VITE_OPENAI_LIKE_API_KEY || '';
    const response = await fetch(`${baseUrl}/models`, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { data: { id: string }[] };

    return data.data.map((model) => ({
      name: model.id,
      label: model.id,
      provider: 'OpenAILike',
      maxTokenAllowed: 8000,
    }));
  } catch {
    return [];
  }
}

export interface DynamicProviderInfo extends ProviderInfo {
  isLoading?: boolean;
}

export function useModelDiscovery() {
  const [providers, setProviders] = useState<DynamicProviderInfo[]>(PROVIDER_LIST);
  const [discovering, setDiscovering] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function discover() {
      setDiscovering(true);

      const [ollamaModels, lmstudioModels, openAILikeModels] = await Promise.all([
        getOllamaModels(),
        getLMStudioModels(),
        getOpenAILikeModels(),
      ]);

      if (cancelled) {
        return;
      }

      setProviders(
        PROVIDER_LIST.map((provider) => {
          switch (provider.name) {
            case 'Ollama':
              return { ...provider, staticModels: ollamaModels };
            case 'LMStudio':
              return { ...provider, staticModels: lmstudioModels };
            case 'OpenAILike':
              return { ...provider, staticModels: openAILikeModels };
            default:
              return provider;
          }
        }),
      );

      setDiscovering(false);
    }

    discover();

    return () => {
      cancelled = true;
    };
  }, []);

  return { providers, discovering };
}
