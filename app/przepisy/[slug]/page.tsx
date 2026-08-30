import { notFound } from "next/navigation";
import RecipeDisplay from "../../components/RecipeDisplay";

// 1. Zmieniamy interfejs, aby oczekiwał parametru 'slug' z nazwy folderu
interface PageProps {
  params: Promise<{ slug: string }>;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL
async function getRecipeBySlug(slug: string) {
  // 2. Przekazujemy slug bezpośrednio do Twojego zaktualizowanego endpointu
  const res = await fetch(`${API_URL}/api/recipes/${slug}`, {
    cache: "no-store", // Wyłączone dla celów deweloperskich
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Błąd podczas pobierania przepisu");
  }

  return res.json();
}

export default async function SingleRecipePage({ params }: PageProps) {
  // 3. Rozpakowujemy Promise z parametrami (wymóg Next.js 15)
  const resolvedParams = await params;
  const recipe = await getRecipeBySlug(resolvedParams.slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <RecipeDisplay recipe={recipe} />
    </main>
  );
}