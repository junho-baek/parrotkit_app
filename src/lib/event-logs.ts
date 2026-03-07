import { createSupabaseAdminClient } from '@/lib/supabase/server';

type EventPayload = Record<string, unknown>;

type InsertEventLogParams = {
  userId?: string | null;
  eventName: string;
  page?: string | null;
  payload?: EventPayload;
};

export async function insertEventLog({
  userId = null,
  eventName,
  page = null,
  payload = {},
}: InsertEventLogParams) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from('event_logs').insert({
    user_id: userId,
    event_name: eventName,
    page,
    payload,
  });

  if (error) {
    throw error;
  }
}
