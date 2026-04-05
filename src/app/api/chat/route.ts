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
  script?: string[];
}

interface TargetScene {
  id: number;
  title: string;
  description: string;
  script: string[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      mode = 'global',
      messages,
      allScenes = [],
      targetScene = null,
    } = (await request.json()) as {
      mode?: 'global' | 'scene';
      messages: ChatMessage[];
      allScenes?: Scene[];
      targetScene?: TargetScene | null;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    console.log('[Chat API] mode:', mode, '| scenes count:', allScenes.length, '| targetScene:', targetScene?.id ?? 'none');

    const scenesContext = allScenes.length > 0
      ? allScenes
          .map((scene) =>
            [
              `Scene #${scene.id} "${scene.title}" (${scene.startTime}~${scene.endTime})`,
              `description: ${scene.description}`,
              Array.isArray(scene.script) && scene.script.length > 0
                ? `current script: ${scene.script.map((line, index) => `${index + 1}. ${line}`).join(' | ')}`
                : 'current script: (none)',
            ].join('\n')
          )
          .join('\n\n')
      : 'No scenes available.';

    const targetSceneIndex = targetScene
      ? allScenes.findIndex((scene) => scene.id === targetScene.id)
      : -1;
    const previousScene = targetSceneIndex > 0 ? allScenes[targetSceneIndex - 1] : null;
    const nextScene = targetSceneIndex >= 0 && targetSceneIndex < allScenes.length - 1
      ? allScenes[targetSceneIndex + 1]
      : null;

    const targetSceneContext = targetScene
      ? `\n\nThe user is currently focused on Scene #${targetScene.id} "${targetScene.title}".
Target scene script on screen:
${targetScene.script.map((line, i) => `  ${i + 1}. ${line}`).join('\n')}

Previous scene context:
${previousScene ? `Scene #${previousScene.id} "${previousScene.title}" script: ${(previousScene.script || []).join(' | ') || '(none)'}` : 'None'}

Next scene context:
${nextScene ? `Scene #${nextScene.id} "${nextScene.title}" script: ${(nextScene.script || []).join(' | ') || '(none)'}` : 'None'}`
      : '';

    const modeInstruction = mode === 'scene'
      ? `You are in SCENE mode.
- Focus on only the target scene unless the user explicitly asks for a broader change.
- Use the full recipe as background context.
- Preserve continuity with the previous and next scenes.
- If the user says "rewrite this" or "change this script", they mean the target scene only.
- When rewriting, return the FULL revised target-scene script as a numbered list.`
      : `You are in GLOBAL mode.
- Help with the overall recipe flow, hooks, transitions, and multi-scene direction.
- You may discuss multiple scenes together.
- If the user asks for a full recipe rewrite, you may suggest scene-by-scene changes, but stay concise.`;

    const systemPrompt = `You are a Script Assistant for ParrotKit, a tool that helps UGC/short-form video creators replicate viral video recipes.

You help users write and refine scripts for their video scenes. You have context about the current video recipe scenes:

${scenesContext}${targetSceneContext}

Your capabilities:
- Generate scripts for individual scenes or the entire video
- Suggest hooks, transitions, and call-to-actions
- Rewrite scripts in different tones (funny, serious, educational, etc.)
- Provide voiceover prompts and narration text
- Suggest camera directions and movements
- Modify existing scripts based on user feedback

${modeInstruction}

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
