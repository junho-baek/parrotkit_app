import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id } = await params;
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .eq('user_id', authUser.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    return NextResponse.json({ recipe: data });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get recipe error:', error);
    return NextResponse.json({ error: 'Failed to load recipe' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id } = await params;
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', authUser.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Delete recipe error:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id } = await params;
    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const nextScenes = Array.isArray(body.scenes) ? body.scenes : null;

    if (!title && !nextScenes) {
      return NextResponse.json({ error: 'title or scenes is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('id, reference_id, video_url')
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

    if (nextScenes) {
      const { error: updateScenesError } = await supabase
        .from('recipes')
        .update({ scenes: nextScenes })
        .eq('id', recipe.id)
        .eq('user_id', authUser.id);

      if (updateScenesError) {
        throw updateScenesError;
      }
    }

    if (title && recipe.reference_id) {
      const { error: updateReferenceError } = await supabase
        .from('references')
        .update({ description: title })
        .eq('id', recipe.reference_id)
        .eq('user_id', authUser.id);

      if (updateReferenceError) {
        throw updateReferenceError;
      }
    } else if (title && !recipe.reference_id) {
      let createdReference;
      {
        const { data, error } = await supabase
          .from('references')
          .insert({
            user_id: authUser.id,
            source_url: recipe.video_url,
            description: title,
            transcript: [],
            transcript_source: 'none',
            source_metadata: {},
          })
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
              source_url: recipe.video_url,
              description: title,
            })
            .select('id')
            .single();

          if (legacyError) {
            throw legacyError;
          }

          createdReference = legacyData;
        } else {
          createdReference = data;
        }
      }

      const { error: updateRecipeError } = await supabase
        .from('recipes')
        .update({ reference_id: createdReference.id })
        .eq('id', recipe.id)
        .eq('user_id', authUser.id);

      if (updateRecipeError) {
        throw updateRecipeError;
      }
    }

    return NextResponse.json({ success: true, title: title || null, scenesUpdated: Boolean(nextScenes) });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Patch recipe error:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}
