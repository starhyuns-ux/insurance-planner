import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam, ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";

import { toolDefinitions, toolHandlers } from "./tools.js";

export type AgentTurnResult = {
  text: string;
};

export type ProviderName = "anthropic" | "gemini";

const SYSTEM_PROMPT = `
You are the Insurance Platform (STROY) Expert Agent.
You have full permission to use tools for reading/writing files and executing shell commands in the workspace.
Your mission is to support the development and maintenance of the STROY platform, focusing on insurance analysis, landing pages, and administrative tools.
Work step-by-step:
1. Understand the goal.
2. Inspect the codebase/environment using list_files and read_file.
3. Formulate a plan.
4. Execute changes using write_file or run_shell.
5. Verify your work.

IMPORTANT: The current environment is a Mac/Unix system. Use compatible shell commands (e.g., ls, cat, zsh) unless you detect otherwise.
Assume the workspace root is your boundary.
`.trim();

export interface LlmProvider {
  runTurn(prompt: string): Promise<AgentTurnResult>;
  clear(): void;
}

export class AnthropicProvider implements LlmProvider {
  private readonly client: Anthropic;
  private readonly model: string;
  private readonly cwd: string;
  private readonly messages: MessageParam[] = [];

  constructor(args: { apiKey: string; model: string; cwd: string }) {
    this.client = new Anthropic({ apiKey: args.apiKey });
    this.model = args.model;
    this.cwd = args.cwd;
  }

  clear(): void {
    this.messages.length = 0;
  }

  async runTurn(prompt: string): Promise<AgentTurnResult> {
    this.messages.push({
      role: "user",
      content: prompt,
    });

    let assistantText = "";

    for (let i = 0; i < 8; i += 1) {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: this.messages,
        tools: toolDefinitions,
      });

      this.messages.push({
        role: "assistant",
        content: response.content,
      });

      const textBlocks = response.content.filter((block) => block.type === "text");
      if (textBlocks.length > 0) {
        assistantText = textBlocks.map((block) => block.text).join("\n");
      }

      const toolUses = response.content.filter((block) => block.type === "tool_use");
      if (toolUses.length === 0) {
        return { text: assistantText };
      }

      const toolResults: ToolResultBlockParam[] = [];
      for (const toolUse of toolUses) {
        const handler = toolHandlers[toolUse.name];
        if (!handler) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            is_error: true,
            content: `Unknown tool: ${toolUse.name}`,
          });
          continue;
        }

        try {
          const result = await handler(toolUse.input as Record<string, unknown>, this.cwd);
          const toolResult: ToolResultBlockParam = {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: result.content,
          };
          if (result.isError !== undefined) {
            toolResult.is_error = result.isError;
          }
          toolResults.push(toolResult);
        } catch (error) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            is_error: true,
            content: error instanceof Error ? error.message : String(error),
          });
        }
      }

      this.messages.push({
        role: "user",
        content: toolResults,
      });
    }

    return {
      text: assistantText || "Stopped after reaching the tool iteration limit.",
    };
  }
}

export class GeminiProvider implements LlmProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly cwd: string;
  private readonly contents: any[] = [];

  constructor(args: { apiKey: string; model: string; cwd: string }) {
    this.apiKey = args.apiKey;
    this.model = args.model;
    this.cwd = args.cwd;
  }

  clear(): void {
    this.contents.length = 0;
  }

  async runTurn(prompt: string): Promise<AgentTurnResult> {
    this.contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    let assistantText = "";

    for (let i = 0; i < 8; i += 1) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const payload = {
        contents: this.contents,
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        tools: [
          {
            function_declarations: toolDefinitions.map((tool) => ({
              name: tool.name,
              description: tool.description,
              parameters: tool.input_schema,
            })),
          },
        ],
        tool_config: {
          function_calling_config: {
            mode: "AUTO",
          },
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
      }

      const data: any = await response.json();
      const candidate = data.candidates?.[0];
      const parts = candidate?.content?.parts ?? [];
      
      this.contents.push({
        role: "model",
        parts,
      });

      const textParts = parts
        .filter((part: any) => part.text)
        .map((part: any) => part.text);
      if (textParts.length > 0) {
        assistantText = textParts.join("\n");
      }

      const functionCalls = parts.filter((part: any) => part.functionCall);
      if (functionCalls.length === 0) {
        return { text: assistantText || data.text || "" };
      }

      const functionResponses: any[] = [];
      for (const part of functionCalls) {
        const call = part.functionCall;
        const name = call.name;
        const handler = toolHandlers[name];

        if (!handler) {
          functionResponses.push({
            functionResponse: {
              name,
              response: { error: `Unknown tool: ${name}` },
            },
          });
          continue;
        }

        try {
          const result = await handler(call.args ?? {}, this.cwd);
          functionResponses.push({
            functionResponse: {
              name,
              response: { content: result.content, isError: result.isError ?? false },
            },
          });
        } catch (error) {
          functionResponses.push({
            functionResponse: {
              name,
              response: { error: error instanceof Error ? error.message : String(error) },
            },
          });
        }
      }

      this.contents.push({
        role: "user",
        parts: functionResponses,
      });
    }

    return {
      text: assistantText || "Stopped after reaching the tool iteration limit.",
    };
  }
}
