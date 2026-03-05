import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

function parseScenes(raw: unknown) {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.map((scene, index) => {
    const item = typeof scene === 'object' && scene !== null
      ? (scene as Record<string, unknown>)
      : {};

    return {
      id: Number(item.id ?? index + 1),
      title: String(item.title ?? `Scene ${index + 1}`),
      startTime: String(item.startTime ?? '00:00'),
      endTime: String(item.endTime ?? '00:05'),
      thumbnail: String(item.thumbnail ?? ''),
      description: String(item.description ?? ''),
      script: Array.isArray(item.script) ? item.script.map((s) => String(s)) : [],
      progress: Number(item.progress ?? 0),
    };
  });
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('recipes')
      .select(
        'id, user_id, reference_id, video_url, scenes, total_scenes, captured_scene_ids, match_results, captured_count, created_at, updated_at'
      )
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ recipes: data || [] });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('List recipes error:', error);
    return NextResponse.json({ error: 'Failed to load recipes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const body = await request.json();

    const videoUrl = String(body.videoUrl || body.url || '').trim();
    const scenes = parseScenes(body.scenes);

    if (!videoUrl) {
      return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 });
    }

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json({ error: 'scenes are required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const { data: reference, error: referenceError } = await supabase
      .from('references')
      .insert({
        user_id: authUser.id,
        source_url: videoUrl,
        platform: body.platform || null,
        video_id: body.videoId || null,
        niche: body.niche || null,
        goal: body.goal || null,
        description: body.description || null,
      })
      .select('id')
      .single();

    if (referenceError) {
      throw referenceError;
    }

    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        user_id: authUser.id,
        reference_id: reference.id,
        video_url: videoUrl,
        scenes,
        total_scenes: scenes.length,
        captured_scene_ids: [],
        match_results: {},
        captured_count: 0,
      })
      .select('*')
      .single();

    if (recipeError) {
      throw recipeError;
    }

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Create recipe error:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
