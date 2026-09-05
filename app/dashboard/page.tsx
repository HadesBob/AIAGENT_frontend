"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Import hooka auth (dostosuj ścieżkę do swojej struktury, np. lib/authContext lub context/AuthContext)
import { useAuth } from "@/lib/AuthContext"; 
import { 
  Activity, Flame, Scale, Target, Calendar, 
  ChevronRight, Utensils, AlertCircle, Loader2, Sparkles, Apple 
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function Dashboard() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [latestDiet, setLatestDiet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const token = await user.getIdToken();
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // 1. Pobranie profilu użytkownika
        const profileRes = await fetch(`${API_URL}/api/profiles/${user.uid}`, { headers });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        // 2. Pobranie historii diet (najnowsza jest pierwsza na liście)
        const dietsRes = await fetch(`${API_URL}/api/profiles/diet`, { headers });
        if (dietsRes.ok) {
          const dietsData = await dietsRes.json();
          if (dietsData && dietsData.length > 0) {
            setLatestDiet(dietsData[0]);
          }
        }
      } catch (error) {
        console.error("Błąd podczas pobierania danych pulpitu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Mapowanie celów na przyjazny język polski
  const goalTranslations: Record<string, string> = {
    lose_weight: "Redukcja tkanki tłuszczowej",
    maintain: "Utrzymanie wagi",
    gain_weight: "Budowa masy mięśniowej"
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-stone-500 font-medium">Ładowanie Twojego pulpitu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] pt-10 pb-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* NAGŁÓWEK POWITALNY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-800 tracking-tight">
              Cześć, <span className="text-orange-500">{user?.displayName?.split(" ")[0] || "użytkowniku"}</span> 👋
            </h1>
            <p className="text-stone-500 mt-2 font-medium">
              Oto podsumowanie Twojego profilu i aktualnego planu żywieniowego.
            </p>
          </div>
          
          {!latestDiet && (
            <Link 
              href="/generuj"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5" />
              Wygeneruj nową dietę
            </Link>
          )}
        </div>

        {/* BRAK DANYCH - PUSTY STAN */}
        {!profile && !latestDiet && (
          <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-10 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-3">Brak uzupełnionych danych</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-8">
              Wygląda na to, że nie stworzyłeś jeszcze swojego profilu ani nie wygenerowałeś diety. Uzupełnij parametry, aby AI mogło ułożyć plan idealny dla Ciebie.
            </p>
            <Link 
              href="/generuj"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
            >
              Rozpocznij kreator <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* KARTY Z DANYMI UŻYTKOWNIKA */}
        {profile && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Target className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Twój cel</h3>
              </div>
              <p className="text-lg font-bold text-stone-800 leading-tight">
                {goalTranslations[profile.goal] || profile.goal}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Apple className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Zapotrzebowanie</h3>
              </div>
              <p className="text-2xl font-black text-stone-800">
                {profile.target_calories} <span className="text-sm font-medium text-stone-400">kcal / dzień</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Activity className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Metabolizm (BMR)</h3>
              </div>
              <p className="text-2xl font-black text-stone-800">
                {profile.bmr} <span className="text-sm font-medium text-stone-400">kcal</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-stone-100 text-stone-600 rounded-lg"><Scale className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Twoje BMI</h3>
              </div>
              <p className="text-2xl font-black text-stone-800">{profile.bmi}</p>
            </div>
          </div>
        )}

        {/* AKTYWNA DIETA - PODGLĄD */}
        {latestDiet && (
          <div className="bg-white rounded-3xl border border-orange-100 shadow-xl shadow-orange-500/5 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-100" />
                  <span className="text-orange-100 font-bold uppercase tracking-widest text-sm">Aktywny plan</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">Twoja Dieta ({latestDiet.diet_type})</h2>
                <p className="text-orange-100 mt-1">Wygenerowano: {new Date(latestDiet.created_at).toLocaleDateString('pl-PL')}</p>
              </div>
              
              <Link 
                href="/plan" 
                className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl shadow-sm hover:bg-orange-50 transition-colors w-full sm:w-auto justify-center"
              >
                Przejdź do planu <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* SZYBKI PODGLĄD DNI */}
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-stone-400" /> Harmonogram 
                <span className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-md ml-2">{latestDiet.content.length} dni</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Wyświetlamy tylko pierwsze 3 dni jako podgląd */}
                {latestDiet.content.slice(0, 3).map((day: any, idx: number) => (
                  <div key={idx} className="border border-stone-100 rounded-2xl p-5 hover:border-orange-200 transition-colors bg-stone-50/50">
                    <h4 className="font-extrabold text-stone-800 mb-3">{day.day_of_week}</h4>
                    <ul className="space-y-3">
                      {day.meals.map((meal: any, mealIdx: number) => (
                        <li key={mealIdx} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-orange-400 mt-2"></div>
                          <div>
                            <p className="text-xs font-bold text-stone-400 uppercase">{meal.meal_type}</p>
                            <p className="text-sm font-bold text-stone-700 leading-tight">{meal.name}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {latestDiet.content.length > 3 && (
                <div className="mt-6 text-center">
                  <Link href="/plan" className="text-sm font-bold text-orange-500 hover:text-orange-600">
                    Zobacz pełny plan ({latestDiet.content.length} dni) &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}