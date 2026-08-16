"use client";

import { useState } from "react";
// Importujemy nasze narzędzie Firebase stworzone w kroku 2
import { auth, db} from "@/lib/firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
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
      router.push("/");
      
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