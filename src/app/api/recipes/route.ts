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
      transcriptSnippet: item.transcriptSnippet == null ? null : String(item.transcriptSnippet),
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
        'id, user_id, reference_id, video_url, scenes, total_scenes, captured_scene_ids, match_results, captured_count, analysis_metadata, script_source, created_at, updated_at, reference:references(description, transcript, transcript_source, transcript_language, source_metadata)'
      )
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const recipes = (data || []).map((item) => {
      const { reference, ...recipe } = item;
      const referenceRecord = Array.isArray(reference) ? reference[0] : reference;
      return {
        ...recipe,
        title: referenceRecord?.description || null,
      };
    });

    return NextResponse.json({ recipes });
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
    const title = String(body.title || '').trim();

    const videoUrl = String(body.videoUrl || body.url || '').trim();
    const scenes = parseScenes(body.scenes);

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    if (!videoUrl) {
      return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 });
    }

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return NextResponse.json({ error: 'scenes are required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const referencePayload = {
      user_id: authUser.id,
      source_url: videoUrl,
      platform: body.platform || null,
      video_id: body.videoId || null,
      niche: body.niche || null,
      goal: body.goal || null,
      description: title,
      transcript: Array.isArray(body.transcript) ? body.transcript : [],
      transcript_source: body.transcriptSource || 'none',
      transcript_language: body.transcriptLanguage || null,
      source_metadata: body.sourceMetadata && typeof body.sourceMetadata === 'object' ? body.sourceMetadata : {},
    };

    let reference;
    {
      const { data, error } = await supabase
        .from('references')
        .insert(referencePayload)
        .select('id')
        .single();

      if (error) {
        const message = String(error.message || '');
        const needsLegacyRetry = message.includes('transcript') || message.includes('source_metadata');

        if (!needsLegacyRetry) {
          throw error;
        }

        const { data: legacyData, error: legacyError } = await supabase
          .from('references')
          .insert({
            user_id: authUser.id,
            source_url: videoUrl,
            platform: body.platform || null,
            video_id: body.videoId || null,
            niche: body.niche || null,
            goal: body.goal || null,
            description: title,
          })
          .select('id')
          .single();

        if (legacyError) {
          throw legacyError;
        }

        reference = legacyData;
      } else {
        reference = data;
      }
    }

    let recipe;
    {
      const { data, error } = await supabase
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
          analysis_metadata: body.analysisMetadata && typeof body.analysisMetadata === 'object' ? body.analysisMetadata : {},
          script_source: body.scriptSource || 'default',
        })
        .select('*')
        .single();

      if (error) {
        const message = String(error.message || '');
        const needsLegacyRetry = message.includes('analysis_metadata') || message.includes('script_source');

        if (!needsLegacyRetry) {
          throw error;
        }

        const { data: legacyData, error: legacyError } = await supabase
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

        if (legacyError) {
          throw legacyError;
        }

        recipe = legacyData;
      } else {
        recipe = data;
      }
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
