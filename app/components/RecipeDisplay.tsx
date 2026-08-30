import { Clock, Flame, Utensils, CheckCircle2, Leaf } from "lucide-react";

export interface Recipe {
  recipe_id: string;
  title: string;
  meal_types: string[];
  diet_types: string[];
  prep_time_minutes: number;
  image_url?: string | null;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: { name: string; amount: number; unit: string }[];
  instructions: string[];
}

export default function RecipeDisplay({ recipe }: { recipe: Recipe }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
      {/* Sekcja zdjęcia */}
      {recipe.image_url ? (
        <div className="w-full h-64 sm:h-80 relative bg-zinc-100">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-zinc-50 flex items-center justify-center border-b border-zinc-100">
          <Utensils className="w-12 h-12 text-zinc-300" />
        </div>
      )}

      <div className="p-6 md:p-10">
        {/* Nagłówek i Tagi */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
            {recipe.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-semibold">
              <Clock className="w-4 h-4" /> {recipe.prep_time_minutes} min
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-sm font-semibold">
              <Flame className="w-4 h-4" /> {recipe.macros.calories} kcal
            </span>
            {recipe.diet_types.map((diet) => (
              <span key={diet} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                <Leaf className="w-4 h-4" /> {diet}
              </span>
            ))}
          </div>
        </div>

        {/* Makroskładniki */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-50 rounded-2xl p-4 text-center border border-zinc-100">
            <p className="text-zinc-500 text-sm font-medium mb-1">Białko</p>
            <p className="text-xl font-bold text-zinc-900">{recipe.macros.protein}g</p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-4 text-center border border-zinc-100">
            <p className="text-zinc-500 text-sm font-medium mb-1">Węglowodany</p>
            <p className="text-xl font-bold text-zinc-900">{recipe.macros.carbs}g</p>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-4 text-center border border-zinc-100">
            <p className="text-zinc-500 text-sm font-medium mb-1">Tłuszcze</p>
            <p className="text-xl font-bold text-zinc-900">{recipe.macros.fat}g</p>
          </div>
        </div>

        {/* Główna zawartość: Składniki i Instrukcje */}
        <div className="grid md:grid-cols-12 gap-10">
          {/* Lewa kolumna: Składniki */}
          <div className="md:col-span-5">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              Składniki
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex justify-between items-center py-3 border-b border-zinc-100 last:border-0">
                  <span className="text-zinc-700 font-medium">{ing.name}</span>
                  <span className="text-zinc-900 font-bold bg-zinc-100 px-3 py-1 rounded-lg text-sm">
                    {ing.amount} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prawa kolumna: Przygotowanie */}
          <div className="md:col-span-7">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-500" />
              Sposób przygotowania
            </h3>
            <div className="space-y-6">
              {recipe.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm transition-colors group-hover:bg-orange-500 group-hover:text-white">
                    {idx + 1}
                  </span>
                  <p className="text-zinc-700 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}