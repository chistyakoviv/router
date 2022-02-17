import PathHelper from '../../src/helpers/PathHelper';

describe('Path helper', () => {
    it('Removes trailing slash', () => {
        const result = PathHelper.removeTrailingSlash('/test/path/');

        expect(result).toBe('/test/path');
    });

    it('Does not change path if there is no trailing slash', () => {
        const result = PathHelper.removeTrailingSlash('/test/path');

        expect(result).toBe('/test/path');
    });

    it('Removes double slashes', () => {
        const result = PathHelper.cleanPath('//some/test//path//');

        expect(result).toBe('/some/test/path/');
    });

    it('Joins two strings into a path', () => {
        const result = PathHelper.join('first', 'second');

        expect(result).toBe('first/second');
    });
});
