import { NextRequest, NextResponse } from 'next/server';
import { generateReplicateGeminiFlashText } from '@/lib/replicate';
import type { PrompterBlock, RecipeScene } from '@/types/recipe';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type SceneUpdate = {
  keyLine?: string;
  scriptLines?: string[];
  keyMood?: string;
  keyAction?: string;
  mustInclude?: string[];
  mustAvoid?: string[];
  prompterBlocks?: Array<Partial<PrompterBlock> & { id?: string; type?: string }>;
};

function extractJsonObject(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch?.[0] || null;
}

async function parseSceneUpdate(text: string) {
  const json = extractJsonObject(text);
  if (!json) {
    return null;
  }

  try {
    const parsed = JSON.parse(json) as {
      assistant_message?: string;
      scene_update?: SceneUpdate | null;
    };

    return {
      message: String(parsed.assistant_message || '').trim(),
      sceneUpdate: parsed.scene_update || null,
    };
  } catch {
    return null;
  }
}

function summarizeScene(scene: RecipeScene) {
  return [
    `Scene #${scene.id} "${scene.title}" (${scene.startTime}~${scene.endTime})`,
    `analysis.motion: ${scene.analysis.motionDescription || '(none)'}`,
    `analysis.transcript: ${scene.analysis.transcriptSnippet || '(none)'}`,
    `recipe.appealPoint: ${scene.recipe.appealPoint || '(none)'}`,
    `recipe.keyLine: ${scene.recipe.keyLine || '(none)'}`,
    `recipe.scriptLines: ${scene.recipe.scriptLines.join(' | ') || '(none)'}`,
    `recipe.keyMood: ${scene.recipe.keyMood || '(none)'}`,
    `recipe.keyAction: ${scene.recipe.keyAction || '(none)'}`,
    `recipe.mustInclude: ${scene.recipe.mustInclude.join(' | ') || '(none)'}`,
    `recipe.mustAvoid: ${scene.recipe.mustAvoid.join(' | ') || '(none)'}`,
    `prompter.blocks: ${
      scene.prompter.blocks.map((block) => `${block.id}:${block.type}:${block.visible ? 'visible' : 'hidden'}:${block.content}`).join(' | ') || '(none)'
    }`,
  ].join('\n');
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
      allScenes?: RecipeScene[];
      targetScene?: RecipeScene | null;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const scenesContext = allScenes.length > 0
      ? allScenes.map((scene) => summarizeScene(scene)).join('\n\n')
      : 'No scenes available.';

    const targetSceneContext = targetScene
      ? `Current target scene:\n${summarizeScene(targetScene)}`
      : 'No target scene selected.';

    const conversationTranscript = messages
      .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}:\n${message.content}`)
      .join('\n\n');

    if (mode === 'scene' && targetScene) {
      const response = await generateReplicateGeminiFlashText({
        systemInstruction: `You are ParrotKit's Scene Planner Assistant.

You help creators refine one scene at a time.
- Focus on the target scene only.
- Keep edits aligned with the rest of the recipe.
- You may change key line, script lines, mood, action, must-include/must-avoid, and prompter blocks.
- Return valid JSON only, no markdown fences.

Use this exact schema:
{
  "assistant_message": "",
  "scene_update": {
    "keyLine": "",
    "scriptLines": ["", ""],
    "keyMood": "",
    "keyAction": "",
    "mustInclude": [""],
    "mustAvoid": [""],
    "prompterBlocks": [
      {
        "id": "key-line",
        "type": "key_line",
        "content": "",
        "visible": true,
        "size": "xl",
        "positionPreset": "lowerThird",
        "order": 1
      }
    ]
  }
}`,
        prompt: `All scenes:\n${scenesContext}\n\n${targetSceneContext}\n\nConversation so far:\n\n${conversationTranscript}\n\nRespond to the latest user message only.`,
        maxOutputTokens: 2048,
        temperature: 0.6,
        topP: 0.95,
        thinkingBudget: 0,
      });

      const parsed = await parseSceneUpdate(response);

      return NextResponse.json({
        message: parsed?.message || 'I prepared a scene update you can apply.',
        sceneUpdate: parsed?.sceneUpdate || null,
      });
    }

    const assistantMessage = await generateReplicateGeminiFlashText({
      systemInstruction: `You are ParrotKit's Recipe Assistant for UGC creators.

You help with overall flow, hooks, transitions, and recipe structure.
Use Korean if the user writes in Korean, English if the user writes in English.
Stay concise and actionable.`,
      prompt: `All scenes:\n${scenesContext}\n\nConversation so far:\n\n${conversationTranscript}\n\nRespond as the assistant to the latest user message only.`,
      maxOutputTokens: 2048,
      temperature: 0.8,
      topP: 0.95,
      thinkingBudget: 0,
    });

    return NextResponse.json({
      message: assistantMessage,
      sceneUpdate: null,
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
