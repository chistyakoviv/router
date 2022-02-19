import Location from '../src/Location';
import Route from '../src/Route';
import { mockGetHanlder, mockGetName, RouteMock } from './mocks/Route';
import { RouterMock } from './mocks/Router';

describe('Location', () => {
    it('returns location path', () => {
        const location = new Location('/test', '/test/');

        const result = location.getPath();

        expect(result).toBe('/test');
    });

    it('return normalized location path', () => {
        const location = new Location('/test', '/test/');

        const result = location.getNormalizedPath();

        expect(result).toBe('/test/');
    });

    it('returns route when it exists', () => {
        const route = new RouteMock('/');
        const location = new Location('/test', '/test/', route);

        const result = location.getRoute();

        expect(result).toBeInstanceOf(Route);
        expect(result).toStrictEqual(route);
    });

    it('returns null when route doen not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.getRoute();

        expect(result).toBe(null);
    });

    it('applies route to the location', () => {
        const route = new RouteMock('/');
        const router = new RouterMock([]);
        const handler = jest.fn();
        const location = new Location('/test', '/test/', route);
        mockGetHanlder.mockImplementation(() => handler);

        location.apply(router);

        expect(mockGetHanlder).toHaveBeenCalled();
        expect(handler).toHaveBeenCalledWith(router);
    });

    it('returns params when they exist', () => {
        const params = { test: 42 };
        const location = new Location('/test', '/test/', undefined, params);

        const result = location.getParams();

        expect(result).toStrictEqual(params);
    });

    it('returns null when params does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.getParams();

        expect(result).toStrictEqual(null);
    });

    it('returns location name when route exists', () => {
        const route = new RouteMock('/');
        const location = new Location('/test', '/test/', route);
        mockGetName.mockReturnValue('route_name');

        const result = location.getName();

        expect(result).toStrictEqual('route_name');
        expect(mockGetName).toHaveBeenCalled();
    });

    it('returns null when route does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.getParams();

        expect(result).toStrictEqual(null);
    });

    it('returns query when it exists', () => {
        const location = new Location(
            '/test',
            '/test/',
            undefined,
            undefined,
            'param=42&test=str&empty=',
        );

        const result = location.getQuery();

        expect(result).toStrictEqual({
            param: '42',
            test: 'str',
            empty: '',
        });
    });

    it('returns empty object when query does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.getQuery();

        expect(result).toStrictEqual({});
    });

    it('returns hash when it exists', () => {
        const location = new Location(
            '/test',
            '/test/',
            undefined,
            undefined,
            undefined,
            '#some_hash_string',
        );

        const result = location.getHash();

        expect(result).toBe('#some_hash_string');
    });

    it('returns null when hash does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.getHash();

        expect(result).toBe(null);
    });

    it('returns true when locatons match', () => {
        const prevLocation = new Location('/test', '/test/');
        const nextLocation = new Location('/test', '/test/');

        const result = nextLocation.isSame(prevLocation);

        expect(result).toBe(true);
    });

    it('returns false when locations do not match', () => {
        const prevLocation = new Location('/test', '/test/');
        const nextLocation = new Location('/test/42', '/test/42/');

        const result = nextLocation.isSame(prevLocation);

        expect(result).toBe(false);
    });

    it('returns prev locations when it exists', () => {
        const prevLocation = new Location('/test', '/test/');
        const nextLocation = new Location('/test/42', '/test/42/');
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.getPrev();

        expect(result).toBeInstanceOf(Location);
        expect(result).toStrictEqual(prevLocation);
    });

    it('returns null when prev location does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.getPrev();

        expect(result).toBe(null);
    });

    it('returns true when prev location does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.isPathChanged();

        expect(result).toBe(true);
    });

    it('returns true when path changed', () => {
        const prevLocation = new Location('/test', '/test/');
        const nextLocation = new Location('/test/42', '/test/42/');
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.isPathChanged();

        expect(result).toStrictEqual(true);
    });

    it('returns false when path did not change', () => {
        const prevLocation = new Location('/test/42', '/test/42/');
        const nextLocation = new Location('/test/42', '/test/42/');
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.isPathChanged();

        expect(result).toStrictEqual(false);
    });

    it('returns true when prev location does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.isQueryChanged();

        expect(result).toBe(true);
    });

    it('returns true when query changed', () => {
        const prevLocation = new Location(
            '/test',
            '/test/',
            undefined,
            undefined,
            'prev_query',
        );
        const nextLocation = new Location(
            '/test/42',
            '/test/42/',
            undefined,
            undefined,
            'next_query',
        );
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.isQueryChanged();

        expect(result).toStrictEqual(true);
    });

    it('returns false when query did not change', () => {
        const prevLocation = new Location(
            '/test',
            '/test/',
            undefined,
            undefined,
            'query',
        );
        const nextLocation = new Location(
            '/test/42',
            '/test/42/',
            undefined,
            undefined,
            'query',
        );
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.isQueryChanged();

        expect(result).toStrictEqual(false);
    });

    it('returns true when prev location does not exist', () => {
        const location = new Location('/test', '/test/');

        const result = location.isHashChanged();

        expect(result).toBe(true);
    });

    it('returns true when hash changed', () => {
        const prevLocation = new Location(
            '/test',
            '/test/',
            undefined,
            undefined,
            undefined,
            'prev_hash',
        );
        const nextLocation = new Location(
            '/test/42',
            '/test/42/',
            undefined,
            undefined,
            'next_hash',
        );
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.isHashChanged();

        expect(result).toStrictEqual(true);
    });

    it('returns false when hash did not change', () => {
        const prevLocation = new Location(
            '/test',
            '/test/',
            undefined,
            undefined,
            undefined,
            'hash',
        );
        const nextLocation = new Location(
            '/test/42',
            '/test/42/',
            undefined,
            undefined,
            undefined,
            'hash',
        );
        nextLocation.setPrev(prevLocation);

        const result = nextLocation.isHashChanged();

        expect(result).toStrictEqual(false);
    });

    it('sets prev location', () => {
        const prevLocation = new Location('/test/42', '/test/42/');
        const nextLocation = new Location('/test/42', '/test/42/');

        nextLocation.setPrev(prevLocation);

        expect(nextLocation.getPrev()).toStrictEqual(prevLocation);
    });

    it('creates default location', () => {
        const result = Location.createDefault();

        expect(result).toBeInstanceOf(Location);
        expect(result.getPath()).toBe('/');
        expect(result.getNormalizedPath()).toBe('/');
    });
});
