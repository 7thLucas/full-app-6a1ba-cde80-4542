/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TSkyPalette = {
  zenith: string;
  mid: string;
  horizon: string;
  sun: string;
  fog: string;
};

export type TGroundPalette = {
  grass: string;
  grassShadow: string;
  dirtPath: string;
  dirtUnderside: string;
  pondWater: string;
  rock: string;
};

export type TMagicPalette = {
  crystal: string;
  sparkles: string;
  fruit: string;
  fruitHighlight: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  tagline?: string;
  welcomeMessage?: string;
  skyPalette?: TSkyPalette;
  groundPalette?: TGroundPalette;
  magicPalette?: TMagicPalette;
  playerName?: string;
  villagerName?: string;
  villagerDialogue?: string;
  mailboxNote?: string;
  questSteps?: string[];
  showControlsHint?: boolean;
  showQuestBubble?: boolean;
  bloomIntensity?: number;
  sunIntensity?: number;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Driftholm",
  logoUrl: "https://images.unsplash.com/photo-1502081276748-fa1f0f3acb78?w=128&h=128&fit=crop",
  brandColor: {
    primary: "#C0408C",   // magenta sunset
    secondary: "#FF8A5C", // warm orange
    accent: "#A6E8FF",    // crystal cyan
  },
  tagline: "A cozy floating island, lit by golden hour.",
  welcomeMessage: "Take a breath. Explore.",
  skyPalette: {
    zenith: "#5B2A86",
    mid: "#C0408C",
    horizon: "#FF8A5C",
    sun: "#FFD27A",
    fog: "#E8A4C9",
  },
  groundPalette: {
    grass: "#7BC86C",
    grassShadow: "#4F8F4A",
    dirtPath: "#B58968",
    dirtUnderside: "#6E4A35",
    pondWater: "#5BB3C9",
    rock: "#8A8597",
  },
  magicPalette: {
    crystal: "#A6E8FF",
    sparkles: "#FFE0A6",
    fruit: "#FF6B5C",
    fruitHighlight: "#FFB55C",
  },
  playerName: "Wanderer",
  villagerName: "Elder Pip",
  villagerDialogue: "Welcome to Driftholm, traveler. The crystals hum louder at sunset — pick a fruit and rest a while.",
  mailboxNote: "A note flutters out: \"The wind has been gentle this week. — P\"",
  questSteps: [
    "Explore the island",
    "Talk to the villager",
    "Collect 3 fruits",
  ],
  showControlsHint: true,
  showQuestBubble: true,
  bloomIntensity: 0.9,
  sunIntensity: 1.8,
};
