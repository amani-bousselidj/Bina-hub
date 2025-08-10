import { redirect } from 'next/navigation';

export default function LegacyProjectCreatePage() {
  // Redirect legacy domain component route to unified App Router page
  redirect('/user/projects/create');
}
