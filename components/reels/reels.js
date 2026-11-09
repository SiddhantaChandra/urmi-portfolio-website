import chihiro from "./assets/chihiro.webp";
import howl from "./assets/howl.webp";
import karigurashi from "./assets/karigurashi.webp";
import majo from "./assets/majo.webp";
import mimi from "./assets/mimi.webp";
import mononoke from "./assets/mononoke.webp";
import ponyo from "./assets/ponyo.webp";
import totoro from "./assets/totoro.webp";

export const reels = [
  {
    id: "quiet-magic",
    title: "The quiet magic of growing up.",
    short: "The quiet magic",
    category: "Coming of age",
    film: "Spirited Away",
    image: chihiro,
    position: "48% center",
    description:
      "On the little moments that make an unfamiliar world feel like home.",
  },
  {
    id: "world",
    title: "A world worth protecting.",
    short: "A world worth protecting",
    category: "Beyond the story",
    film: "Princess Mononoke",
    image: mononoke,
    position: "57% center",
    description:
      "Looking a little closer at the complicated relationship between people and the natural world.",
  },
  {
    id: "love",
    title: "Love, in the little things.",
    short: "Love, in the little things",
    category: "Character study",
    film: "Howl’s Moving Castle",
    image: howl,
    position: "54% center",
    description:
      "Sometimes the smallest act of kindness says more than a grand declaration.",
  },
  {
    id: "small",
    title: "Small things. Entire worlds.",
    short: "Entire little worlds",
    category: "Hidden gems",
    film: "Arrietty",
    image: karigurashi,
    position: "45% center",
    description:
      "A different perspective on the ordinary things we so often walk past.",
  },
  {
    id: "magic",
    title: "Finding your own kind of magic.",
    short: "Your own kind of magic",
    category: "Coming of age",
    film: "Kiki’s Delivery Service",
    image: majo,
    position: "52% center",
    description:
      "A gentle reminder that losing your way can be part of finding your voice.",
  },
  {
    id: "attention",
    title: "The art of paying attention.",
    short: "The art of attention",
    category: "Small observations",
    film: "My Neighbor Totoro",
    image: totoro,
    position: "52% center",
    description:
      "What happens when a story gives us permission to slow down and simply look?",
  },
  {
    id: "dreamers",
    title: "For the dreamers among us.",
    short: "For the dreamers",
    category: "Character study",
    film: "Whisper of the Heart",
    image: mimi,
    position: "44% center",
    description:
      "For anyone who has ever wondered whether the thing they love is worth pursuing.",
  },
  {
    id: "ocean",
    title: "An ocean of little feelings.",
    short: "An ocean of feelings",
    category: "Small observations",
    film: "Ponyo",
    image: ponyo,
    position: "57% center",
    description:
      "A small story about the wonderfully big way the world feels when you are young.",
  },
  {
    id: "home",
    title: "Somewhere that feels like home.",
    short: "A feeling called home",
    category: "Beyond the story",
    film: "Spirited Away",
    image: chihiro,
    position: "60% center",
    description:
      "The places we leave, the people we meet, and the bits of ourselves we bring back.",
  },
  {
    id: "wonder",
    title: "Leave a little room for wonder.",
    short: "A little room for wonder",
    category: "Hidden gems",
    film: "My Neighbor Totoro",
    image: totoro,
    position: "40% center",
    description:
      "The joy of finding something extraordinary in a very ordinary afternoon.",
  },
];

// Layout fixtures, not verified publication dates or performance rankings.
export const wallReels = [
  { ...reels[3], collection: "Recent" },
  { ...reels[4], collection: "Popular" },
  { ...reels[7], collection: "Recent" },
  { ...reels[5], collection: "Popular" },
  { ...reels[1], collection: "Recent" },
  { ...reels[6], collection: "Popular" },
];
