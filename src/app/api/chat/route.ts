import { NextRequest, NextResponse } from 'next/server';
import { generateReplicateGeminiFlashText } from '@/lib/replicate';
import type { PrompterBlock, RecipeScene } from '@/types/recipe';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type SceneUpdate = {
  appealPoint?: string;
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
    `recipe.cutGoal: ${scene.recipe.appealPoint || '(none)'}`,
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

function buildSceneUpdateSummary(sceneUpdate: SceneUpdate | null) {
  if (!sceneUpdate) {
    return '장면 업데이트 초안을 준비했습니다.';
  }

  const changes: string[] = [];

  if (sceneUpdate.appealPoint) {
    changes.push('cut goal을 더 분명하게 정리했습니다.');
  }

  if (sceneUpdate.keyLine) {
    changes.push('메인 한 줄 대사를 다듬었습니다.');
  }

  if (sceneUpdate.scriptLines?.length) {
    changes.push(`스크립트 ${sceneUpdate.scriptLines.length}줄을 장면 톤에 맞게 업데이트했습니다.`);
  }

  if (sceneUpdate.keyAction) {
    changes.push('촬영 행동 포인트를 다시 잡았습니다.');
  }

  if (sceneUpdate.keyMood) {
    changes.push('퍼포먼스 무드를 조정했습니다.');
  }

  if (sceneUpdate.mustInclude || sceneUpdate.mustAvoid) {
    changes.push('필수/주의 포인트도 함께 반영했습니다.');
  }

  if (sceneUpdate.prompterBlocks?.length) {
    changes.push('프롬프터에 띄울 cue도 같이 손봤습니다.');
  }

  return changes.length > 0 ? changes.join(' ') : '장면 업데이트 초안을 준비했습니다.';
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
- Treat appealPoint as the cut goal. It must explain the scene's role, not repeat spoken dialogue.
- You may change cut goal, key line, script lines, mood, action, must-include/must-avoid, and prompter blocks.
- assistant_message should be 2 to 4 short Korean sentences when the user writes in Korean, and must explicitly say what changed.
- Return valid JSON only, no markdown fences.

Use this exact schema:
{
  "assistant_message": "",
  "scene_update": {
    "appealPoint": "",
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
        "label": "Main Script",
        "content": "",
        "visible": true,
        "size": "xl",
        "scale": 1,
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
        message: parsed?.message || buildSceneUpdateSummary(parsed?.sceneUpdate || null),
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
