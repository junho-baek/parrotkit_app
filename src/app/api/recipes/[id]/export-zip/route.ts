import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id: recipeId } = await params;
    const supabase = createSupabaseAdminClient();

    const { data: captures, error: capturesError } = await supabase
      .from('recipe_captures')
      .select('scene_id, storage_path, mime_type')
      .eq('recipe_id', recipeId)
      .eq('user_id', authUser.id)
      .order('scene_id', { ascending: true });

    if (capturesError) {
      throw capturesError;
    }

    if (!captures || captures.length === 0) {
      return NextResponse.json({ error: 'No captures to export' }, { status: 400 });
    }

    const zip = new JSZip();

    for (const capture of captures) {
      const { data: fileData, error: fileError } = await supabase.storage
        .from('scene-captures')
        .download(capture.storage_path);

      if (fileError || !fileData) {
        continue;
      }

      const extension = capture.mime_type === 'video/mp4' ? 'mp4' : 'webm';
      zip.file(`scene-${capture.scene_id}.${extension}`, await fileData.arrayBuffer());
    }

    const content = await zip.generateAsync({ type: 'nodebuffer' });
    const body = new Uint8Array(content);

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=\"recipe-${recipeId}.zip\"`,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Zip export error:', error);
    return NextResponse.json({ error: 'Failed to export captures' }, { status: 500 });
  }
}
