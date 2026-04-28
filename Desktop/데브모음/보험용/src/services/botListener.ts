import { CodingAgent } from "../agent.js";
import { sendTelegramMessage } from "./messaging.js";

/**
 * Interface for Telegram Updates
 */
interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: { id: number };
    text?: string;
    from?: { first_name: string };
  };
}

let isPolling = false;
let offset = 0;

/**
 * Starts a background loop to poll for Telegram messages (Long Polling)
 */
export async function startBotListener(agent: CodingAgent) {
  if (isPolling) return;
  isPolling = true;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram bot listener skipped: Missing credentials in .env");
    return;
  }

  console.log("🤖 Telegram bot listener starting...");

  try {
    const testResult = await sendTelegramMessage("🚀 *보험 상담 시스템 봇이 시작되었습니다!* 상담 요청을 실시간으로 전달해 드릴게요.");
    if (testResult.success) {
      console.log("✅ Telegram connection verified: Message sent successfully.");
    } else {
      console.error("❌ Telegram connection failed:", testResult.message);
      console.warn("💡 .env 파일의 토큰과 챗 아이디가 정확한지 다시 한번 확인해 주세요.");
    }
  } catch (error) {
    console.error("❌ Fatal error connecting to Telegram:", error);
  }

  while (isPolling) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}&timeout=30`
      );
      const data = await response.json();

      if (data.ok && data.result.length > 0) {
        for (const update of data.result as TelegramUpdate[]) {
          offset = update.update_id + 1;

          if (update.message) {
            const incomingChatId = String(update.message.chat.id);
            const incomingText = update.message.text || "";
            
            console.log(`📩 텔레그램 메시지 수신: [${incomingChatId}] ${incomingText}`);

            if (incomingChatId === String(chatId)) {
              await handleCommand(incomingText, agent);
            } else {
              console.warn(`⚠️ 승인되지 않은 사용자(${incomingChatId})의 메시지를 무시했습니다. .env의 TELEGRAM_CHAT_ID를 확인하세요.`);
              // Optional: 다른 사람이 보낸 경우 안내 메시지 (보안상 주의)
            }
          }
        }
      }
    } catch (error) {
      console.error("Bot listener error:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait before retry
    }
  }
}

/**
 * Stops the bot listener
 */
export function stopBotListener() {
  isPolling = false;
}

/**
 * Processes incoming commands
 */
async function handleCommand(text: string, agent: CodingAgent) {
  const trimmed = text.trim();
  
  if (trimmed.startsWith("/start") || trimmed.startsWith("/help")) {
    const helpText = `
👋 *Stroy AI Assistant*에 오신 것을 환영합니다!

사용 가능한 명령어:
/stats - 현재 보장분석 요약 (준비 중)
/ask [질문] - AI에게 보험 관련 궁금한 점 질문하기
/help - 도움말 보기
    `.trim();
    await sendTelegramMessage(helpText);
    return;
  }

  if (trimmed.startsWith("/stats")) {
    // Note: Stats are currently in browser localStorage, so we show a placeholder
    const statsText = "📊 *현재 상태 요약*\n\n실시간 데이터 공유 기능 준비 중입니다. 웹 대시보드를 확인해 주세요!";
    await sendTelegramMessage(statsText);
    return;
  }

  if (trimmed.startsWith("/ask")) {
    const question = trimmed.replace("/ask", "").trim();
    if (!question) {
      await sendTelegramMessage("❓ 질문을 함께 입력해 주세요. (예: /ask 실손보험이 뭐야?)");
      return;
    }
    await processAgentTurn(question, agent);
    return;
  }

  // Remote Agent Mode: Process any non-command message as a system instruction
  if (!trimmed.startsWith("/") && trimmed.length > 0) {
    await processAgentTurn(trimmed, agent);
    return;
  }
}

/**
 * Executes a turn with the agent and notifies the user of tool usage/results
 */
async function processAgentTurn(prompt: string, agent: CodingAgent) {
  await sendTelegramMessage("⚙️ *작업 분석 중...*");
  
  try {
    const result = await agent.runTurn(prompt);
    await sendTelegramMessage(`✅ *작업 완료*:\n\n${result.text}`);
  } catch (error: any) {
    console.error("Agent error:", error);
    const errorMessage = error?.message || String(error);
    await sendTelegramMessage(`❌ *작업 실행 중 오류 발생*:\n\n\`${errorMessage}\``);
  }
}
