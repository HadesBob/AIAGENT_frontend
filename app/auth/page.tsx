"use client";

import { useState } from "react";
// Importujemy nasze narzędzie Firebase stworzone w kroku 2
import { auth, db} from "@/lib/firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Zalogowano pomyślnie!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          wzrost: null, 
          waga: 66,
          role: "user",
          createdAt: new Date()
        });

        alert("Konto zostało utworzone!");
      }
      
      // Po udanym logowaniu/rejestracji przenosimy na stronę główną
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") setError("Ten e-mail jest już zajęty.");
      else if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") setError("Błędny e-mail lub hasło.");
      else if (err.code === "auth/weak-password") setError("Hasło musi mieć minimum 6 znaków.");
      else setError("Wystąpił błąd podczas autoryzacji.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // 1. Inicjalizujemy dostawcę Google
    const provider = new GoogleAuthProvider();
    
    try {
      setError("");
      
      // 2. Wywołujemy okienko pop-up logowania Google
      const result = await signInWithPopup(auth, provider);
      
      // Sukces! (Twój działający w tle AuthContext automatycznie to wykryje)
      const user = result.user;
      console.log("Zalogowano pomyślnie:", user.displayName);
      
      // 3. Przekierowanie użytkownika, np. do panelu z dietą
      router.push("/");
      
    } catch (err: any) {
      console.error("Błąd podczas logowania Google:", err);
      // Firebase zwraca kody błędów, możemy wyświetlić przyjazny komunikat
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Logowanie przerwane (okienko zostało zamknięte).");
      } else {
        setError("Wystąpił błąd podczas logowania przez Google.");
      }
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLoginMode ? "Zaloguj się" : "Utwórz konto"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres e-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="twoj@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? "Przetwarzanie..." : isLoginMode ? "Zaloguj się" : "Zarejestruj się"}
          </button>


        </form>

<button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        {/* Ikonka Google (SVG) */}
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
        Kontynuuj z Google
      </button>
      
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLoginMode ? "Nie masz jeszcze konta?" : "Masz już konto?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError("");
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isLoginMode ? "Zarejestruj się" : "Zaloguj się"}
          </button>
        </p>
      </div>
    </div>
  );
}