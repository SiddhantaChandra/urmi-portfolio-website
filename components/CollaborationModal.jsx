"use client";

import { useId, useState } from "react";

export default function CollaborationModal({ isOpen, onClose }) {
  const formId = useId();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Reel + Story Collaboration ($85)",
    budget: "$85 - $250",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#f8f5ee] border border-[#d6cbba] rounded-sm shadow-2xl p-6 sm:p-8 text-[#1c1917] overflow-hidden">
        {/* Subtle decorative Hanko watermark */}
        <div className="absolute top-4 right-14 w-12 h-12 border border-[#b83b4b]/20 rounded-sm flex items-center justify-center text-[#b83b4b]/20 font-kanji font-bold text-2xl select-none pointer-events-none">
          麗
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#786f62] hover:text-[#1c1917] p-2 rounded-sm hover:bg-[#eee8db] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-[#2f6f4f]/10 border border-[#2f6f4f]/30 rounded-full flex items-center justify-center mx-auto text-[#2f6f4f]">
              <svg
                aria-hidden="true"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-serif-editorial text-[#1c1917]">
              Dispatch Received
            </h3>
            <p className="text-[#544c41] max-w-sm mx-auto text-sm leading-relaxed">
              Thank you! Urmi reviews partnership proposals personally and will
              respond to{" "}
              <span className="text-[#b83b4b] font-mono font-semibold">
                {formData.email || "you"}
              </span>{" "}
              within 24–48 hours.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#1c1917] text-[#f8f5ee] font-medium text-xs tracking-wider uppercase rounded-sm hover:bg-[#b83b4b] transition-all cursor-pointer"
              >
                Return to Portfolio
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 space-y-1">
              <div className="text-[11px] font-mono tracking-widest text-[#b83b4b] uppercase font-semibold">
                {"Partnership Inquiry // 提携お問い合わせ"}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-editorial text-[#1c1917] font-normal">
                Collaborate with Urmi
              </h2>
              <p className="text-[#786f62] text-xs sm:text-sm">
                Send project details through this form or write directly to{" "}
                <a
                  href="mailto:uwummie@gmail.com"
                  className="text-[#b83b4b] underline underline-offset-4 font-semibold"
                >
                  uwummie@gmail.com
                </a>
                .
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="block text-[11px] font-mono text-[#786f62] mb-1 uppercase"
                  >
                    Your Name
                  </label>
                  <input
                    id={`${formId}-name`}
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Studio / Brand Contact"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#f0ebe0] border border-[#d6cbba] text-[#1c1917] placeholder-[#a09484] focus:border-[#b83b4b] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${formId}-email`}
                    className="block text-[11px] font-mono text-[#786f62] mb-1 uppercase"
                  >
                    Email Address
                  </label>
                  <input
                    id={`${formId}-email`}
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="contact@brand.com"
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#f0ebe0] border border-[#d6cbba] text-[#1c1917] placeholder-[#a09484] focus:border-[#b83b4b] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`${formId}-service`}
                    className="block text-[11px] font-mono text-[#786f62] mb-1 uppercase"
                  >
                    Package / Deliverable
                  </label>
                  <select
                    id={`${formId}-service`}
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#f0ebe0] border border-[#d6cbba] text-[#1c1917] focus:border-[#b83b4b] focus:outline-none transition-colors"
                  >
                    <option value="Reel + Story Collaboration ($85)">
                      Instagram Reel + Story (Featured: $85)
                    </option>
                    <option value="Dedicated Video Essay">
                      Dedicated In-Depth Video Essay
                    </option>
                    <option value="Anime / Manga Review">
                      Anime & Manga Recommendation / Review
                    </option>
                    <option value="Brand Ambassadorship">
                      Long-term Ambassadorship
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`${formId}-budget`}
                    className="block text-[11px] font-mono text-[#786f62] mb-1 uppercase"
                  >
                    Estimated Budget
                  </label>
                  <select
                    id={`${formId}-budget`}
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-sm bg-[#f0ebe0] border border-[#d6cbba] text-[#1c1917] focus:border-[#b83b4b] focus:outline-none transition-colors"
                  >
                    <option value="$85 - $150">$85 – $150 (Base rate)</option>
                    <option value="$150 - $350">$150 – $350</option>
                    <option value="$350 - $800">$350 – $800</option>
                    <option value="$800+">$800+ (Multi-piece campaign)</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-message`}
                  className="block text-[11px] font-mono text-[#786f62] mb-1 uppercase"
                >
                  Project & Timeline Details
                </label>
                <textarea
                  id={`${formId}-message`}
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell Urmi about the story, series, or product you'd like to feature..."
                  className="w-full px-3.5 py-2.5 rounded-sm bg-[#f0ebe0] border border-[#d6cbba] text-[#1c1917] placeholder-[#a09484] focus:border-[#b83b4b] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-[#786f62] font-mono">
                  Standard Rate:{" "}
                  <span className="text-[#b83b4b] font-bold">
                    $85 (Reel + Story)
                  </span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#b83b4b] hover:bg-[#962635] text-white font-medium text-xs tracking-wider uppercase rounded-sm shadow-sm transition-all cursor-pointer"
                >
                  Send Partnership Dispatch
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
