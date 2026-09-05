"use client";

import { useState, useMemo } from "react";
import { Check, Calendar, BarChart2, ChevronRight, ChevronLeft, Flame, Scale, Activity, Apple, Loader2, Utensils } from "lucide-react";
import { useAuth } from "@/lib/AuthContext"; 

// --- TYPY DANYCH ---
type Goal = "lose_weight" | "maintain" | "gain_weight";
type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active";
type DietType = "standard" | "vegetarian" | "vegan" | "keto" | "lactose_free" | "gluten_free";

export default function DietCreator() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDiet, setGeneratedDiet] = useState<any>(null);
  
  // Główny stan formularza
  const [formData, setFormData] = useState({
    goal: "lose_weight" as Goal,
    dietType: "standard" as DietType,
    gender: null as Gender | null,
    age: "",
    weight: "",
    height: "",
    activityLevel: "light" as ActivityLevel,
    days: 3,
    mealsCount: 4,
    disliked: ""
  });

  // --- OBLICZENIA MATEMATYCZNE ---
  const metrics = useMemo(() => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const a = parseInt(formData.age);

    if (!w || !h || !a || !formData.gender) return null;

    const heightM = h / 100;
    const bmi = +(w / (heightM * heightM)).toFixed(1);

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr += formData.gender === "male" ? 5 : -161;

    const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = bmr * activityMultipliers[formData.activityLevel];

    let targetCalories = tdee;
    if (formData.goal === "lose_weight") targetCalories -= 500;
    if (formData.goal === "gain_weight") targetCalories += 500;

    return { bmi, bmr: Math.round(bmr), targetCalories: Math.round(targetCalories) };
  }, [formData]);

  // --- WYSYŁKA DO API ---
  const handleGenerateAndSave = async () => {
    if (!metrics || !user) {
      alert("Zaloguj się i wypełnij wszystkie dane!");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Przygotowanie tokenu Firebase do autoryzacji z FastAPI
      const token = await user.getIdToken();
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      // 1. Zapis/Aktualizacja Profilu
      await fetch("http://127.0.0.1:8000/api/profiles", {
        method: "POST",
        headers,
        body: JSON.stringify({
          age: parseInt(formData.age),
          height_cm: parseFloat(formData.height),
          weight_kg: parseFloat(formData.weight),
          gender: formData.gender,
          activity_level: formData.activityLevel,
          goal: formData.goal,
          diet_type: formData.dietType,
          disliked_ingredients: formData.disliked.split(",").map(i => i.trim()).filter(i => i)
        })
      });

      // 2. Wygenerowanie Diety AI
      const dietRes = await fetch("http://127.0.0.1:8000/api/profiles/diets", {
        method: "POST",
        headers,
        body: JSON.stringify({
          diet_type_override: formData.dietType,
          days: formData.days,
          meals_count: formData.mealsCount,
          target_calories: metrics.targetCalories,
          disliked_ingredients: formData.disliked.split(",").map(i => i.trim()).filter(i => i)
        })
      });

      if (!dietRes.ok) throw new Error("Błąd podczas generowania diety");
      
      const dietData = await dietRes.json();
      setGeneratedDiet(dietData); // Przejście do widoku wyników
      
    } catch (error) {
      console.error(error);
      alert("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // --- WIDOK: GOTOWA DIETA (Zastępuje formularz po wygenerowaniu) ---
  if (generatedDiet) {
    return <DietResultView dietPlan={generatedDiet} />;
  }

  // --- WIDOK: EKRAN ŁADOWANIA (Gdy Gemini "myśli") ---
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Sztuczna inteligencja układa Twój plan...</h2>
        <p className="text-stone-500 text-center max-w-md">
          Bierzemy pod uwagę Twoje zapotrzebowanie ({metrics?.targetCalories} kcal), wybrane posiłki oraz wykluczenia. To potrwa kilka do kilkunastu sekund.
        </p>
      </div>
    );
  }

  // --- WIDOK FORMULARZA (Kroki 1-5) ---
  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center pt-10 px-4 pb-24 font-sans">
      <Header step={step} />
      <Stepper step={step} />

      <div className="w-full max-w-3xl bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-stone-200/50 border border-orange-50">
        
        {/* KROK 1: CEL */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-4">
            <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">Jaki jest Twój główny cel?</h2>
            {[
              { id: "lose_weight", title: "Chcę schudnąć", desc: "Deficyt kaloryczny, redukcja tkanki tłuszczowej" },
              { id: "maintain", title: "Chcę utrzymać wagę", desc: "Zbilansowana dieta dla zdrowia" },
              { id: "gain_weight", title: "Chcę przytyć", desc: "Nadwyżka kaloryczna, budowa masy" }
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => updateForm("goal", g.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  formData.goal === g.id ? "border-orange-500 bg-orange-50 shadow-md" : "border-stone-100 hover:border-orange-200"
                }`}
              >
                <p className={`font-bold text-lg ${formData.goal === g.id ? "text-orange-700" : "text-stone-700"}`}>{g.title}</p>
                <p className="text-stone-500 text-sm mt-1">{g.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* KROK 2: DIETA */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">Wybierz styl odżywiania</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "standard", label: "Standardowa", emoji: "🥗" },
                { id: "vegetarian", label: "Wegetariańska", emoji: "🥦" },
                { id: "vegan", label: "Wegańska", emoji: "🌱" },
                { id: "keto", label: "Keto", emoji: "🥑" },
                { id: "lactose_free", label: "Bez laktozy", emoji: "🥛" },
                { id: "gluten_free", label: "Bez glutenu", emoji: "🌾" }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => updateForm("dietType", d.id)}
                  className={`p-4 flex flex-col items-center justify-center rounded-2xl border-2 transition-all ${
                    formData.dietType === d.id ? "border-orange-500 bg-orange-50 shadow-md" : "border-stone-100 hover:border-orange-200"
                  }`}
                >
                  <span className="text-3xl mb-2">{d.emoji}</span>
                  <span className="font-bold text-stone-700">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* KROK 3: DANE (Zachowany z wcześniejszych ustaleń) */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                <BarChart2 className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800">Twoje dane</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-stone-700 mb-3">Płeć</label>
              <div className="grid grid-cols-2 gap-4">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateForm("gender", g)}
                    className={`py-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 ${
                      formData.gender === g ? "border-orange-500 bg-orange-50 text-orange-700" : "border-stone-200 text-stone-600"
                    }`}
                  >
                    {g === "male" ? "👨 Mężczyzna" : "👩 Kobieta"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {(["age", "weight", "height"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-stone-700 mb-2 capitalize">
                    {field === "age" ? "Wiek" : field === "weight" ? "Waga (kg)" : "Wzrost (cm)"}
                  </label>
                  <input 
                    type="number" value={formData[field]} onChange={(e) => updateForm(field, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 focus:ring-0 text-center font-medium outline-none"
                  />
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-3">Aktywność fizyczna</label>
              <select 
                value={formData.activityLevel} onChange={(e) => updateForm("activityLevel", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 font-medium text-stone-700 outline-none bg-white"
              >
                <option value="sedentary">Brak (Praca siedząca)</option>
                <option value="light">Lekka (1-2 treningi/tydz)</option>
                <option value="moderate">Średnia (3-4 treningi/tydz)</option>
                <option value="active">Wysoka (Fizyczna praca / 5+ treningów)</option>
              </select>
            </div>
          </div>
        )}

        {/* KROK 4: PREFERENCJE DOT. WYGENEROWANIA */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-8">
            <h2 className="text-2xl font-bold text-stone-800 text-center mb-6">Szczegóły jadłospisu</h2>
            
            <div>
              <label className="flex justify-between text-sm font-bold text-stone-700 mb-4">
                <span>Na ile dni ułożyć plan?</span>
                <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full">{formData.days} dni</span>
              </label>
              <input 
                type="range" min="1" max="7" step="1"
                value={formData.days} onChange={(e) => updateForm("days", parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-stone-400 mt-2">
                <span>1 dzień (testowy)</span><span>7 dni (tydzień)</span>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-bold text-stone-700 mb-4">
                <span>Ilość posiłków dziennie</span>
                <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-full">{formData.mealsCount} posiłków</span>
              </label>
              <input 
                type="range" min="3" max="6" step="1"
                value={formData.mealsCount} onChange={(e) => updateForm("mealsCount", parseInt(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-stone-400 mt-2">
                <span>3 posiłki (Duże)</span><span>6 posiłków (Mniejsze)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Czego nie lubisz? (Wykluczenia)</label>
              <textarea 
                rows={3}
                placeholder="Np. pomidory, oliwki, grzyby, ryby..."
                value={formData.disliked} onChange={(e) => updateForm("disliked", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-orange-500 outline-none text-stone-700 resize-none"
              />
            </div>
          </div>
        )}

        {/* KROK 5: PODSUMOWANIE I GENEROWANIE */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-800 mb-2">Podsumowanie</h2>
            <p className="text-stone-500 mb-8">Zapiszemy te dane w Twoim profilu i wygenerujemy dietę.</p>
            
            {metrics && (
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <Scale className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-[10px] sm:text-xs text-stone-500 uppercase font-bold tracking-wider">Twoje BMI</p>
                  <p className="text-xl sm:text-2xl font-black text-stone-800">{metrics.bmi}</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <Activity className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-[10px] sm:text-xs text-stone-500 uppercase font-bold tracking-wider">Metabolizm</p>
                  <p className="text-xl sm:text-2xl font-black text-stone-800">{metrics.bmr} <span className="text-xs">kcal</span></p>
                </div>
                <div className="bg-gradient-to-b from-orange-500 to-orange-600 rounded-2xl p-4 shadow-md text-white transform scale-105">
                  <Apple className="w-6 h-6 text-white mx-auto mb-2 opacity-80" />
                  <p className="text-[10px] sm:text-xs text-orange-100 uppercase font-bold tracking-wider">Cel (Dziennie)</p>
                  <p className="text-xl sm:text-2xl font-black">{metrics.targetCalories} <span className="text-xs font-medium">kcal</span></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DOLNY PASEK NAWIGACJI */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-stone-100">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${step === 1 ? "invisible" : "text-stone-500 hover:bg-stone-100"}`}
          >
            <ChevronLeft className="w-5 h-5" /> Wstecz
          </button>
          
          {step < 5 ? (
            <button 
              onClick={() => setStep(s => Math.min(5, s + 1))}
              disabled={step === 3 && (!formData.gender || !formData.age || !formData.weight || !formData.height)}
              className="flex items-center gap-2 px-8 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50"
            >
              Dalej <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleGenerateAndSave}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-95"
            >
              Generuj Plan <Flame className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-KOMPONENTY (Dla zachowania czystości kodu) ---

function Header({ step }: { step: number }) {
  const titles = ["Wybór celu", "Rodzaj diety", "Dane biometryczne", "Preferencje jadłospisu", "Zapis i generowanie"];
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight">Kreator <span className="text-orange-500">diety</span></h1>
      <p className="text-stone-500 mt-2 font-medium">Krok {step} z 5 — {titles[step - 1]}</p>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center justify-center w-full max-w-xl mb-12">
      {steps.map((s, idx) => (
        <div key={s} className="flex items-center">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold transition-all ${
            step > s ? "bg-orange-100 border-orange-500 text-orange-600" : step === s ? "bg-orange-500 border-orange-500 text-white shadow-lg" : "bg-white border-stone-200 text-stone-400"
          }`}>
            {step > s ? <Check className="w-5 h-5" /> : s}
          </div>
          {idx < steps.length - 1 && <div className={`w-8 sm:w-12 h-1 mx-1 sm:mx-3 rounded transition-colors ${step > s ? "bg-orange-500" : "bg-stone-200"}`} />}
        </div>
      ))}
    </div>
  );
}

// --- KOMPONENT WYŚWIETLAJĄCY GOTOWĄ DIETĘ (Mapowanie zagnieżdżonych list) ---
function DietResultView({ dietPlan }: { dietPlan: any }) {
  // Stan przechowujący indeks aktualnie wyświetlanego dnia
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  
  const daysCount = dietPlan.content.length;
  const currentDayData = dietPlan.content[currentDayIndex];

  // Funkcja wyliczająca datę dla danego indeksu (zawsze startuje od jutra)
  const getFormattedDate = (index: number) => {
    const date = new Date();
    // +1 oznacza jutro. Kolejne indeksy dodają kolejne dni.
    date.setDate(date.getDate() + 1 + index); 
    
    // Używamy polskiego formatowania (np. "piątek, 4 września")
    const formatted = new Intl.DateTimeFormat('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
    
    // Zwracamy z wielką literą na początku
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handlePrev = () => setCurrentDayIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentDayIndex(prev => Math.min(daysCount - 1, prev + 1));

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
        
        {/* NAGŁÓWEK SUKCESU */}
        <div className="bg-orange-500 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-lg shadow-orange-500/20 text-center">
          <h1 className="text-2xl sm:text-3xl font-black mb-2">Twój plan jest gotowy! 🎉</h1>
          <p className="text-orange-100 text-sm sm:text-lg">Zaczynamy od jutra. Powodzenia w realizacji celu.</p>
        </div>

        {/* NAWIGACJA DNI (KONTROLER) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between mb-8 sticky top-[88px] z-40">
          <button 
            onClick={handlePrev} 
            disabled={currentDayIndex === 0}
            className="p-3 rounded-xl bg-stone-50 text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-colors disabled:opacity-40 disabled:hover:bg-stone-50 disabled:hover:text-stone-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Dzień {currentDayIndex + 1} z {daysCount}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-800">
              {getFormattedDate(currentDayIndex)}
            </h2>
          </div>

          <button 
            onClick={handleNext} 
            disabled={currentDayIndex === daysCount - 1}
            className="p-3 rounded-xl bg-stone-50 text-stone-600 hover:bg-orange-50 hover:text-orange-600 transition-colors disabled:opacity-40 disabled:hover:bg-stone-50 disabled:hover:text-stone-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* LISTA POSIŁKÓW DLA WYBRANEGO DNIA */}
        <div className="space-y-6 animate-in slide-in-from-right-4">
          {currentDayData.meals.map((meal: any, mealIdx: number) => (
            <div key={mealIdx} className="bg-white border border-stone-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              
              {/* Nagłówek posiłku i makro */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full mb-2 inline-block">
                    {meal.meal_type}
                  </span>
                  <h3 className="text-xl font-bold text-stone-800">{meal.name}</h3>
                </div>
                
                <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm font-semibold bg-stone-50 p-3 rounded-xl border border-stone-100 w-full md:w-auto overflow-x-auto">
                  <div className="text-center min-w-[60px]"><p className="text-stone-400 text-[10px]">KCAL</p><p className="text-stone-800">{meal.macros.calories}</p></div>
                  <div className="text-center min-w-[60px]"><p className="text-stone-400 text-[10px]">BIAŁKO</p><p className="text-orange-600">{meal.macros.protein}g</p></div>
                  <div className="text-center min-w-[60px]"><p className="text-stone-400 text-[10px]">TŁUSZCZE</p><p className="text-orange-600">{meal.macros.fat}g</p></div>
                  <div className="text-center min-w-[60px]"><p className="text-stone-400 text-[10px]">WĘGLE</p><p className="text-orange-600">{meal.macros.carbs}g</p></div>
                </div>
              </div>

              {/* Lista składników i przepis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div>
                  <h4 className="font-bold text-stone-800 mb-3 flex items-center gap-2">🛒 Składniki</h4>
                  <ul className="space-y-2 text-stone-600 text-sm">
                    {meal.ingredients.map((ing: any, i: number) => (
                      <li key={i} className="flex justify-between border-b border-stone-50 pb-1">
                        <span>{ing.name}</span>
                        <span className="font-semibold text-stone-800">{ing.amount} {ing.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 mb-3 flex items-center gap-2">👨‍🍳 Przygotowanie</h4>
                  <ol className="list-decimal list-inside space-y-2 text-stone-600 text-sm">
                    {meal.instructions.map((step: string, i: number) => (
                      <li key={i} className="pl-1">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}