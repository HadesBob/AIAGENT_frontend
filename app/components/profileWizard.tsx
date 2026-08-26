"use client";

import { useState } from "react";
// Pamiętaj o zaimportowaniu swojego hooka autoryzacji:
import { useAuth } from "../../lib/AuthContext"; 

export default function ProfileWizard() {
  const { user } = useAuth();
  
  // Stan kontrolujący obecny krok karuzeli (1 do 4)
  const [step, setStep] = useState(1);
  
  // Stan przechowujący dane wejściowe formularza
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight_kg: "",
    height_cm: "",
    activity_level: "",
    diet_type: "",
    goal: "",
    disliked_ingredients: "",
  });

  // Stany dla komunikacji z backendem
  const [profileData, setProfileData] = useState<any>(null);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja aktualizująca stan formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- WALIDACJA KROKÓW ---
  const isStep1Valid = formData.age && formData.gender && formData.weight_kg && formData.height_cm && formData.activity_level;
  const isStep2Valid = formData.diet_type && formData.goal;
  // Krok 3 jest zawsze poprawny (składniki nielubiane są opcjonalne)

  // --- KOMUNIKACJA Z BACKENDEM ---

  // 1. Zapis profilu po ukończeniu kroku 3
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      
      // Formatujemy dane pod to, czego oczekuje Pydantic w FastAPI
      const payload = {
        age: Number(formData.age),
        gender: formData.gender,
        weight_kg: Number(formData.weight_kg),
        height_cm: Number(formData.height_cm),
        activity_level: formData.activity_level,
        diet_type: formData.diet_type,
        goal: formData.goal,
        // Zamieniamy tekst po przecinkach na tablicę stringów
        disliked_ingredients: formData.disliked_ingredients
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      };

      const res = await fetch("http://localhost:8000/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Nie udało się zapisać profilu.");
      
      const savedProfile = await res.json();
      setProfileData(savedProfile); // Zapisujemy wynik (BMI, BMR) w stanie
      setStep(4); // Przechodzimy do ekranu podsumowania

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Generowanie diety w kroku 4
  const handleGenerateDiet = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch("http://localhost:8000/api/profiles/diets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ diet_type_override: null }), // Używamy domyślnego z profilu
      });

      if (!res.ok) throw new Error("Błąd podczas generowania diety.");
      
      const generatedDiet = await res.json();
      setDietPlan(generatedDiet);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDEROWANIE INTERFEJSU ---
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 border border-gray-100">
      
      {/* Pasek postępu */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2 px-2">
          <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>Fizjologia</span>
          <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>Cel</span>
          <span className={step >= 3 ? "text-blue-600 font-bold" : ""}>Wykluczenia</span>
          <span className={step >= 4 ? "text-green-600 font-bold" : ""}>Wynik</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg text-sm">{error}</div>}

      {/* --- KROK 1: DANE FIZYCZNE --- */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Powiedz nam coś o sobie</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wiek</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50" placeholder="np. 28" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Płeć</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50">
                <option value="">Wybierz...</option>
                <option value="male">Mężczyzna</option>
                <option value="female">Kobieta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waga (kg)</label>
              <input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50" placeholder="np. 75" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wzrost (cm)</label>
              <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50" placeholder="np. 175" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Poziom aktywności w ciągu dnia</label>
              <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50">
                <option value="">Wybierz...</option>
                <option value="sedentary">Siedzący (brak ćwiczeń, praca biurowa)</option>
                <option value="light">Lekki (lekkie ćwiczenia 1-3 razy w tygodniu)</option>
                <option value="moderate">Umiarkowany (ćwiczenia 3-5 razy w tygodniu)</option>
                <option value="active">Aktywny (ciężkie ćwiczenia codziennie)</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button 
              onClick={() => setStep(2)} 
              disabled={!isStep1Valid}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Dalej
            </button>
          </div>
        </div>
      )}

      {/* --- KROK 2: CEL I DIETA --- */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Jaki jest Twój cel?</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twój cel sylwetkowy</label>
              <select name="goal" value={formData.goal} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50">
                <option value="">Wybierz...</option>
                <option value="lose_weight">Chcę schudnąć</option>
                <option value="maintain">Chcę utrzymać wagę</option>
                <option value="gain_weight">Chcę przytyć / zbudować masę</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferowany typ diety</label>
              <select name="diet_type" value={formData.diet_type} onChange={handleChange} className="w-full border p-3 rounded-lg bg-gray-50">
                <option value="">Wybierz...</option>
                <option value="standard">Standardowa (Wszystkożerna)</option>
                <option value="vegetarian">Wegetariańska</option>
                <option value="vegan">Wegańska</option>
                <option value="keto">Ketogeniczna (Keto)</option>
                <option value="lactose_free">Bez laktozy</option>
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-2 border rounded-lg hover:bg-gray-50 transition">Wróć</button>
            <button 
              onClick={() => setStep(3)} 
              disabled={!isStep2Valid}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition"
            >
              Dalej
            </button>
          </div>
        </div>
      )}

      {/* --- KROK 3: WYKLUCZENIA --- */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Czego nie lubisz?</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wpisz składniki po przecinku (opcjonalnie)</label>
            <input 
              type="text" 
              name="disliked_ingredients" 
              value={formData.disliked_ingredients} 
              onChange={handleChange} 
              className="w-full border p-3 rounded-lg bg-gray-50" 
              placeholder="np. pomidory, oliwki, grzyby" 
            />
            <p className="text-xs text-gray-500 mt-2">Dzięki temu nasza AI pominie te składniki w Twoim jadłospisie.</p>
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={() => setStep(2)} className="text-gray-600 px-6 py-2 border rounded-lg hover:bg-gray-50 transition">Wróć</button>
            <button 
              onClick={handleSaveProfile} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition"
            >
              {isLoading ? "Zapisywanie..." : "Zatwierdź i oblicz"}
            </button>
          </div>
        </div>
      )}

      {/* --- KROK 4: PODSUMOWANIE I GENEROWANIE --- */}
      {step === 4 && profileData && !dietPlan && (
        <div className="animate-fade-in text-center">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Twój Profil Gotowy! 🎉</h2>
          <p className="text-gray-600 mb-8">Obliczyliśmy Twoje zapotrzebowanie na podstawie podanych danych.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-600 font-semibold mb-1">Twoje BMI</p>
              <p className="text-2xl font-bold text-gray-800">{profileData.bmi}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-sm text-orange-600 font-semibold mb-1">Cel kaloryczny</p>
              <p className="text-2xl font-bold text-gray-800">{profileData.target_calories} <span className="text-base font-normal">kcal</span></p>
            </div>
          </div>

          <button 
            onClick={handleGenerateDiet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-md transition transform hover:-translate-y-1"
          >
            {isLoading ? "🧠 Gemini układa Twój jadłospis..." : "✨ Wygeneruj pierwszą dietę"}
          </button>
        </div>
      )}

      {/* --- WYNIK: WYGENEROWANA DIETA --- */}
      {step === 4 && dietPlan && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-green-700">Jadłospis na: {dietPlan.content.day_of_week}</h2>
          <div className="space-y-4">
            {dietPlan.content.meals.map((meal: any, idx: number) => (
              <div key={idx} className="border p-4 rounded-xl bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{meal.meal_type}: {meal.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">{meal.calories} kcal</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Składniki:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {meal.ingredients.map((ing: string, i: number) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Przygotowanie:</p>
                  <p className="text-sm text-gray-600">{meal.recipe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}