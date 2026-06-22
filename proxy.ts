import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

// middleware.ts -> proxy.ts

export async function proxy(req: NextRequest) {
  return updateSession(req);
}
