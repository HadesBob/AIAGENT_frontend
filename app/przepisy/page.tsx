import Link from "next/link";
import { Clock, Flame, Utensils, ChevronRight } from "lucide-react";


interface RecipeListItem {
  recipe_id: string;
  slug: string;
  title: string;
  prep_time_minutes: number;
  image_url?: string | null;
  macros: {
    calories: number;
  };
  diet_types: string[];
}


const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getRecipes(): Promise<RecipeListItem[]> {
  const res = await fetch(`${API_URL}/api/recipes/`, {
    cache: "no-cache", // Zmień na 'force-cache' lub dodaj 'next: { revalidate: 3600 }' w produkcji
  });

  if (!res.ok) {
    throw new Error("Nie udało się pobrać listy przepisów.");
  }

  return res.json();
}

export default async function RecipesCatalogPage() {
  const recipes = await getRecipes();

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Nagłówek katalogu */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-2">
              Baza Przepisów
            </h1>
            <p className="text-lg text-zinc-500">
              Odkryj zdrowe posiłki wygenerowane przez sztuczną inteligencję.
            </p>
          </div>
          <Link
            href="/przepisy/nowy" // Załóżmy, że pod tym adresem trzymasz komponent RecipeCreator
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors"
          >
            Wygeneruj nowy
          </Link>
        </div>

        {/* Siatka z kartami przepisów */}
        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200">
            <Utensils className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 mb-2">Brak przepisów</h3>
            <p className="text-zinc-500">Wygeneruj swój pierwszy przepis, aby zobaczyć go tutaj.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Link 
                href={`/przepisy/${recipe.slug}`} 
                key={recipe.recipe_id}
                className="group flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300"
              >
                {/* Zdjęcie przepisu (Miniatura) */}
                <div className="w-full h-48 bg-zinc-100 relative overflow-hidden">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Utensils className="w-10 h-10 text-zinc-300" />
                    </div>
                  )}
                  
                  {/* Tagi nakładane na zdjęcie */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {recipe.diet_types.slice(0, 2).map((diet) => (
                      <span key={diet} className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-zinc-800 text-xs font-bold rounded-md shadow-sm">
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Treść karty */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-zinc-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between text-sm text-zinc-600">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-zinc-400" /> {recipe.prep_time_minutes} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500" /> {recipe.macros.calories} kcal
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}