import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ id: string }>;
}

function getFileExtension(file: File) {
  if (file.name.includes('.')) {
    return file.name.split('.').pop() || 'webm';
  }

  if (file.type === 'video/mp4') {
    return 'mp4';
  }

  return 'webm';
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id: recipeId } = await params;

    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const sceneId = Number(formData.get('sceneId'));

    if (!file) {
      return NextResponse.json({ error: 'video file is required' }, { status: 400 });
    }

    if (!Number.isFinite(sceneId)) {
      return NextResponse.json({ error: 'sceneId is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id, captured_scene_ids')
      .eq('id', recipeId)
      .eq('user_id', authUser.id)
      .limit(1)
      .maybeSingle();

    if (recipeError) {
      throw recipeError;
    }

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const ext = getFileExtension(file);
    const objectPath = `${authUser.id}/${recipeId}/scene-${sceneId}-${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scene-captures')
      .upload(objectPath, file, {
        contentType: file.type || 'video/webm',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { error: captureError } = await supabase
      .from('recipe_captures')
      .upsert(
        {
          recipe_id: recipeId,
          user_id: authUser.id,
          scene_id: sceneId,
          storage_path: uploadData.path,
          mime_type: file.type || null,
          size_bytes: file.size,
        },
        { onConflict: 'recipe_id,scene_id' }
      );

    if (captureError) {
      throw captureError;
    }

    const capturedSceneIds = Array.isArray(recipe.captured_scene_ids)
      ? [...recipe.captured_scene_ids]
      : [];

    if (!capturedSceneIds.includes(sceneId)) {
      capturedSceneIds.push(sceneId);
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        captured_scene_ids: capturedSceneIds,
        captured_count: capturedSceneIds.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', recipeId)
      .eq('user_id', authUser.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      sceneId,
      storagePath: uploadData.path,
      capturedSceneIds,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Capture upload error:', error);
    return NextResponse.json({ error: 'Failed to upload capture' }, { status: 500 });
  }
}
