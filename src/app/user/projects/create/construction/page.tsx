import { redirect } from 'next/navigation';

export default function ConstructionProjectCreationPage() {
  // Redirect to unified wizard to avoid duplication
  redirect('/user/projects/create');
}
