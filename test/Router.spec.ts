import RouteCollection from '../src/RouteCollection';
import Location from '../src/Location';
import { Router } from '../src/Router';
import { RouteMock } from './mocks/Route';
import { mockResolverResolve, ResolverMock } from './mocks/Resolver';
import { HTML5HistoryMock } from './mocks/history/HTML5History';
import UrlHelper from '../src/helpers/UrlHelper';
import * as LocationReexport from './mocks/Location';

const mockRouteCollectionMatch = jest.fn();
const mockRouteCollectionFind = jest.fn();

jest.mock('../src/RouteCollection', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            return {
                match: mockRouteCollectionMatch,
                find: mockRouteCollectionFind,
            };
        }),
    };
});

const mockLocationGetPath = jest.fn();
const mockLocationGetNormalizedPath = jest.fn();
const mockLocationGetRoute = jest.fn();
const mockLocationGetParams = jest.fn();
const mockLocationApply = jest.fn();
const mockLocationGetName = jest.fn();
const mockLocationGetQuery = jest.fn();
const mockLocationGetHash = jest.fn();
const mockLocationIsSame = jest.fn();
const mockLocationGetPrev = jest.fn();
const mockLocationIsPathChanged = jest.fn();
const mockLocationIsQueryChanged = jest.fn();
const mockLocationIsHashChanged = jest.fn();
const mockLocationSetPrev = jest.fn();
const mockCreateDefault = jest.fn();

const LocationMock = {
    getPath: mockLocationGetPath,
    getNormalizedPath: mockLocationGetNormalizedPath,
    getRoute: mockLocationGetRoute,
    getParams: mockLocationGetParams,
    apply: mockLocationApply,
    getName: mockLocationGetName,
    getQuery: mockLocationGetQuery,
    getHash: mockLocationGetHash,
    isSame: mockLocationIsSame,
    getPrev: mockLocationGetPrev,
    isPathChanged: mockLocationIsPathChanged,
    isQueryChanged: mockLocationIsQueryChanged,
    isHashChanged: mockLocationIsHashChanged,
    setPrev: mockLocationSetPrev,
    createDefault: mockCreateDefault,
};

jest.mock('../src/Location', () => {
    return {
        default: jest.fn().mockImplementation(() => {
            const location = Object.create(
                LocationReexport.LocationClass.default.prototype,
            );
            return Object.assign(location, LocationMock);
        }),
    };
});

const mockUrlHelperGetPath = jest.fn();
const mockUrlHelperParsePath = jest.fn();

jest.mock('../src/helpers/UrlHelper', () => {
    return {
        default: jest.fn(),
    };
});

describe('Router', () => {
    const resolver = new ResolverMock();
    const history = new HTML5HistoryMock();
    const routeDefault = new RouteMock('/');
    const routeTest = new RouteMock('/test');
    const route42 = new RouteMock('/id/42');
    const routes = [routeTest, route42];

    Location.createDefault = jest.fn().mockImplementation(() => {
        const location = Object.create(
            LocationReexport.LocationClass.default.prototype,
        );
        return Object.assign(location, LocationMock);
    });

    UrlHelper.getPath = mockUrlHelperGetPath;
    UrlHelper.parsePath = mockUrlHelperParsePath;

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('instantiates router', () => {
        new Router(routes, history, resolver);

        expect(RouteCollection).toHaveBeenCalledWith(routes);
        expect(Location.createDefault).toHaveBeenCalled();
    });

    it('initializes router', () => {
        const router = new Router(routes, history, resolver);

        mockUrlHelperGetPath.mockReturnValue('/');
        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({
            matchedPath: '/',
            route: routeDefault,
            params: {},
        });

        router.init();

        expect(history.on).toHaveBeenCalled();
        expect(mockLocationApply).toHaveBeenCalledWith(router);
    });

    it('returns true when destination matches a route', () => {
        const router = new Router(routes, history, resolver);

        mockLocationGetRoute.mockReturnValue(routeDefault);
        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});

        const result = router.match({ path: '/' });

        expect(result).toBe(true);
    });

    it('returns false when destination does not matches a route', () => {
        const router = new Router(routes, history, resolver);

        mockLocationGetRoute.mockReturnValue(undefined);
        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});

        const result = router.match({ path: '/' });

        expect(result).toBe(false);
    });

    it('returns true when destination matches a route by name', () => {
        const router = new Router(routes, history, resolver);

        mockLocationGetRoute.mockReturnValue(routeDefault);
        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockRouteCollectionFind.mockReturnValue(routeDefault);
        mockResolverResolve.mockReturnValue('/');

        const result = router.match({ name: 'user' });

        expect(result).toBe(true);
    });

    it('returns false when destination does not match a route by name', () => {
        const router = new Router(routes, history, resolver);

        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockRouteCollectionFind.mockReturnValue(null);

        const result = router.match({ name: 'user' });

        expect(result).toBe(false);
    });

    it('returns false when destination matches a route by name, but does not matches by path', () => {
        const router = new Router(routes, history, resolver);

        mockLocationGetRoute.mockReturnValue(undefined);
        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockRouteCollectionFind.mockReturnValue(routeDefault);
        mockResolverResolve.mockReturnValue('/');

        const result = router.match({ name: 'user' });

        expect(result).toBe(false);
    });

    it('pushes a new location', () => {
        const router = new Router(routes, history, resolver);

        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockLocationIsSame.mockReturnValue(false);
        mockLocationGetPath.mockReturnValue('/');

        router.push({ path: '/' });

        expect(history.push).toHaveBeenCalledWith('/');
        expect(mockLocationSetPrev).toHaveBeenCalledWith(LocationMock);
        expect(mockLocationApply).toHaveBeenCalledWith(router);
        expect(mockLocationIsSame).toHaveBeenCalledWith(LocationMock);
    });

    it('throws error when location is not found', () => {
        const router = new Router(routes, history, resolver);

        try {
            router.push({});
        } catch (err: any) {
            expect(err.message).toBe(`Can't push location: Invalid params.`);
        }

        expect(history.push).not.toHaveBeenCalled();
        expect(mockLocationSetPrev).not.toHaveBeenCalled();
        expect(mockLocationApply).not.toHaveBeenCalled();
        expect(mockLocationIsSame).not.toHaveBeenCalled();
    });

    it('throws error when location is same', () => {
        const router = new Router(routes, history, resolver);

        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockLocationIsSame.mockReturnValue(true);
        mockLocationGetPath.mockReturnValue('/');

        try {
            router.push({ path: '/' });
        } catch (err: any) {
            expect(err.message).toBe(
                `The destination location / is the current location.`,
            );
        }

        expect(mockLocationIsSame).toHaveBeenCalledWith(LocationMock);
        expect(history.push).not.toHaveBeenCalled();
        expect(mockLocationSetPrev).not.toHaveBeenCalled();
        expect(mockLocationApply).not.toHaveBeenCalled();
    });

    it('replaces current location with a new location', () => {
        const router = new Router(routes, history, resolver);

        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockLocationIsSame.mockReturnValue(false);
        mockLocationGetPath.mockReturnValue('/');

        router.replace({ path: '/' });

        expect(history.replace).toHaveBeenCalledWith('/');
        expect(mockLocationSetPrev).toHaveBeenCalledWith(LocationMock);
        expect(mockLocationApply).toHaveBeenCalledWith(router);
        expect(mockLocationIsSame).toHaveBeenCalledWith(LocationMock);
    });

    it('throws error when location is not found', () => {
        const router = new Router(routes, history, resolver);

        try {
            router.replace({});
        } catch (err: any) {
            expect(err.message).toBe(`Can't replace location: Invalid params.`);
        }

        expect(history.replace).not.toHaveBeenCalled();
        expect(mockLocationSetPrev).not.toHaveBeenCalled();
        expect(mockLocationApply).not.toHaveBeenCalled();
        expect(mockLocationIsSame).not.toHaveBeenCalled();
    });

    it('throws error when location is same', () => {
        const router = new Router(routes, history, resolver);

        mockUrlHelperParsePath.mockReturnValue({ path: '/' });
        mockRouteCollectionMatch.mockReturnValue({});
        mockLocationIsSame.mockReturnValue(true);
        mockLocationGetPath.mockReturnValue('/');

        try {
            router.replace({ path: '/' });
        } catch (err: any) {
            expect(err.message).toBe(
                `The destination location / is the current location.`,
            );
        }

        expect(mockLocationIsSame).toHaveBeenCalledWith(LocationMock);
        expect(history.push).not.toHaveBeenCalled();
        expect(mockLocationSetPrev).not.toHaveBeenCalled();
        expect(mockLocationApply).not.toHaveBeenCalled();
    });

    it.each`
        n     | expected
        ${0}  | ${0}
        ${1}  | ${1}
        ${-1} | ${-1}
        ${5}  | ${5}
        ${-5} | ${-5}
    `('goes $n step(s) from current location', ({ n, expected }) => {
        const router = new Router(routes, history, resolver);

        router.go(n);

        expect(history.go).toHaveBeenCalledWith(expected);
    });

    it('goes back', () => {
        const router = new Router(routes, history, resolver);

        router.back();

        expect(history.back).toHaveBeenCalled();
    });

    it('goes forward', () => {
        const router = new Router(routes, history, resolver);

        router.forward();

        expect(history.forward).toHaveBeenCalled();
    });

    it('returns current location', () => {
        const router = new Router(routes, history, resolver);

        const result = router.getLocation();

        expect(result).toBeInstanceOf(Location);
    });
});
