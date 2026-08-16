"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

// Definiujemy kształt danych naszej sesji
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Tworzymy pusty kontekst
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Tworzymy komponent, który owinie naszą aplikację
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged to funkcja Firebase, która odpala się ZAWSZE:
    // 1. Przy pierwszym załadowaniu strony (sprawdza czy jest ciastko/sesja)
    // 2. Gdy ktoś się zaloguje
    // 3. Gdy ktoś się wyloguje
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Przestajemy ładować, bo wiemy już, czy ktoś jest
    });

    // Sprzątanie po odmontowaniu komponentu
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Własny hook (skrót), żeby łatwo wyciągać dane na innych stronach
export const useAuth = () => useContext(AuthContext);