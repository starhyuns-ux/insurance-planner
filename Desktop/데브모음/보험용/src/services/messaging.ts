/**
 * Messaging Service Layer
 * 
 * This service handles integration with external messaging providers 
 * like Aligo (알리고) or Solapi (솔라피).
 */

export interface AlimtockPayload {
  recipient: string;
  templateCode: string;
  variables: Record<string, string>;
}

/**
 * Sends a Kakao Alimtock via Aligo API
 * 
 * Note: Real-world integration requires an API Key and Sender Key.
 */
export async function sendAlimtock(payload: AlimtockPayload): Promise<{ success: boolean; message: string }> {
  console.log("Simulating Alimtock sending to:", payload.recipient);
  console.log("Template:", payload.templateCode);
  console.log("Variables:", payload.variables);

  // Example integration structure:
  /*
  const API_KEY = "YOUR_ALIGO_API_KEY";
  const USER_ID = "YOUR_USER_ID";
  const SENDER_KEY = "YOUR_SENDER_KEY";
  
  const response = await fetch('https://kakaoapi.aligo.in/akv10/alimtalk/send/', {
    method: 'POST',
    body: new URLSearchParams({
      apikey: API_KEY,
      userid: USER_ID,
      senderkey: SENDER_KEY,
      tpl_code: payload.templateCode,
      sender: "YOUR_CERTIFIED_SENDER_NUMBER",
      receiver_1: payload.recipient,
      message_1: `[Genesis GA] 보장분석 링크: ${payload.variables.link}`,
      // Add other required parameters per Aligo docs
    })
  });
  return await response.json();
  */

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "메시지 발송 성공 (시물레이션)" });
    }, 1000);
  });
}

/**
 * Sends a Text Message (SMS/LMS) via Aligo API
 */
export async function sendSMS(recipient: string, content: string): Promise<{ success: boolean; message: string }> {
  console.log("Simulating SMS sending to:", recipient);
  console.log("Content:", content);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "SMS 발송 성공 (시뮬레이션)" });
    }, 800);
  });
}

/**
 * Sends a notification message to Telegram
 * 
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env
 */
export async function sendTelegramMessage(text: string): Promise<{ success: boolean; message: string }> {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram configuration missing. Message not sent:", text);
    return { success: false, message: "텔레그램 설정이 누락되었습니다." };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true, message: "텔레그램 발송 성공" };
    } else {
      console.error("Telegram API Error:", data);
      return { success: false, message: data.description || "발송 실패" };
    }
  } catch (error) {
    console.error("Telegram error:", error);
    return { success: false, message: "네트워크 오류 발생" };
  }
}
