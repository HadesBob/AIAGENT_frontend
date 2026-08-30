import Image from "next/image";


export default function Hero() {
  return (
    <section className="px-6 pt-4 pb-20 bg-green-100 sm:pt-20 sm:pb-28">
      <div className="flex justify-between px-50 w-screen ">
       
        <div>
          <p className="eyebrow text-olive mb-5">Generator diet napędzany AI</p>
          <h1 className="font-headline text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.02] text-black/80">
            <span className="text-brand-orange bg-black/80 font-display px-5 rounded-lg">Ułóż i kontroluj</span>
                <br />
            swoją dietę.
          </h1>
          
          <p className="mt-6 max-w-lg text-xl text-black/65">
            Podaj cel, wagę i to, czego nie jadasz. W trzy minuty dostajesz
            plan posiłków z listą zakupów i dokładnym rozkładem
            makroskładników — dopasowany, nie uśredniony.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#generuj"
              className="rounded-full bg-carrot px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(255,107,53,0.55)] transition-transform hover:scale-[1.03]"
            >
              Ułóż swoją dietę
            </a>
            <a
              href="#przyklad"
              className="rounded-full border border-ink/15 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Zobacz przykładowy plan
            </a>
          </div>

    
        </div>

        <div>
            <Image 
                src="/danie.webp"
                alt="Danie na stronę"
                width={600} 
                height={600}
            />

        </div>
      </div>
    </section>
  );
}