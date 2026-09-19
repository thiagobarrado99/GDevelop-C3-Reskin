// @flow
import { getTabsToDisplay } from './HomePageMenu';
import { limitsForStudentUser } from '../../../fixtures/GDevelopServicesTestData';

describe('HomePageMenu', () => {
  describe('getTabsToDisplay', () => {
    test('c3: only the Create tab, whatever the user limits', () => {
      expect(getTabsToDisplay({ limits: null }).map(tab => tab.tab)).toEqual([
        'create',
      ]);
      expect(
        getTabsToDisplay({ limits: limitsForStudentUser }).map(tab => tab.tab)
      ).toEqual(['create']);
    });
  });
});
