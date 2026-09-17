// @flow
import { setupI18n } from '@lingui/core';
import { applyC3Terminology } from './C3Terminology';

const makeI18n = (language: string, messages: { [string]: string }) => {
  const i18n = setupI18n({
    language,
    catalogs: { [language]: { messages } },
  });
  applyC3Terminology(i18n);
  return i18n;
};

describe('applyC3Terminology', () => {
  it('names the platformer behaviours like Construct', () => {
    const en = makeI18n('en', {});
    expect(en._('Platform')).toBe('Solid');
    expect(en._('Platformer character')).toBe('Platform');
    expect(en._('Jumpthru platform')).toBe('Jump-thru');
    const pt = makeI18n('pt_BR', {
      Platform: 'Plataforma',
      'Platformer character': 'Personagem de plataforma',
      'Jumpthru platform': 'Plataforma atravessável',
    });
    expect(pt._('Platform')).toBe('Sólido');
    expect(pt._('Platformer character')).toBe('Plataforma');
    expect(pt._('Jumpthru platform')).toBe('Atravessável');
  });

  it('names the event sheet entries like Construct', () => {
    const en = makeI18n('en', {});
    expect(en._('Add a new event')).toBe('Add event');
    expect(en._('Standard event')).toBe('Event');
    expect(en._('Link external events')).toBe('Include event sheet');
    expect(en._('Pick an object to create a new action from:')).toBe(
      'Pick an object to create a new action from:'
    );
    const pt = makeI18n('pt_BR', {
      'Add a new event': 'Adicionar um novo evento',
      'Standard event': 'Evento padrão',
      'Link external events': 'Vincular eventos externos',
      Done: 'Concluído',
    });
    expect(pt._('Add a new event')).toBe('Adicionar evento');
    expect(pt._('Standard event')).toBe('Evento');
    expect(pt._('Link external events')).toBe('Incluir folha de eventos');
    expect(pt._('Done')).toBe('Pronto');
    expect(pt._('System')).toBe('Sistema');
  });

  it('rewrites English terms keeping capitalisation', () => {
    const i18n = makeI18n('en', {});
    expect(i18n._('Scene')).toBe('Layout');
    expect(i18n._('Add a new scene')).toBe('Add a new layout');
    expect(i18n._('Object groups')).toBe('Families');
    expect(i18n._('Edit object variables')).toBe('Edit instance variables');
    expect(i18n._('External events')).toBe('Event sheets');
    expect(i18n._('Project manager')).toBe('Project bar');
  });

  it('rewrites Portuguese terms with gender agreement', () => {
    const i18n = makeI18n('pt_BR', {
      Scene: 'Cena',
      'Add a new scene': 'Adicionar uma nova cena',
      'Go to the scene': 'Ir para a cena',
      'Object groups': 'Grupos de objetos',
      'New object group': 'Novo grupo de objetos',
      'Scene variables': 'Variáveis de cena',
      Scenery: 'Cenário',
      'Start by adding new external events':
        'Comece adicionando novos eventos externos',
      'Add a new external events': 'Adicionar um novo evento externo',
    });
    expect(i18n._('Start by adding new external events')).toBe(
      'Comece adicionando novas folhas de eventos'
    );
    expect(i18n._('Add a new external events')).toBe(
      'Adicionar uma nova folha de eventos'
    );
    expect(i18n._('Scene')).toBe('Layout');
    expect(i18n._('Add a new scene')).toBe('Adicionar um novo layout');
    expect(i18n._('Go to the scene')).toBe('Ir para o layout');
    expect(i18n._('Object groups')).toBe('Famílias');
    expect(i18n._('New object group')).toBe('Nova família');
    expect(i18n._('Scene variables')).toBe('Variáveis de layout');
    expect(i18n._('Scenery')).toBe('Cenário');
  });

  it('never rewrites interpolated values', () => {
    const i18n = makeI18n('en', {});
    expect(i18n._('Add {name} to the scene', { name: 'My scene object' })).toBe(
      'Add My scene object to the layout'
    );
    expect(
      i18n._({
        id: 'Delete scene {name}?',
        values: { name: 'Scene 1' },
      })
    ).toBe('Delete layout Scene 1?');
  });

  it('uses Construct 3 default names and labels', () => {
    const en = makeI18n('en', {});
    expect(en._('Untitled scene')).toBe('Layout 1');
    expect(en._('Base layer')).toBe('Layer 0');
    expect(en._('Share')).toBe('Export');
    expect(en._('Share your game')).toBe('Share your game');
    const pt = makeI18n('pt_BR', {
      'Untitled scene': 'Cena sem título',
      'Untitled external events': 'Eventos externos sem título',
      Share: 'Compartilhar',
    });
    expect(pt._('Untitled scene')).toBe('Layout 1');
    expect(pt._('Untitled external events')).toBe('Folha de eventos 1');
    expect(pt._('Share')).toBe('Exportar');
  });

  it('translates the strings added by the reskin to pt-BR', () => {
    const pt = makeI18n('pt_BR', {});
    expect(pt._('Recent projects')).toBe('Projetos recentes');
    expect(pt._('SD landscape 16:9')).toBe('Paisagem SD 16:9');
    expect(pt._("What's new")).toBe('Novidades');
    expect(makeI18n('en', {})._('Recent projects')).toBe('Recent projects');
  });

  it('leaves other languages untouched', () => {
    const i18n = makeI18n('fr_FR', { Scene: 'Scène' });
    expect(i18n._('Scene')).toBe('Scène');
  });

  it('names the app Assemble3 in every language, but not in URLs', () => {
    const fr = makeI18n('fr_FR', {
      'About GDevelop': 'À propos de GDevelop 5',
      'GDevelop website': 'Site https://gdevelop.io',
    });
    expect(fr._('About GDevelop')).toBe('À propos de Assemble3');
    expect(fr._('GDevelop website')).toBe('Site https://gdevelop.io');
    expect(makeI18n('pt_BR', {})._('Official GDevelop website')).toBe(
      'Site oficial do Assemble3'
    );
  });
});

describe('applyC3Terminology pt_BR agreement', () => {
  it('fixes participles after the noun', () => {
    const i18n = makeI18n('pt_BR', {
      a: 'Eventos quando uma cena for pausada (outra cena é executada).',
      b: 'A cena _PARAM1_ foi pré-carregada',
      c: 'construir cenas inteiras para você',
      d: 'Adicionar na minha cena',
      e: 'no layout cada frame',
    });
    expect(i18n._('a')).toBe(
      'Eventos quando um layout for pausado (outro layout é executado).'
    );
    expect(i18n._('b')).toBe('O layout _PARAM1_ foi pré-carregado');
    expect(i18n._('c')).toBe('construir layouts inteiros para você');
    expect(i18n._('d')).toBe('Adicionar no meu layout');
    expect(i18n._('e')).toBe('no layout cada frame');
  });
});
