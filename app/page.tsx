"use client"; // Musimy to dodać, bo używamy hooka klienckiego

import Link from "next/link";
import { useAuth } from "../lib/AuthContext"; // Importujemy naszego hooka
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";

export default function Home() {
  // Wyciągamy informacje o użytkowniku w 1 linijce!
  const { user, loading } = useAuth();

  useEffect(() => {
    // 1. Tworzymy wewnętrzną funkcję asynchroniczną
    const printMyToken = async () => {
      // 2. Sprawdzamy, czy użytkownik faktycznie jest zalogowany
      if (user) {
        const token = await user.getIdToken();
        console.log("====================================");
        console.log("MÓJ TOKEN:", token);
        console.log("====================================");
      }
    };

    // 3. Wywołujemy ją
    printMyToken();
    
  }, [user]);
  const handleLogout = async () => {
    await signOut(auth);
    alert("Wylogowano pomyślnie");
  };

  // Zabezpieczenie przed miganiem: gdy Firebase jeszcze sprawdza sesję
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Ładowanie aplikacji...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          Witaj w swojej aplikacji
        </h1>
        
        {/* LOGIKA WIDOKU */}
        {user ? (
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <p className="text-lg text-gray-600 mb-4">
              Jesteś zalogowany jako: <strong className="text-blue-600">{user.email}</strong>
            </p>
            <button 
              onClick={handleLogout}
              className="inline-block rounded-lg bg-red-500 px-6 py-3 text-white font-semibold hover:bg-red-600 transition-colors"
            >
              Wyloguj się
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-6">
              Nie jesteś zalogowany. Dołącz do nas już dziś.
            </p>
            <Link 
              href="/auth" 
              className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              Przejdź do logowania
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}