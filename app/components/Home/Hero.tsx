import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="px-4 sm:px-6 pt-12 pb-20 bg-green-100 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* 
        Kluczowe zmiany:
        1. flex-col dla smartfonów, lg:flex-row dla desktopów.
        2. Usunięto w-screen i px-50 (powodowały poziome przewijanie i ucinały treść na mobile).
        3. Dodano max-w-7xl mx-auto dla eleganckiego centrowania na dużych ekranach.
      */}
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Lewa kolumna: Treść */}
        <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="eyebrow text-olive mb-4 font-semibold">Generator diet napędzany AI</p>
          
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-[2.6rem] xl:text-6xl leading-[1.1] text-black/80">
            <span className="text-brand-orange bg-black/80 font-display px-4 py-1 sm:px-5 sm:py-2 rounded-lg inline-block mb-3">
              Ułóż i kontroluj
            </span>
            <br />
            swoją dietę.
          </h1>
          
          <p className="mt-5 sm:mt-6 max-w-xl text-lg sm:text-xl text-black/65">
            Podaj cel, wagę i to, czego nie jadasz. W trzy minuty dostajesz
            plan posiłków z listą zakupów i dokładnym rozkładem
            makroskładników — dopasowany, nie uśredniony.
          </p>

          {/* Przyciski: pełna szerokość na smartfonie, obok siebie na większych ekranach */}
          <div className="mt-8 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4">
            <a
              href="#generuj"
              className="rounded-full bg-carrot px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(255,107,53,0.55)] transition-transform hover:scale-[1.03]"
            >
              Ułóż swoją dietę
            </a>
            <a
              href="#przyklad"
              className="rounded-full border border-ink/15 px-7 py-3.5 text-center text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Zobacz przykładowy plan
            </a>
          </div>
        </div>

        {/* Prawa kolumna: Zdjęcie */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          {/* Ograniczenie wielkości obrazka na mobile, by nie zdominował całego ekranu */}
          <div className="relative w-full max-w-[320px] sm:max-w-[450px] lg:max-w-[600px]">
            <Image 
              src="/danie.webp"
              alt="Danie na stronę"
              width={600} 
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}