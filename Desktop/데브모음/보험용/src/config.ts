import { config as loadEnv } from "dotenv";
import { z } from "zod";
import type { ProviderName } from "./providers.js";

loadEnv({ quiet: true });

const providerSchema = z.enum(["anthropic", "gemini"]);

const envSchema = z.object({
  LLM_PROVIDER: providerSchema.default("anthropic"),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().min(1).default("claude-sonnet-4-20250514"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().min(1).default("gemini-2.5-flash-native-audio-latest"),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
});

export type AppConfig = {
  provider: ProviderName;
  apiKey: string;
  model: string;
  telegram?: {
    token: string;
    chatId: string;
  } | undefined;
};

export function loadConfig(overrides?: Partial<Pick<AppConfig, "provider" | "model">>): AppConfig {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(message);
  }
  const provider = overrides?.provider ?? parsed.data.LLM_PROVIDER;

  const telegramConfig = parsed.data.TELEGRAM_BOT_TOKEN && parsed.data.TELEGRAM_CHAT_ID
    ? { token: parsed.data.TELEGRAM_BOT_TOKEN, chatId: parsed.data.TELEGRAM_CHAT_ID }
    : undefined;

  if (provider === "gemini") {
    const apiKey = parsed.data.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required when LLM_PROVIDER=gemini");
    }
    return {
      provider,
      apiKey,
      model: overrides?.model ?? parsed.data.GEMINI_MODEL,
      telegram: telegramConfig,
    };
  }

  const apiKey = parsed.data.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required when LLM_PROVIDER=anthropic");
  }

  return {
    provider,
    apiKey,
    model: overrides?.model ?? parsed.data.ANTHROPIC_MODEL,
    telegram: telegramConfig,
  };
}
