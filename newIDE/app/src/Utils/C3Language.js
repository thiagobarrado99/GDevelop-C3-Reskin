// @flow
// c3: the UI language, for the tables that carry en / pt-BR values outside
// lingui (Construct tile labels and default names). Set when a language is
// loaded (see applyC3Terminology).
let current = 'pt_BR';

export const setC3Language = (language: string) => {
  current = language.replace('-', '_');
};
export const getC3Language = (): string => current;
export const c3Label = (
  label: {| en: string, pt_BR: string |},
  language?: string
): string =>
  (language || current).replace('-', '_') === 'pt_BR' ? label.pt_BR : label.en;

// Default identifiers in the UI language (no accents, Construct's names).
export const c3DefaultName = (label: {| en: string, pt_BR: string |}): string =>
  c3Label(label);
export const C3_DEFAULT_NAMES = {
  variable: { en: 'Variable', pt_BR: 'Variavel' },
  effect: { en: 'Effect', pt_BR: 'Efeito' },
  group: { en: 'Group', pt_BR: 'Familia' },
};
