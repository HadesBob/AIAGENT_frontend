"use client"

import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navigation() {

  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 2. Stan menu

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Błąd wylogowywania", error);
    }
  };

  const NAV_LINKS = [

    { label: "Przepisy", href: "/przepisy" },
    { label: "Diety", href: "/diety" },
    { label: "Cennik", href: "/cennik" },
    { label: "BMI", href: "/oblicz-bmi" },
    { label: "Blog", href: "/blog" },
  ];



  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-green-200 backdrop-blur max-w-screen">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="font-headline text-4xl tracking-tight text-ink">
          Food
          <span className="bg-black/80 text-brand-orange  p-2 mx-1 rounded-sm">Maniak</span>

        </a>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-ink font-medium py-1
                   after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                   after:w-0 after:h-[2px] after:bg-green-600 
                   after:transition-all after:duration-300 ease-in-out
                   hover:after:w-full hover:text-green-600 transition-colors
                   font-lora text-2xl"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex justify-between" >
          <a
            href="/dashboard"
            className="rounded-lg border-2 border-black/80 px-5 py-2.5 mx-1.5 text-black font-bold  uppercase
                    transition-transform hover:scale-[1.03] hover:bg-black/80 hover:text-brand-orange"
          >
            Twoja Dieta
          </a>


          {user ? (
            <div className="flex items-center gap-5">
              <button className="relative p-2 text-charcoal hover:bg-white rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-carrot rounded-full border-2 border-paper"></span>
              </button>

              {/* 3. Rodzic musi mieć klasę 'relative', aby menu pozycjonowało się względem niego */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  // onBlur zamknie menu, gdy użytkownik kliknie gdziekolwiek indziej na ekranie
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                  className="flex items-center gap-2 text-sm font-medium text-ink hover:text-carrot transition-colors"
                >
                  <span>{user.displayName || "Użytkownik"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* 4. Rozwijane menu (pozycjonowanie absolutne) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-line rounded-xl shadow-lg overflow-hidden z-50 animate-fade-up">
                    <div className="px-4 py-3 border-b border-line bg-gray-50">
                      <p className="text-xs text-charcoal truncate">{user.email}</p>
                    </div>

                    <div className="p-1">
                      <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-paper rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        Mój profil
                      </Link>
                      <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-paper rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        Ustawienia
                      </Link>

                      <div className="h-px bg-line my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Wyloguj
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          ) : (
            <a
              href="/auth"
              className="rounded-lg bg-black/80 px-5 py-2.5 font-bold font-display text-brand-orange uppercase
                transition-transform hover:scale-[1.05]"
            >
              Zaloguj się
            </a>
          )}



        </div>

      </div>
    </header>

  )
}