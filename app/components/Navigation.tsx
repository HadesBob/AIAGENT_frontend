"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, Sparkles, User, ChefHat } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  // Tablica z konfiguracją linków ułatwia zarządzanie menu
  const navItems = [
    { name: "Pulpit", href: "/", icon: Home },
    { name: "Przepisy", href: "/przepisy", icon: Utensils },
    { name: "Nowy", href: "/przepisy/nowy", icon: Sparkles, isPrimary: true },
    { name: "Mój Plan", href: "/auth", icon: User },
  ];

  return (
    <>
      {/* 🖥️ NAWIGACJA DESKTOPOWA (Top Bar) - Ukryta na urządzeniach mobilnych */}
      <header className="hidden md:block fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              Foodmaniak <span className="text-orange-500">AI</span>
            </span>
          </Link>

          {/* Linki desktopowe */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.isPrimary) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="ml-4 flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    Wygeneruj
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 📱 NAWIGACJA MOBILNA (Bottom Bar) - Ukryta na desktopie */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            // Wyróżniony przycisk centralny (np. dodawanie/generowanie)
            if (item.isPrimary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center w-14 h-14 -mt-6 bg-zinc-900 text-white rounded-full shadow-lg border-4 border-zinc-50 hover:bg-zinc-800 transition-transform active:scale-95"
                >
                  <Icon className="w-6 h-6" />
                </Link>
              );
            }

            // Standardowe zakładki mobilne
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                  isActive ? "text-orange-600" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <div className={`p-1 rounded-full ${isActive ? "bg-orange-100" : ""}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}