// @flow
import { type I18n } from '@lingui/core';

// c3: make the editor speak Construct 3 vocabulary (see the terminology map
// in CLAUDE.md) by rewriting translated strings at runtime, so the
// Crowdin-managed catalogs stay untouched and upstream-mergeable.

type Rule = [RegExp, string | ((match: string) => string)];

// Keep the capitalisation of the matched text on the replacement.
const r = (regex: RegExp, to: string): Rule => [
  regex,
  (match: string) =>
    match[0] === match[0].toUpperCase()
      ? to[0].toUpperCase() + to.slice(1)
      : to,
];

// Order matters: article/gender-aware phrases first, bare nouns last.
const rulesByLanguage: { [string]: Array<Rule> } = {
  en: [
    // Whole-string labels, as named in Construct 3.
    [/^Untitled scene$/, 'Layout 1'],
    [/^Untitled external events$/, 'Event sheet 1'],
    [/^Base layer$/, 'Layer 0'],
    [/^Share$/, 'Export'],
    r(/\bscenes\b/gi, 'layouts'),
    r(/\bscene\b/gi, 'layout'),
    r(/\bobject groups\b/gi, 'families'),
    r(/\bobject group\b/gi, 'family'),
    r(/\bobject variables\b/gi, 'instance variables'),
    r(/\bobject variable\b/gi, 'instance variable'),
    r(/\bexternal events\b/gi, 'event sheets'),
    r(/\bproject manager\b/gi, 'project bar'),
  ],
  pt_BR: [
    // Whole-string labels, as named in Construct 3 (pt-BR).
    [/^Cena sem título$/, 'Layout 1'],
    [/^Eventos externos sem título$/, 'Folha de eventos 1'],
    [/^Camada base$/, 'Camada 0'],
    [/^Compartilhar$/, 'Exportar'],
    // cena (f.) → layout (m.)
    r(/\bnovas cenas\b/gi, 'novos layouts'),
    r(/\btodas as cenas\b/gi, 'todos os layouts'),
    r(/\bas cenas\b/gi, 'os layouts'),
    r(/\bdas cenas\b/gi, 'dos layouts'),
    r(/\bnas cenas\b/gi, 'nos layouts'),
    r(/\bpelas cenas\b/gi, 'pelos layouts'),
    r(/\bcenas\b/gi, 'layouts'),
    r(/\buma nova cena\b/gi, 'um novo layout'),
    r(/\ba nova cena\b/gi, 'o novo layout'),
    r(/\bnova cena\b/gi, 'novo layout'),
    r(/\buma cena\b/gi, 'um layout'),
    r(/\ba cena\b/gi, 'o layout'),
    r(/à cena\b/gi, 'ao layout'),
    r(/\bda cena\b/gi, 'do layout'),
    r(/\bna cena\b/gi, 'no layout'),
    r(/\bpela cena\b/gi, 'pelo layout'),
    r(/\besta cena\b/gi, 'este layout'),
    r(/\bessa cena\b/gi, 'esse layout'),
    r(/\baquela cena\b/gi, 'aquele layout'),
    r(/\bmesma cena\b/gi, 'mesmo layout'),
    r(/\bna minha cena\b/gi, 'no meu layout'),
    r(/\bda minha cena\b/gi, 'do meu layout'),
    r(/\bna sua cena\b/gi, 'no seu layout'),
    r(/\bda sua cena\b/gi, 'do seu layout'),
    r(/\bminha cena\b/gi, 'meu layout'),
    r(/\bsua cena\b/gi, 'seu layout'),
    r(/\btoda a cena\b/gi, 'todo o layout'),
    r(/\boutra cena\b/gi, 'outro layout'),
    r(/\bnenhuma cena\b/gi, 'nenhum layout'),
    r(/\bprimeira cena\b/gi, 'primeiro layout'),
    r(/última cena\b/gi, 'último layout'),
    r(/\bcena selecionada\b/gi, 'layout selecionado'),
    r(/\bcena ativa\b/gi, 'layout ativo'),
    r(/\bcena pausada\b/gi, 'layout pausado'),
    r(/\bcena\b/gi, 'layout'),
    // "layout pausada" / "layout for carregada" → masculine participle.
    [
      /(\blayouts?\b(?: _PARAM\d+_)?(?: (?:for|é|foi|está|será|seja|sendo|estiver))?) (\S{2,}?)(ad|id)a(s?)\b/gi,
      '$1 $2$3o$4',
    ],
    [/(\blayouts?\b) inteira(s?)\b/gi, '$1 inteiro$2'],
    // grupo de objetos (m.) → família (f.)
    r(/\bnovos grupos de objetos\b/gi, 'novas famílias'),
    r(/\bos grupos de objetos\b/gi, 'as famílias'),
    r(/\bdos grupos de objetos\b/gi, 'das famílias'),
    r(/\bnos grupos de objetos\b/gi, 'nas famílias'),
    r(/\bgrupos de objetos\b/gi, 'famílias'),
    r(/\bum novo grupo de objetos\b/gi, 'uma nova família'),
    r(/\bo novo grupo de objetos\b/gi, 'a nova família'),
    r(/\bnovo grupo de objetos\b/gi, 'nova família'),
    r(/\bum grupo de objetos\b/gi, 'uma família'),
    r(/\bo grupo de objetos\b/gi, 'a família'),
    r(/\bao grupo de objetos\b/gi, 'à família'),
    r(/\bdo grupo de objetos\b/gi, 'da família'),
    r(/\bno grupo de objetos\b/gi, 'na família'),
    r(/\beste grupo de objetos\b/gi, 'esta família'),
    r(/\besse grupo de objetos\b/gi, 'essa família'),
    r(/\bgrupo de objetos\b/gi, 'família'),
    // variáveis de objeto → de instância
    r(/\bvariáveis de objetos?\b/gi, 'variáveis de instância'),
    r(/\bvariável de objetos?\b/gi, 'variável de instância'),
    // eventos externos → folhas de eventos
    r(/\beventos externos\b/gi, 'folhas de eventos'),
    r(/\bevento externo\b/gi, 'folha de eventos'),
    r(/\bgerenciador de projetos?\b/gi, 'barra do projeto'),
  ],
};

const SHIELD = String.fromCharCode(1);
const SHIELDED = new RegExp(SHIELD + '(\\d+)' + SHIELD, 'g');

/**
 * Patch `i18n._` so every translated string goes through the terminology
 * rules. Interpolated values (object names, numbers…) are shielded so that
 * user content is never rewritten.
 */
export const applyC3Terminology = (i18n: I18n) => {
  const rules = rulesByLanguage[i18n.language.replace('-', '_')];
  if (!rules) return;

  const cache: Map<string, string> = new Map();
  const rewrite = (text: string): string => {
    const cached = cache.get(text);
    if (cached !== undefined) return cached;
    const result = rules.reduce(
      // $FlowFixMe[incompatible-call] - String.replace accepts a function.
      (s, [regex, to]) => s.replace(regex, to),
      text
    );
    if (cache.size > 5000) cache.clear();
    cache.set(text, result);
    return result;
  };

  // $FlowFixMe[method-unbinding] - we re-bind it right below.
  const original = i18n._.bind(i18n);
  // $FlowFixMe[cannot-write] - deliberately patching the instance method.
  i18n._ = (id: any, values: any, options: any) => {
    const shielded = [];
    const shield = (object: any) => {
      if (!object || typeof object !== 'object') return object;
      const safe: { [string]: any } = {};
      for (const key of Object.keys(object)) {
        const value = object[key];
        safe[key] =
          typeof value === 'string'
            ? SHIELD + (shielded.push(value) - 1) + SHIELD
            : value;
      }
      return safe;
    };
    // `id` can be a message descriptor ({ id, values, ... }).
    const safeId =
      id && typeof id === 'object' ? { ...id, values: shield(id.values) } : id;
    const translated = original(safeId, shield(values), options);
    if (typeof translated !== 'string') return translated;
    return rewrite(translated).replace(
      SHIELDED,
      (_, index) => shielded[Number(index)]
    );
  };
};
