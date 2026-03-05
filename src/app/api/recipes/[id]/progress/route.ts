import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await request.json();

    const sceneId = Number(body.sceneId);
    const captured = Boolean(body.captured);
    const isMatch = typeof body.isMatch === 'boolean' ? body.isMatch : undefined;

    if (!Number.isFinite(sceneId)) {
      return NextResponse.json({ error: 'sceneId is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('captured_scene_ids, match_results')
      .eq('id', id)
      .eq('user_id', authUser.id)
      .limit(1)
      .maybeSingle();

    if (recipeError) {
      throw recipeError;
    }

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const capturedSceneIds = Array.isArray(recipe.captured_scene_ids)
      ? [...recipe.captured_scene_ids]
      : [];

    if (captured && !capturedSceneIds.includes(sceneId)) {
      capturedSceneIds.push(sceneId);
    }

    const matchResults = (recipe.match_results && typeof recipe.match_results === 'object'
      ? { ...recipe.match_results }
      : {}) as Record<string, boolean>;

    if (typeof isMatch === 'boolean') {
      matchResults[String(sceneId)] = isMatch;
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        captured_scene_ids: capturedSceneIds,
        captured_count: capturedSceneIds.length,
        match_results: matchResults,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', authUser.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      capturedSceneIds,
      matchResults,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Failed to update recipe progress' }, { status: 500 });
  }
}
