import UrlHelper from '../../src/helpers/UrlHelper';

describe('Url helper', () => {
    const origLocation = window.location;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: The operand of a 'delete' operator must be optional
        delete window.location;

        window.location = {
            ancestorOrigins: '' as unknown as DOMStringList,
            host: '',
            hostname: '',
            href: '',
            origin: '',
            port: '',
            protocol: '',
            assign: jest.fn(),
            reload: jest.fn(),
            replace: jest.fn(),
            pathname: '',
            search: '',
            hash: '',
        };
    });

    afterAll(() => {
        window.location = origLocation;
    });

    it('Return path when current page is /', () => {
        window.location.pathname = '/';
        window.location.search = '';
        window.location.hash = '';

        const result = UrlHelper.getPath();

        expect(result).toBe('/');
    });

    it('Return path when current page is empty', () => {
        window.location.pathname = '/';
        window.location.search = '';
        window.location.hash = '';

        const result = UrlHelper.getPath();

        expect(result).toBe('/');
    });

    it('Return path when current page is /test', () => {
        window.location.pathname = '/test';
        window.location.search = '';
        window.location.hash = '';

        const result = UrlHelper.getPath();

        expect(result).toBe('/test');
    });

    it('Return path when current page is /test?test=42', () => {
        window.location.pathname = '/test';
        window.location.search = '?test=42';
        window.location.hash = '';

        const result = UrlHelper.getPath();

        expect(result).toBe('/test?test=42');
    });

    it('Return path when current page is /test#test=42', () => {
        window.location.pathname = '/test';
        window.location.search = '';
        window.location.hash = '#test=42';

        const result = UrlHelper.getPath();

        expect(result).toBe('/test#test=42');
    });

    it('Return path when current page is /test?test=42#test=42', () => {
        window.location.pathname = '/test';
        window.location.search = '?test=42';
        window.location.hash = '#test=42';

        const result = UrlHelper.getPath();

        expect(result).toBe('/test?test=42#test=42');
    });

    it('Parses path without query or hash', () => {
        const result = UrlHelper.parsePath('/test/path');

        expect(result).toStrictEqual({
            path: '/test/path',
            query: '',
            hash: '',
        });
    });

    it('Parses path with query', () => {
        const result = UrlHelper.parsePath('/test/path?test=42&param=42');

        expect(result).toStrictEqual({
            path: '/test/path',
            query: 'test=42&param=42',
            hash: '',
        });
    });

    it('Parses path with hash', () => {
        const result = UrlHelper.parsePath('/test/path#test=42&param=42');

        expect(result).toStrictEqual({
            path: '/test/path',
            query: '',
            hash: '#test=42&param=42',
        });
    });

    it('Parses path with query and hash', () => {
        const result = UrlHelper.parsePath(
            '/test/path?test=42&param=42#test=42&param=42',
        );

        expect(result).toStrictEqual({
            path: '/test/path',
            query: 'test=42&param=42',
            hash: '#test=42&param=42',
        });
    });
});
