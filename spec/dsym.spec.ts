import { getDSymFileInfos } from '../src/dsym';

describe('dsym', () => {
    describe('getDSymFileInfos', () => {
        it('should return empty array for non-macho file', async () => {
            return expectAsync(getDSymFileInfos('spec/support/bugsplat.pdb')).toBeResolvedTo(jasmine.arrayContaining([]));
        });

        it('should return path, relativePath, dbgIds, module names for macho files', () => {
            return expectAsync(getDSymFileInfos('spec/support/bugsplat.app.dSYM')).toBeResolvedTo(jasmine.arrayContaining([
                {
                    path: jasmine.stringContaining('/symbol-upload/tmp/2dd1bd2706fa384da5a3a8265921cf9a/BugsplatTester'),
                    relativePath: '2dd1bd2706fa384da5a3a8265921cf9a/BugsplatTester',
                    dbgId: '2dd1bd2706fa384da5a3a8265921cf9a',
                    moduleName: 'BugsplatTester',
                },
                {
                    path: jasmine.stringContaining('/Users/bobby/Desktop/bugsplat/symbol-upload/tmp/2ce192f6c5963e66b06aa22bde5756a0/BugsplatTester'),
                    relativePath: '2ce192f6c5963e66b06aa22bde5756a0/BugsplatTester',
                    dbgId: '2ce192f6c5963e66b06aa22bde5756a0',
                    moduleName: 'BugsplatTester',
                }
            ]));
        });
    });
});