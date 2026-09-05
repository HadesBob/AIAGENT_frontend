"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, Bell, ChevronDown, 
  Home, Utensils, Sparkles, User, 
  BookOpen, Globe, Phone, Settings, LogOut, Heart, 
  Book,
  Coins, UserCircle2
} from "lucide-react";

// Import customowego hooka autoryzacji z Firebase
import { useAuth } from "@/lib/AuthContext"; 
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Brand from "./Brand";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Destrukturyzacja danych z kontekstu Firebase
  const { user } = useAuth();


  const desktopNavItems = [  
    { name: "Przepisy", href: "/przepisy", icon: Utensils },
    { name: "Cennik", href: "/cennik", icon: Coins, isPrimary: true },
    { name: "Artykuły", href: "/blog", icon: Book },
    { name: "Kontakt", href: "/kontakt", icon: Book },
    { name: "FAQ", href: "/faq", icon: Book },
    
  ]
  const bottomNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Przepisy", href: "/przepisy", icon: Utensils },
    { name: "Generuj", href: "/dashboard", icon: Sparkles, isPrimary: true },
    { name: "Ulubione", href: "/ulubione", icon: Heart },
    { name: "Profil", href: "/auth", icon: User },
  ];

  const mobileTopLinks = [
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Kuchnie Świata", href: "/kuchnie", icon: Globe },
    { name: "Kontakt", href: "/kontakt", icon: Phone },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* DESKTOP */}
      <header className="fixed top-0 w-full bg-brand-main backdrop-blur-md border-b border-amber-100/60 z-50">       
           
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-1 group z-50">
            <Brand />
          </Link>

          {/*  Menu - Desktop */}
          <nav className="hidden md:flex items-center gap-10">
              {
                desktopNavItems.map((link) => (
                  <Link href={link.href} key={link.href} className="">
                    <div className="flex gap-2 items-center py-4 box-content hover:border-b-4
                     hover:border-green-900 hover:font-bold ">
                     
                      <h1 className="text-lg font-lora"> {link.name}</h1>
                    </div>
                  </Link>
                ))              
              }

          </nav>

          {/* 💻 Autoryzacja - Desktop */}
          <div className="hidden md:flex items-center gap-4">
               <Link 
                  href="/kreator-diety"
                  className="px-6 py-2.5 text-white font-bold rounded-xl bg-brand-secondary
                   bg-hover:shadow-lg hover:shadow-rose-500/25 transition-all active:scale-95"
                >
                  Kreator diety
                </Link>
            {user ? (
              <div className="flex items-center gap-5">
                
                <button className="p-2 text-[#8b7e74] hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>

                {/* Dropdown Użytkownika */}
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-2 py-1.5 bg-white border border-[#eae0d5] rounded-full hover:border-amber-200 transition-colors shadow-sm"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 text-rose-700 flex items-center justify-center font-bold font-serif">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="font-semibold text-[#4a3f35] pr-1">
                      {user.displayName || "Użytkownik"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#8b7e74] mr-2 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Menu rozwijane profilu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-amber-900/5 border border-amber-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-[#6b5d52] hover:bg-[#fdfbf7] hover:text-rose-600 transition-colors"
                      >
                        <User className="w-4 h-4" /> Twój Profil
                      </Link>
                      <Link 
                        href="/ustawienia" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-[#6b5d52] hover:bg-[#fdfbf7] hover:text-rose-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Ustawienia
                      </Link>
                      <div className="h-px bg-[#f4ece4] my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-[#6b5d52] hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Wyloguj się
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/auth" 
                  className="px-5 py-2.5 text-[#6b5d52] font-semibold hover:text-rose-600 transition-colors"
                >
                  Zaloguj
                </Link>
               
              </div>
            )}
          </div>

          {/* 📱 Hamburger - Mobile */}
          <button 
            className="md:hidden p-2 -mr-2 text-[#6b5d52] hover:text-rose-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* 📱 Rozwijane Menu Górne */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#fdfbf7] border-b border-amber-100 shadow-xl animate-in slide-in-from-top-2">
            <div className="flex flex-col p-5 space-y-2">
              {mobileTopLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 text-[#4a3f35] font-medium rounded-xl hover:bg-amber-50 hover:text-rose-600 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-amber-600/70" />
                  {link.name}
                </Link>
              ))}
              
              {!user && (
                <div className="mt-4 pt-5 border-t border-[#eae0d5] flex flex-col gap-3">
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 border-2 border-rose-200 text-rose-600 text-center font-bold rounded-xl"
                  >
                    Zaloguj się
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 📱 DOLNY PASEK ZADAŃ (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#eae0d5] pb-safe pt-1 px-2 z-50 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center relative h-16">
          {bottomNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center justify-center w-[68px] h-[68px] bg-gradient-to-tr from-rose-500 to-orange-400 text-white rounded-full shadow-lg shadow-rose-500/30 border-[5px] border-[#fdfbf7] transition-transform active:scale-95"
                >
                  <Icon className="w-7 h-7" />
                </Link>
              );
            }

            const isLeftOfCenter = index === 1;
            const isRightOfCenter = index === 3;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                  isLeftOfCenter ? "mr-8" : isRightOfCenter ? "ml-8" : ""
                } ${isActive ? "text-rose-600" : "text-[#a3978f] hover:text-[#6b5d52]"}`}
              >
                <div className="relative mb-1">
                  <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-500 rounded-full"></span>
                  )}
                </div>
                <span className={`text-[10px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
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