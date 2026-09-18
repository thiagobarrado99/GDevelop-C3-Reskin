// @flow
import { type I18n } from '@lingui/core';
import { APP_NAME } from '../C3Brand';
import { setC3Language } from '../C3Language';

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

// pt-BR for strings added by the reskin (they are not in the Crowdin
// catalog). Labels follow the Construct 3 pt-BR UI.
const reskinPtBr: { [string]: string } = {
  'Recent projects': 'Projetos recentes',
  'Add layer above': 'Adicionar camada acima',
  'Shared by every instance of the object.':
    'Compartilhado por todas as instâncias do objeto.',
  'Click an item to see its description.':
    'Clique em um item para ver sua descrição.',
  'Also available': 'Também disponíveis',
  'Add event': 'Adicionar evento',
  'Add comment': 'Adicionar comentário',
  'Add group': 'Adicionar grupo',
  'Add global variable': 'Adicionar variável global',
  'Include event sheet': 'Incluir folha de eventos',
  'Snap to grid': 'Alinhar ao grid',
  'Grid size': 'Tamanho do grid',
  'Grid offset': 'Deslocamento do grid',
  'Already in the events: pick this tile in Add condition / Add action.':
    'Já disponível nos eventos: escolha esta peça em Adicionar condição / Adicionar ação.',
  'Add layer below': 'Adicionar camada abaixo',
  System: 'Sistema',
  'Add another condition': 'Adicionar outra condição',
  'Add another action': 'Adicionar outra ação',
  'Insert new object': 'Inserir novo objeto',
  'Instance variable': 'Variável de instância',
  Effect: 'Efeito',
  'Send to top of layer': 'Enviar para o topo da camada',
  'Send to bottom of layer': 'Enviar para o fundo da camada',
  Lock: 'Bloquear',
  'Unlock all': 'Desbloquear tudo',
  'Lock instances on scene': 'Bloquear instâncias no layout',
  'Unlock instances on scene': 'Desbloquear instâncias no layout',
  Align: 'Alinhar',
  'Horizontal center': 'Centro horizontal',
  'Vertical center': 'Centro vertical',
  'Edit event sheet': 'Editar folha de eventos',
  'Layout properties': 'Propriedades do layout',
  'Add a condition to the selected event':
    'Adicionar uma condição ao evento selecionado',
  'Add an action to the selected event':
    'Adicionar uma ação ao evento selecionado',
  'Add an else event': 'Adicionar um evento else',
  'Add a group': 'Adicionar um grupo',
  'Pick an object to create a new condition from:':
    'Escolha um objeto para criar uma condição a partir dele:',
  'Pick an object to create a new action from:':
    'Escolha um objeto para criar uma ação a partir dele:',
  'No recent projects.': 'Nenhum projeto recente.',
  Participate: 'Participar',
  "Beginner's guide": 'Guia para iniciantes',
  'Learn how to create your first game!':
    'Aprenda como criar seu primeiro jogo!',
  Manual: 'Manual',
  'A comprehensive reference of all features':
    'Uma referência abrangente de todos os recursos',
  Tutorials: 'Tutoriais',
  'Improve your skills with helpful tutorials':
    'Melhore suas habilidades com tutoriais úteis',
  'Play games made by the community': 'Jogue jogos feitos pela comunidade',
  'Chat with other game creators': 'Converse com outros criadores de jogos',
  Forum: 'Fórum',
  'The best place to get help and advice':
    'O melhor lugar para obter ajuda e orientações',
  Examples: 'Exemplos',
  'Open an example to see how it is made':
    'Abra um exemplo para ver como ele foi feito',
  "What's new": 'Novidades',
  'See all the changes in the latest version':
    'Confira todas as mudanças da última versão',
  Website: 'Site',
  'Official GDevelop website': 'Site oficial do GDevelop',
  'Recommended examples': 'Exemplos recomendados',
  'New project': 'Novo projeto',
  'Choose preset': 'Escolha uma pré-definição',
  'Viewport size': 'Tamanho da tela',
  Orientations: 'Orientações',
  Any: 'Qualquer uma',
  'Start with': 'Começar em',
  'Event sheet': 'Folha de eventos',
  'Optimize for pixel art': 'Otimizar para pixel art',
  Custom: 'Personalizado',
  'Please enter a valid viewport size.': 'Informe um tamanho de tela válido.',
  'Retro style': 'Estilo retrô',
  'SD landscape 4:3': 'Paisagem SD 4:3',
  'SD portrait 3:4': 'Retrato SD 3:4',
  'SD landscape 16:9': 'Paisagem SD 16:9',
  'SD portrait 9:16': 'Retrato SD 9:16',
  '720p landscape': 'Paisagem 720p',
  '720p portrait': 'Retrato 720p',
  '1080p landscape': 'Paisagem 1080p',
  '1080p portrait': 'Retrato 1080p',
  '4K landscape': 'Paisagem 4K',
  '4K portrait': 'Retrato 4K',
  'Local file': 'Arquivo local',
  'Start page': 'Página inicial',
  Debug: 'Depurar',
  Export: 'Exportar',
  'Open recent': 'Abrir recente',
  'Project bar': 'Barra do projeto',
  'Example browser': 'Explorar exemplos',
  About: 'Sobre',
  'Use "Open" and pick the file again.':
    'Use "Abrir" e escolha o arquivo novamente.',
  'The file could not be written. Check the permission you were asked for, or use "Save as".':
    'Não foi possível gravar o arquivo. Verifique a permissão solicitada ou use "Salvar como".',
};
const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exactRules = (translations: { [string]: string }): Array<Rule> =>
  Object.keys(translations).map(source => [
    new RegExp('^' + escapeRegExp(source) + '$'),
    translations[source],
  ]);

// Order matters: article/gender-aware phrases first, bare nouns last.
const rulesByLanguage: { [string]: Array<Rule> } = {
  en: [
    // Whole-string labels, as named in Construct 3.
    [/^Untitled scene$/, 'Layout 1'],
    [/^Untitled external events$/, 'Event sheet 1'],
    [/^Base layer$/, 'Layer 0'],
    [/^Share$/, 'Export'],
    [/^Add a new event$/, 'Add event'],
    // Event types, as Construct's "Add..." menu names them.
    [/^Standard event$/, 'Event'],
    [/^New Event Below$/, 'Event'],
    [/^Sub Event$/, 'Sub-event'],
    [/^Event group$/, 'Group'],
    [/^Link external events$/, 'Include event sheet'],
    // Behaviour names as Construct calls them: the ground is "Solid", the
    // character is "Platform" (order matters: Platform → Solid first).
    [/^Platform$/, 'Solid'],
    [/^Platformer character$/, 'Platform'],
    [/^Jumpthru platform$/, 'Jump-thru'],
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
    ...exactRules(reskinPtBr),
    // Whole-string labels, as named in Construct 3 (pt-BR).
    [/^Cena sem título$/, 'Layout 1'],
    [/^Mostrar grade$/, 'Exibir grid'],
    [/^Configurações do jogo$/, 'Propriedades do projeto'],
    [/^Recursos$/, 'Arquivos do projeto'],
    // Objects and families are project-wide by default (parity guide A6).
    [/^Objetos Globais$/, 'Tipos de objeto'],
    [/^Objetos da Cena$/, 'Tipos de objeto deste layout'],
    [/^Grupos Globais$/, 'Famílias'],
    [/^Grupos de Cenas$/, 'Famílias deste layout'],
    [
      /^Comece adicionando um novo grupo\.$/,
      'Comece adicionando uma nova família.',
    ],
    [/^Criar um novo grupo$/, 'Criar uma nova família'],
    [/^Nome do grupo$/, 'Nome da família'],
    [/^Editar grupo$/, 'Editar família'],
    [/^Adicionar um novo grupo(\.\.\.)?$/, 'Adicionar uma nova família$1'],
    [/^Eventos externos sem título$/, 'Folha de eventos 1'],
    [/^Camada base$/, 'Camada 0'],
    [/^Compartilhar$/, 'Exportar'],
    [/^Plataforma$/, 'Sólido'],
    [/^Personagem de plataforma$/, 'Plataforma'],
    [/^Plataforma atravessável$/, 'Atravessável'],
    [/^Projecto$/, 'Projeto'],
    [/^Exibição$/, 'Exibir'],
    [/^Concluído$/, 'Pronto'],
    [/^Adicionar um novo evento$/, 'Adicionar evento'],
    [/^Evento padrão$/, 'Evento'],
    [/^Novo Evento Abaixo$/, 'Evento'],
    [/^Sub Evento$/, 'Sub-evento'],
    [/^Grupo de eventos$/, 'Grupo'],
    [/^Vincular eventos externos$/, 'Incluir folha de eventos'],
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
    r(/\bnesta cena\b/gi, 'neste layout'),
    r(/\bdesta cena\b/gi, 'deste layout'),
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
    // eventos externos (m.) → folhas de eventos (f.)
    r(/\bnovos eventos externos\b/gi, 'novas folhas de eventos'),
    r(/\bos eventos externos\b/gi, 'as folhas de eventos'),
    r(/\bdos eventos externos\b/gi, 'das folhas de eventos'),
    r(/\bnos eventos externos\b/gi, 'nas folhas de eventos'),
    r(/\beventos externos\b/gi, 'folhas de eventos'),
    r(/\bum novo evento externo\b/gi, 'uma nova folha de eventos'),
    r(/\bnovo evento externo\b/gi, 'nova folha de eventos'),
    r(/\bum evento externo\b/gi, 'uma folha de eventos'),
    r(/\bo evento externo\b/gi, 'a folha de eventos'),
    r(/\bdo evento externo\b/gi, 'da folha de eventos'),
    r(/\bno evento externo\b/gi, 'na folha de eventos'),
    r(/\bevento externo\b/gi, 'folha de eventos'),
    r(/\bgerenciador de projetos?\b/gi, 'barra do projeto'),
  ],
};

// The app name, in every language (URLs are lowercase and untouched).
const brandRules: Array<Rule> = [
  [/\bGDevelop 5\b/g, APP_NAME],
  [/\bGDevelop\b/g, APP_NAME],
];

const SHIELD = String.fromCharCode(1);
const SHIELDED = new RegExp(SHIELD + '(\\d+)' + SHIELD, 'g');

/**
 * Patch `i18n._` so every translated string goes through the terminology
 * rules. Interpolated values (object names, numbers…) are shielded so that
 * user content is never rewritten.
 */
export const applyC3Terminology = (i18n: I18n) => {
  setC3Language(i18n.language);
  const rules = [
    ...(rulesByLanguage[i18n.language.replace('-', '_')] || []),
    ...brandRules,
  ];

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
