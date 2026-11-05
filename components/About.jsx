import Image from "next/image";

const topics = [
  {
    id: "gems",
    image: "/images/hanafuda/1.webp",
    title: "Underrated Gems",
    description: "Recommendations and reviews of overlooked anime and manga.",
  },
  {
    id: "essays",
    image: "/images/hanafuda/2.webp",
    title: "Video Essays",
    description:
      "Exploring grief, philosophy, and memory in Japanese animation.",
  },
  {
    id: "storytelling",
    image: "/images/hanafuda/3.webp",
    title: "Brand Storytelling",
    description:
      "Crafting native integrations that respect viewers and celebrate pop culture.",
  },
];

export default function About() {
  return (
    <section
      id="about"
      aria-label="Topics — Hanafuda Poetry Cards"
      className="relative z-0 mt-20 py-12 sm:py-16 md:mt-14 lg:pt-20"
    >
      <div className="mx-auto max-w-lg md:max-w-6xl xl:pl-14">
        <div className="grid gap-8 md:grid-cols-3">
          {topics.map((topic) => (
            <article
              key={topic.id}
              className="group relative flex flex-col overflow-hidden rounded-xs border-[5px] border-[#181513] bg-[#fbf9f4] shadow-[0_8px_24px_rgba(24,21,19,0.08)]"
            >
              {/* Inner red lacquer hairline bezel */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border border-[#a42e40]/30 z-20"
              />

              <div className="relative h-44 w-full overflow-hidden border-b-[3px] border-[#181513] bg-[#f4ecdf]">
                <Image
                  src={topic.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 340px, (min-width: 768px) 33vw, (min-width: 512px) 502px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              <div className="flex-1 p-6">
                <h3 className="font-serif-editorial text-2xl font-normal tracking-tight text-[#181513]">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#544c41]">
                  {topic.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
