// Interface strings. Every language must define every key: a missing
// translation is a type error caught by `astro check`.

export const languages = { en: "English", it: "Italiano" } as const;
export type Lang = keyof typeof languages;

const en = {
  "meta.locale": "en_GB",
  skipLink: "Skip to content",
  languageNav: "Language",
  "links.label": "Profiles and CV",
  "links.linkedin": "LinkedIn",
  "links.github": "GitHub",
  "links.website": "Website",
  "links.cv": "Download CV (PDF)",
  "now.since": "since",
  "facts.label": "Key results",
  "intro.heading": "About",
  "pipeline.heading": "Career pipeline",
  "pipeline.parallel": "Parallel stages",
  "pipeline.next": "Pipeline continues",
  "status.success": "Completed",
  "status.running": "Current role",
  "status.pending": "Next",
  "step.present": "Present",
  "step.details": "Details",
  "stage.technologies": "Technologies",
  "skills.heading": "Skills",
  "credentials.heading": "Certifications & Languages",
  "credentials.certifications": "Certifications",
  "credentials.languages": "Languages",
  "contact.heading": "Contact",
};

type UIStrings = Record<keyof typeof en, string>;

// Italian strings reviewed and approved by the owner.
const it: UIStrings = {
  "meta.locale": "it_IT",
  skipLink: "Vai al contenuto",
  languageNav: "Lingua",
  "links.label": "Profili e CV",
  "links.linkedin": "LinkedIn",
  "links.github": "GitHub",
  "links.website": "Sito web",
  "links.cv": "Scarica il CV (PDF)",
  "now.since": "da",
  "facts.label": "Risultati principali",
  "intro.heading": "Profilo",
  "pipeline.heading": "Pipeline di carriera",
  "pipeline.parallel": "Fasi in parallelo",
  "pipeline.next": "La pipeline continua",
  "status.success": "Completato",
  "status.running": "Ruolo attuale",
  "status.pending": "Prossimo passo",
  "step.present": "Oggi",
  "step.details": "Dettagli",
  "stage.technologies": "Tecnologie",
  "skills.heading": "Competenze",
  "credentials.heading": "Certificazioni e lingue",
  "credentials.certifications": "Certificazioni",
  "credentials.languages": "Lingue",
  "contact.heading": "Contatti",
};

export const ui: Record<Lang, UIStrings> = { en, it };

/** Content that is either the same in every language or given per language. */
export function localize(
  value: string | Record<Lang, string>,
  lang: Lang,
): string {
  return typeof value === "string" ? value : value[lang];
}
