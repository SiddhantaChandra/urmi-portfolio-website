"use client";

import Image from "next/image";
import About from "./About";
import SakuraBranch from "./SakuraBranch";

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const exactNumber = new Intl.NumberFormat("en-US");

function InstagramStat({ label, count }) {
  const exact = count == null ? "Unavailable" : exactNumber.format(count);
  return (
    <div className="instagram-stat">
      <dt>{label}</dt>
      <dd title={exact}>
        <span aria-hidden="true">
          {count == null ? "—" : compactNumber.format(count)}
        </span>
        <span className="sr-only">{exact}</span>
      </dd>
    </div>
  );
}

export default function Hero({ onOpenCollaboration, stats }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-paper relative isolate min-h-svh overflow-x-clip px-6 pt-12 text-[#1c1917] sm:px-10 sm:pt-16"
    >
      <div className="relative mx-auto grid max-w-lg grid-cols-1 gap-y-6 md:max-w-6xl md:grid-cols-[2rem_minmax(0,1fr)_minmax(0,0.82fr)] md:grid-rows-[1fr_auto_1fr] md:gap-x-6 lg:gap-x-10">
        <p
          lang="ja"
          className="hidden self-center border-r border-[#dfd7ca] pr-3 font-kanji text-sm tracking-[0.24em] text-[#695e52] [writing-mode:vertical-rl] md:col-start-1 md:row-span-3 md:row-start-1 md:block"
        >
          物語の奥深さを、言葉と映像で紡ぐ。
        </p>

        <div className="row-start-2 flex items-start gap-4 md:col-start-2 md:row-start-1 md:self-end">
          <h1
            id="hero-title"
            className="font-serif-editorial text-[clamp(3.75rem,8vw,6rem)] leading-[0.95] tracking-[-0.03em]"
          >
            Urmi
          </h1>
          <span
            aria-hidden="true"
            className="mt-1 grid size-8 shrink-0 place-items-center border border-[#a42e40] font-kanji text-sm text-[#a42e40] sm:mt-2"
          >
            望
          </span>
        </div>

        <p className="row-start-3 max-w-[34ch] font-serif-editorial text-xl leading-snug text-[#3d3830] sm:text-2xl lg:text-[1.75rem] md:col-start-2 md:row-start-2">
          Hey! I&apos;m Urmi, the creator behind{" "}
          <a
            href="https://www.instagram.com/uwummie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a42e40] underline decoration-[#a42e40]/50 underline-offset-4 hover:decoration-[#a42e40] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a42e40]"
          >
            @uwummie
          </a>
          , where I explore anime through thoughtful storytelling and engaging
          content.
        </p>

        <div className="relative z-10 row-start-4 self-stretch md:col-start-2 md:row-start-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={onOpenCollaboration}
              className="min-h-11 cursor-pointer bg-[#a42e40] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#842434] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a42e40]"
            >
              Work with me
            </button>
          </div>
          <figure className="instagram-stats" aria-label="Instagram statistics">
            <Image
              src="/images/instagram stats.webp"
              alt=""
              width={800}
              height={176}
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 44vw, (min-width: 448px) 400px, calc(100vw - 3rem)"
              className="block h-auto w-full"
            />
            <dl className="instagram-stats-values font-serif-editorial">
              <InstagramStat label="Followers" count={stats?.followers} />
              <InstagramStat label="30-day views" count={stats?.views} />
            </dl>
          </figure>
        </div>
        <div className="row-start-1 mb-36 w-full max-w-[22rem] md:mb-0 md:col-start-3 md:row-span-3 md:row-start-1 md:justify-self-end">
          <div className="hero-portrait-frame relative">
            <div className="hero-portrait relative aspect-[6/5] w-full max-w-[22rem] overflow-hidden bg-[#e9dfd0]">
              <Image
                src="/images/profile.png"
                alt="Urmi standing among greenery"
                fill
                sizes="(max-width: 400px) calc(100vw - 3rem), (min-width: 768px) and (max-width: 960px) 37vw, 352px"
                className="object-cover object-[center_18%]"
                preload
              />
            </div>
            <SakuraBranch />
          </div>
        </div>
      </div>
      <About />
    </section>
  );
}
