import { NextRequest, NextResponse } from 'next/server';
import { generateReplicateGeminiFlashText } from '@/lib/replicate';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Scene {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface CurrentScene {
  id: number;
  title: string;
  description: string;
  script: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { messages, scenes, currentScene } = (await request.json()) as {
      messages: ChatMessage[];
      scenes?: Scene[];
      currentScene?: CurrentScene | null;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    console.log('[Chat API] scenes count:', scenes?.length ?? 'none', '| currentScene:', currentScene?.id ?? 'none');

    const scenesContext = scenes && scenes.length > 0
      ? scenes
          .map(
            (s) =>
              `Scene #${s.id} "${s.title}" (${s.startTime}~${s.endTime}): ${s.description}`
          )
          .join('\n')
      : 'No scenes available.';

    const currentSceneContext = currentScene
      ? `\n\nThe user is currently viewing/editing Scene #${currentScene.id} "${currentScene.title}".
Current script displayed on screen:
${currentScene.script.map((line, i) => `  ${i + 1}. ${line}`).join('\n')}

When the user asks to modify "the script" or "this script", they are referring to THIS script above. Provide the full revised script when modifying.`
      : '';

    const systemPrompt = `You are a Script Assistant for ParrotKit, a tool that helps UCC/short-form video creators replicate viral video recipes.

You help users write and refine scripts for their video scenes. You have context about the current video recipe scenes:

${scenesContext}${currentSceneContext}

Your capabilities:
- Generate scripts for individual scenes or the entire video
- Suggest hooks, transitions, and call-to-actions
- Rewrite scripts in different tones (funny, serious, educational, etc.)
- Provide voiceover prompts and narration text
- Suggest camera directions and movements
- Modify existing scripts based on user feedback

When the user asks to change or modify the script, always output the FULL revised script as a numbered list (1. xxx, 2. xxx, etc.) so they can directly apply it. The user has an "Apply to Script" button that will parse these numbered lines and update the on-screen script.
Keep responses concise and actionable. Use Korean if the user writes in Korean, English if they write in English.`;

    const conversationTranscript = messages
      .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}:\n${message.content}`)
      .join('\n\n');

    const assistantMessage = await generateReplicateGeminiFlashText({
      systemInstruction: systemPrompt,
      prompt: `Conversation so far:

${conversationTranscript}

Respond as the assistant to the latest user message only.`,
      maxOutputTokens: 2048,
      temperature: 0.9,
      topP: 0.95,
      thinkingBudget: 0,
    });

    return NextResponse.json({
      message: assistantMessage,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to get response';
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
