export interface HeroSlide {
  id: string;
  type: "welcome" | "promo";
  eyebrow: string;
  headlineLine1: string;
  headlineLine2?: string;       // rendered in brand orange
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: {
    src: string;                // transparent PNG/WebP cutout or high quality product image
    alt: string;
  };
  isActive: boolean;
  order: number;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-welcome",
    type: "welcome",
    eyebrow: "WELCOME TO YANKEE GADGETS",
    headlineLine1: "Your Trusted Gadget Store",
    headlineLine2: "in Ikeja, Lagos",
    body: "Phones, earbuds, accessories, gaming consoles and more — all in one place, with fast delivery across Lagos and nationwide.",
    primaryCta: { label: "Shop All", href: "/shop" },
    secondaryCta: { label: "Visit Our Store", href: "/contact" },
    isActive: true,
    order: 1,
  },
  {
    id: "slide-ps5",
    type: "promo",
    eyebrow: "NEW ARRIVAL",
    headlineLine1: "PLAYSTATION 5",
    headlineLine2: "SLIM EDITION",
    body: "Experience lightning-fast loading, deeper immersion, and an all-new generation of incredible games. Get the best rates in Nigeria.",
    primaryCta: { label: "Buy Now", href: "/shop/consoles" },
    secondaryCta: { label: "Explore Store", href: "/shop" },
    image: {
      src: "/ps5_black_bg_1784215126064.png",
      alt: "PlayStation 5 Slim Edition",
    },
    isActive: true,
    order: 2,
  },
  {
    id: "slide-iphone",
    type: "promo",
    eyebrow: "BEST SELLER",
    headlineLine1: "IPHONE 15 PRO MAX",
    headlineLine2: "TITANIUM DESIGN",
    body: "Forged in titanium and featuring the groundbreaking A17 Pro chip, customizable Action button, and a powerful camera system.",
    primaryCta: { label: "Shop Apple", href: "/shop/phones" },
    secondaryCta: { label: "Compare Specs", href: "/shop" },
    image: {
      src: "/iphone_cutout_1784215086181.png",
      alt: "iPhone 15 Pro Max Titanium",
    },
    isActive: true,
    order: 3,
  },
];
