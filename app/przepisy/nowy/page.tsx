"use client";

import { useState } from "react";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import RecipeDisplay, { Recipe } from "@/app/components/RecipeDisplay";

export default function RecipeCreator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch(`${API_URL}/api/recipes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Wystąpił problem podczas generowania przepisu.");
      }

      const data: Recipe = await response.json();
      setRecipe(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Nagłówek i formularz */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Co dzisiaj gotujemy?
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            Opisz, na co masz ochotę, a sztuczna inteligencja przygotuje dla Ciebie precyzyjny przepis wraz ze zdjęciem i wartościami odżywczymi.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="np. Wysokobiałkowe śniadanie bez jajek..."
              disabled={isLoading}
              className="w-full pl-6 pr-32 py-5 bg-white border border-zinc-200 rounded-full text-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-zinc-900 text-white font-semibold rounded-full hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Generuj <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Obsługa błędów */}
        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Stan ładowania (Szkielet) */}
        {isLoading && (
          <div className="max-w-4xl mx-auto mt-12 animate-pulse space-y-8">
            <div className="w-full h-80 bg-zinc-200 rounded-3xl" />
            <div className="w-2/3 h-10 bg-zinc-200 rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-zinc-200 rounded-2xl" />
              <div className="h-24 bg-zinc-200 rounded-2xl" />
              <div className="h-24 bg-zinc-200 rounded-2xl" />
            </div>
          </div>
        )}

        {/* Wynik */}
        {recipe && !isLoading && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <RecipeDisplay recipe={recipe} />
          </div>
        )}
      </div>
    </div>
  );
}