"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { reportSuccessfulEnquiry } from "../lib/analytics.mjs";
import crunchyrollLogo from "../public/images/brands/Crunchyroll.webp";
import fanzaiLogo from "../public/images/brands/Fanzai.webp";
import funikidoLogo from "../public/images/brands/Funikido.webp";
import contactTorii from "../public/images/contact-torii-watercolor.webp";
import "./BrandsAndContact.css";

const brands = [
  {
    name: "Crunchyroll",
    slug: "crunchyroll",
    logo: crunchyrollLogo,
  },
  {
    name: "Fanzai",
    slug: "fanzai",
    logo: fanzaiLogo,
  },
  {
    name: "Funikido",
    slug: "funikido",
    logo: funikidoLogo,
  },
];

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="bc-arrow"
    >
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Seal({ children = "縁" }) {
  return (
    <span className="bc-seal" lang="ja" aria-hidden="true">
      {children}
    </span>
  );
}

function BrandMark({ brand }) {
  return (
    <Image
      src={brand.logo}
      alt={brand.name}
      className={`bc-brandmark bc-mark-${brand.slug}`}
      sizes={brand.slug === "fanzai" ? "180px" : "240px"}
    />
  );
}

function Blossom() {
  return (
    <Image
      src="/cherry-blossom-small.webp"
      alt=""
      width={1519}
      height={450}
      sizes="(max-width: 760px) 195px, (max-width: 1100px) 310px, 540px"
      className="bc-blossom"
      aria-hidden="true"
    />
  );
}
function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const [emailLink, setEmailLink] = useState("");
  const [sending, setSending] = useState(false);
  const submitting = useRef(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const subject = data.subject.trim();
    const body = `Hi Urmi,\n\n${data.message.trim()}\n\n${data.name.trim()}\n${data.company.trim()}\nReply to: ${data.email.trim()}`;
    submitting.current = true;
    setSending(true);
    setDraft("");
    setStatus("Sending your message…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.received !== true)
        throw new Error(result.error || "Please try again.");
      setStatus(
        "Thank you! Your message has been received. I’ll be in touch soon.",
      );
      form.reset();
      reportSuccessfulEnquiry();
    } catch (error) {
      setDraft(`To: uwummie@gmail.com\nSubject: ${subject}\n\n${body}`);
      setEmailLink(
        `mailto:uwummie@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
      setStatus(
        `${error.name === "TimeoutError" ? "We couldn’t confirm receipt of your message." : error.message === "Failed to fetch" ? "Couldn’t connect. Check your connection and try again." : error.message} You can also send the email draft below.`,
      );
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("Brief copied. You can email it to uwummie@gmail.com.");
    } catch {
      setStatus(
        "Copy the brief from the text box below and email it to uwummie@gmail.com.",
      );
    }
  }

  return (
    <form className="bc-form" onSubmit={submit} aria-busy={sending}>
      <fieldset className="bc-fields" disabled={sending}>
        <div className="bc-form-pair">
          <label htmlFor={`${id}-name`}>
            Name <span>*</span>
            <input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              placeholder="What should I call you?"
              required
              maxLength={120}
            />
          </label>
          <label htmlFor={`${id}-email`}>
            Email <span>*</span>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@yourbrand.com"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label htmlFor={`${id}-company`}>
          Brand or company <span className="bc-optional">(optional)</span>
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            placeholder="The people behind the idea"
            maxLength={160}
          />
        </label>
        <label htmlFor={`${id}-subject`}>
          Subjects <span>*</span>
          <input
            id={`${id}-subject`}
            name="subject"
            placeholder="What would you like to talk about?"
            required
            maxLength={200}
          />
        </label>
        <label htmlFor={`${id}-message`}>
          Tell me a little about it <span>*</span>
          <textarea
            id={`${id}-message`}
            name="message"
            placeholder="The idea, the story, the possibilities…"
            rows={3}
            required
            maxLength={4000}
          />
        </label>
        <div className="bc-honeypot" aria-hidden="true" inert>
          <label htmlFor={`${id}-website`}>
            Leave this empty
            <input
              id={`${id}-website`}
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <button className="bc-submit" type="submit" disabled={sending}>
          <span>{sending ? "Sending…" : "Let’s make a story"}</span>
          <Arrow />
        </button>
      </fieldset>
      <p className="bc-form-note">
        Prefer a direct hello?{" "}
        <a href="mailto:uwummie@gmail.com">uwummie@gmail.com</a>
      </p>
      <output className="bc-form-status" aria-live="polite" aria-atomic="true">
        {status}
      </output>
      {draft && (
        <div className="bc-draft">
          <a href={emailLink}>
            Open email draft <Arrow />
          </a>
          <textarea
            aria-label="Your email brief"
            value={draft}
            readOnly
            rows={5}
          />
          <button type="button" onClick={copyDraft}>
            Copy brief <Arrow />
          </button>
        </div>
      )}
    </form>
  );
}

export function PortfolioFooter() {
  return (
    <footer className="bc-collaborations bc-footer">
      <Link className="bc-signature" href="/">
        Umi<Seal>海</Seal>
        <span>Anime, culture and a little wonder.</span>
      </Link>
      <div className="bc-footer-social">
        <nav aria-label="Social profiles">
          {[
            ["Instagram", "https://www.instagram.com/uwummie"],
            [
              "LinkedIn",
              "https://www.linkedin.com/in/urmi-chakraborty-809678183/",
            ],
            ["Muck Rack", "https://muckrack.com/urmi-chakraborty-1"],
            ["YouTube", "https://www.youtube.com/@uwummie"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ))}
        </nav>
        <span className="bc-footer-jp" lang="ja">
          物語はつづく。
        </span>
      </div>
    </footer>
  );
}

function Bloom() {
  return (
    <>
      <section
        id="brands"
        aria-labelledby="brands-title"
        className="bc-bloom-brands bc-section"
      >
        <div className="bc-bloom-title">
          <h2 id="brands-title">Beyond the byline</h2>
          <p>
            Bringing anime and pop culture stories to life with brands, including
            Crunchyroll, Fanzai and Funikido.
          </p>
        </div>
        <Blossom />
        <ul className="bc-bloom-grid" aria-label="Brands I’ve worked with">
          {brands.map((brand) => (
            <li key={brand.slug}>
              <BrandMark brand={brand} />
              <span className="bc-brand-caption" aria-hidden="true">
                {brand.name}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="bc-bloom-contact bc-section"
      >
        <div className="bc-contact-copy">
          <Seal>結</Seal>
          <h2 id="contact-title">
            The next chapter
            <br />
            could be <em>ours.</em>
          </h2>
          <p>
            Have a project in mind? Whether you're a brand looking to collaborate,
            a publication interested in an editorial project or a fellow creator
            with an idea, let's create something meaningful. Share your brief here.
          </p>
          <Image
            src={contactTorii}
            width={1536}
            height={1024}
            sizes="(max-width: 760px) calc(100vw - 48px), 440px"
            alt=""
            className="bc-contact-torii"
          />
        </div>
        <ContactForm />
      </section>
    </>
  );
}

export default function BrandsAndContact() {
  const root = useRef(null);

  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("bc-in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    root.current?.querySelectorAll(".bc-section").forEach((section) => {
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className="bc-collaborations" data-lenis-prevent>
      <Bloom />
    </div>
  );
}
