"use client"; 

import Link from "next/link";

import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Navigation from "./components/Navigation";
import Hero from "./components/Home/Hero";



const STEPS = [
  {
    n: "01",
    title: "Opisz swój cel",
    body: "Cel (redukcja, masa, utrzymanie), waga, wzrost, poziom aktywności oraz produkty, których nie jadasz — z powodu alergii albo po prostu z niechęci.",
  },
  {
    n: "02",
    title: "AI układa plan",
    body: "Model balansuje kalorie i makroskładniki co do grama, a potem dobiera przepisy zgodne z Twoimi preferencjami i budżetem czasowym na gotowanie.",
  },
  {
    n: "03",
    title: "Jedz i koryguj",
    body: "Dostajesz gotowe posiłki, listę zakupów podzieloną na działy sklepu i możliwość wymiany dowolnego dania jednym kliknięciem, bez utraty bilansu.",
  },
];

const FEATURES = [
  {
    title: "Precyzyjne makro",
    body: "Każdy posiłek trafia w Twój cel kaloryczny co do grama białka, tłuszczu i węglowodanów — nie w przybliżeniu, tylko dokładnie.",
    accent: "carrot",
  },
  {
    title: "Uwzględnia alergie",
    body: "Model omija składniki, na które reagujesz, i te, których po prostu nie lubisz. Raz podane, nie wracają w kolejnych planach.",
    accent: "olive",
  },
  {
    title: "Lista zakupów w sekundę",
    body: "Plan tygodniowy zamienia się w listę zakupów posegregowaną według działów sklepu — bez liczenia ile bakłażanów kupić.",
    accent: "gold",
  },
  {
    title: "Wymiana posiłków",
    body: "Nie masz ochoty na propozycję ze środy? Wymień ją na inną, z tym samym bilansem kalorii i makro, w jednym kliknięciu.",
    accent: "carrot",
  },
  {
    title: "Plan na tydzień lub miesiąc",
    body: "Generuj dietę na 7 albo 30 dni, z automatycznym powtarzaniem zakupów i rotacją przepisów, żeby nic się nie znudziło.",
    accent: "olive",
  },
  {
    title: "Śledzenie postępów",
    body: "Zapisuj wagę i obwody — AI koryguje kalorie w kolejnych tygodniach na podstawie tego, jak faktycznie reaguje Twoje ciało.",
    accent: "gold",
  },
];

const ACCENT_CLASSES: Record<string, string> = {
  carrot: "bg-carrot",
  olive: "bg-olive",
  gold: "bg-gold",
};

const SAMPLE_MEALS = [
  { time: "7:30", name: "Owsianka z twarogiem, borówkami i orzechami", kcal: 480 },
  { time: "12:30", name: "Kurczak pieczony z kaszą gryczaną i brokułem", kcal: 620 },
  { time: "16:00", name: "Jogurt naturalny z siemieniem lnianym i jabłkiem", kcal: 240 },
  { time: "19:00", name: "Łosoś z ziemniakami i sałatką ze szpinaku", kcal: 560 },
];

const PLANS = [
  {
    name: "Start",
    price: "0 zł",
    period: "na zawsze",
    body: "Jeden plan tygodniowy, żeby sprawdzić, czy to dla Ciebie.",
    features: ["1 plan tygodniowy", "Lista zakupów", "Podstawowe makro"],
    highlighted: false,
  },
  {
    name: "Regularnie",
    price: "29 zł",
    period: "/ miesiąc",
    body: "Nielimitowane plany i pełna kontrola nad dietą.",
    features: [
      "Plany bez limitu",
      "Wymiana posiłków",
      "Śledzenie postępów",
      "Korekta kalorii co tydzień",
    ],
    highlighted: true,
  },
  {
    name: "Z dietetykiem",
    price: "99 zł",
    period: "/ miesiąc",
    body: "AI plus konsultacja z dietetykiem raz w miesiącu.",
    features: ["Wszystko z Regularnie", "1 konsultacja / mies.", "Priorytetowe wsparcie"],
    highlighted: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper">

      <Hero />

      {/* HOW IT WORKS */}
      <section id="jak-to-dziala" className="border-t border-line bg-white">
        <div className="mx-auto max-w-content px-6 py-24">
          <div className="max-w-xl">
            <p className="eyebrow text-olive mb-4">Jak to działa</p>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              Trzy kroki od pytania do talerza.
            </h2>
          </div>

          <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="relative">
                <span className="font-mono text-sm text-carrot">{step.n}</span>
                <h3 className="mt-4 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-charcoal/70">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="funkcje" className="mx-auto max-w-content px-6 py-24">
        <div className="max-w-xl">
          <p className="eyebrow text-olive mb-4">Funkcje</p>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Zbudowane wokół tego, co faktycznie jesz.
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="bg-white p-8">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${ACCENT_CLASSES[feature.accent]}`}
              />
              <h3 className="mt-5 font-display text-xl text-ink">{feature.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal/70">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE PLAN */}
      <section id="przyklad" className="border-t border-line bg-ink">
        <div className="mx-auto max-w-content px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="eyebrow text-carrot mb-4">Przykładowy plan</p>
              <h2 className="font-display text-4xl text-paper sm:text-5xl">
                Poniedziałek, wygenerowany dla celu redukcji.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-paper/65">
                2140 kcal, 158 g białka, 232 g węglowodanów, 58 g tłuszczu.
                Bez laktozy, z uwzględnieniem alergii na orzechy ziemne.
              </p>
            </div>

            <div className="rounded-3xl border border-paper/10 bg-paper/[0.04] p-2 sm:p-3">
              <div className="divide-y divide-paper/10">
                {SAMPLE_MEALS.map((meal) => (
                  <div
                    key={meal.name}
                    className="flex items-center gap-5 px-4 py-5 sm:px-6"
                  >
                    <span className="font-mono text-xs text-paper/45 w-12 shrink-0">
                      {meal.time}
                    </span>
                    <span className="flex-1 text-[15px] text-paper/90">{meal.name}</span>
                    <span className="font-mono text-xs text-paper/50 shrink-0">
                      {meal.kcal} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="cennik" className="mx-auto max-w-content px-6 py-24">
        <div className="max-w-xl">
          <p className="eyebrow text-olive mb-4">Cennik</p>
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Zacznij za darmo, zostań jeśli zadziała.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-3xl border p-8 ${
                plan.highlighted
                  ? "border-ink bg-ink text-paper shadow-xl"
                  : "border-line bg-white text-charcoal"
              }`}
            >
              <h3 className="font-display text-2xl">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-mono text-3xl">{plan.price}</span>
                <span className={`text-sm ${plan.highlighted ? "text-paper/60" : "text-charcoal/50"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`mt-3 text-sm ${plan.highlighted ? "text-paper/70" : "text-charcoal/65"}`}>
                {plan.body}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        plan.highlighted ? "bg-carrot" : "bg-olive"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#generuj"
                className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  plan.highlighted
                    ? "bg-carrot text-white"
                    : "bg-ink text-paper"
                }`}
              >
                Wybierz {plan.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="generuj" className="border-t border-line bg-white">
        <div className="mx-auto max-w-content px-6 py-24 text-center">
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Twój plan czeka.
          </h2>
          <p className="mt-4 text-lg text-charcoal/70">
            Wygenerowanie zajmuje mniej czasu niż zrobienie zakupów.
          </p>
          <a
            href="#"
            className="mt-9 inline-block rounded-full bg-carrot px-9 py-4 text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(255,107,53,0.55)] transition-transform hover:scale-[1.03]"
          >
            Zacznij za darmo
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-xl text-ink">Talerz</span>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal/60">
            <a href="#jak-to-dziala" className="hover:text-ink">Jak to działa</a>
            <a href="#funkcje" className="hover:text-ink">Funkcje</a>
            <a href="#cennik" className="hover:text-ink">Cennik</a>
            <a href="#" className="hover:text-ink">Regulamin</a>
            <a href="#" className="hover:text-ink">Prywatność</a>
          </nav>
          <span className="text-xs text-charcoal/40">© 2026 Talerz</span>
        </div>
      </footer>
    </main>
  );
}