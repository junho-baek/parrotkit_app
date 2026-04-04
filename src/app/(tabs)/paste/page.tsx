import { redirect } from 'next/navigation';
import { PASTE_DRAWER_HOME_HREF } from '@/lib/paste-drawer';

export default function PastePage() {
  redirect(PASTE_DRAWER_HOME_HREF);
}
