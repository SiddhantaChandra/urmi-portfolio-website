"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function Icon({ name = "arrow", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      {...props}
    >
      {name === "play" ? (
        <path d="m9 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />
      ) : name === "close" ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M5 19 19 5M5 5h14v14" />
      )}
    </svg>
  );
}

export function InstagramLink({
  children = "More on Instagram",
  className = "",
}) {
  return (
    <a
      className={`reels-instagram ${className}`}
      href="https://www.instagram.com/uwummie/reels/"
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <Icon />
    </a>
  );
}

export function PublishedCover({ reel, collection }) {
  const [failedImage, setFailedImage] = useState(null);
  const title =
    reel.caption?.split("\n").find((line) => line.trim()) || "Reel by @uwummie";
  const views = Number.isSafeInteger(reel.views)
    ? `${new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(reel.views)} views`
    : null;
  return (
    <a
      className="reel-cover reel-published"
      href={reel.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${collection} reel: ${title}. Open on Instagram`}
    >
      {reel.thumbnailUrl && failedImage !== reel.thumbnailUrl ? (
        <Image
          src={reel.thumbnailUrl}
          alt=""
          fill
          unoptimized
          loading="lazy"
          decoding="async"
          sizes="(max-width: 540px) 46vw, (max-width: 900px) 28vw, 240px"
          onError={() => setFailedImage(reel.thumbnailUrl)}
        />
      ) : (
        <span className="reel-thumbnail-fallback">
          Watch on Instagram <Icon name="play" />
        </span>
      )}
      <span className="reel-published-meta">
        <span>
          {collection}
          {collection === "Popular" && views && (
            <span className="reel-published-views">{views}</span>
          )}
        </span>
        <Icon name="play" />
      </span>
      <span className="reel-preview-action">
        Watch on Instagram
        <Icon />
      </span>
    </a>
  );
}

export function Cover({ reel, onPreview, className = "", compact = false }) {
  return (
    <button
      className={`reel-cover ${className}`}
      type="button"
      onClick={() => onPreview(reel)}
      aria-label={`Preview cover: ${reel.title}`}
    >
      <Image
        src={reel.image}
        alt={`${reel.film} film still`}
        loading="lazy"
        decoding="async"
        fill
        sizes="(max-width: 540px) 46vw, (max-width: 900px) 28vw, 400px"
        style={{ objectPosition: reel.position }}
      />
      <span className="reel-shade" />
      <span className="reel-top">
        <span>{reel.film}</span>
        <Icon name="play" />
      </span>
      <span className="reel-cover-copy">
        <span>{reel.category}</span>
        <strong>{compact ? reel.short : reel.title}</strong>
      </span>
      <span className="reel-preview-action">
        Preview cover
        <Icon name="arrow" />
      </span>
    </button>
  );
}

export function PreviewDialog({ reel, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (!reel) {
      dialog.current?.close();
      return;
    }
    dialog.current.showModal();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [reel]);
  return (
    <dialog
      ref={dialog}
      className="reel-dialog"
      data-lenis-prevent=""
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      aria-labelledby="cover-preview-title"
    >
      {reel && (
        <>
          <button
            className="reel-dialog-close"
            type="button"
            aria-label="Close cover preview"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
          <div className="reel-dialog-art">
            <Image
              src={reel.image}
              alt={`${reel.film} film still`}
              fill
              sizes="(max-width: 540px) 100vw, 400px"
              style={{ "--art-position": reel.position }}
            />
          </div>
          <div className="reel-dialog-copy">
            <h2 id="cover-preview-title">{reel.title}</h2>
            <p>{reel.description}</p>
            <InstagramLink>Explore Urmi’s reels</InstagramLink>
            <small>
              Mock reel cover · {reel.film}
              <br />
              Preview artwork, not a published reel.
            </small>
          </div>
        </>
      )}
    </dialog>
  );
}
