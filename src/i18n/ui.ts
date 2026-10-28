// Interface strings. Every language must define every key: a missing
// translation is a type error caught by `astro check`.

export const languages = { en: "English", it: "Italiano" } as const;
export type Lang = keyof typeof languages;

const en = {
  "meta.locale": "en_GB",
  skipLink: "Skip to content",
  languageNav: "Language",
  "links.label": "Profiles and CV",
  "links.linkedin": "LinkedIn profile",
  "links.github": "GitHub profile",
  "links.cv": "Download CV (PDF)",
  "intro.heading": "About",
  "footer.built": "Built on",
  "footer.source": "Source on GitHub",
};

type UIStrings = Record<keyof typeof en, string>;

// Draft translations, pending owner review.
const it: UIStrings = {
  "meta.locale": "it_IT",
  skipLink: "Vai al contenuto",
  languageNav: "Lingua",
  "links.label": "Profili e CV",
  "links.linkedin": "Profilo LinkedIn",
  "links.github": "Profilo GitHub",
  "links.cv": "Scarica il CV (PDF)",
  "intro.heading": "Profilo",
  "footer.built": "Generato il",
  "footer.source": "Codice sorgente su GitHub",
};

export const ui: Record<Lang, UIStrings> = { en, it };

export const dateLocale: Record<Lang, string> = { en: "en-GB", it: "it-IT" };
