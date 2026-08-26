"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/AuthContext";
// Importujemy nasz nowy komponent (upewnij się, że ścieżka jest poprawna)
import ProfileWizard from "../components/profileWizard"

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Ochrona trasy: jeśli ktoś nie jest zalogowany, wyrzucamy go na stronę logowania
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  // Ekran ładowania podczas sprawdzania sesji
  if (loading) {
    return <div className="p-8 text-center">Ładowanie profilu...</div>;
  }

  // Jeśli nie ma użytkownika, nie renderujemy niczego (efekt wyżej i tak nas przeniesie)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Witaj, {user.displayName || user.email}!
        </h1>
        
        {/* Tu "wpinamy" nasz komponent jako klocek */}
        <ProfileWizard />
        
      </div>
    </div>
  );
}