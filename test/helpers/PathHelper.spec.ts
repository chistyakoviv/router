import PathHelper from '../../src/helpers/PathHelper';

describe('Path helper', () => {
    it('removes trailing slash', () => {
        const result = PathHelper.removeTrailingSlash('/test/path/');

        expect(result).toBe('/test/path');
    });

    it('does not change path if there is no trailing slash', () => {
        const result = PathHelper.removeTrailingSlash('/test/path');

        expect(result).toBe('/test/path');
    });

    it('removes double slashes', () => {
        const result = PathHelper.cleanPath('//some/test//path//');

        expect(result).toBe('/some/test/path/');
    });

    it('joins two strings into a path', () => {
        const result = PathHelper.join('first', 'second');

        expect(result).toBe('first/second');
    });
});
