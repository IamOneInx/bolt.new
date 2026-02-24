import { map } from 'nanostores';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export const tokenUsageStore = map<TokenUsage>({
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
});

export function updateTokenUsage(usage: Partial<TokenUsage>) {
  const current = tokenUsageStore.get();
  tokenUsageStore.set({
    promptTokens: current.promptTokens + (usage.promptTokens ?? 0),
    completionTokens: current.completionTokens + (usage.completionTokens ?? 0),
    totalTokens: current.totalTokens + (usage.totalTokens ?? 0),
  });
}

export function resetTokenUsage() {
  tokenUsageStore.set({ promptTokens: 0, completionTokens: 0, totalTokens: 0 });
}
