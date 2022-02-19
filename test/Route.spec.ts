import Route from '../src/Route';
import DecoratorHelper from '../src/helpers/DecoratorHelper';
import PathHelper from '../src/helpers/PathHelper';

const mockApplyMiddleware = jest.fn();
const mockGetParams = jest.fn();
const mockWrap = jest.fn();

jest.mock('../src/helpers/DecoratorHelper', () => {
    return {
        default: jest.fn(),
    };
});

const mockJoin = jest.fn();

jest.mock('../src/helpers/PathHelper', () => {
    return {
        default: jest.fn(),
    };
});

describe('Route', () => {
    DecoratorHelper.applyMiddleware = mockApplyMiddleware;
    DecoratorHelper.getParams = mockGetParams;
    DecoratorHelper.wrap = mockWrap;

    PathHelper.join = mockJoin;

    it('returns parsed data when route matches', () => {
        const route = new Route('/id/:id');

        const result = route.match('/id/42');

        expect(result).toEqual({
            matchedPath: '/id/42',
            route: route,
            params: { id: '42' },
        });
    });

    it('returns null when route does not match', () => {
        const route = new Route('/id/:id');

        const result = route.match('/test');

        expect(result).toBe(null);
    });

    it('returns path', () => {
        const route = new Route('/id/:id');

        const result = route.getPath();

        expect(result).toBe('/id/:id');
    });

    it('returns name when it is defined', () => {
        const route = new Route('/id/:id', undefined, 'test');

        const result = route.getName();

        expect(result).toBe('test');
    });

    it('returns null when name is not defined', () => {
        const route = new Route('/id/:id');

        const result = route.getName();

        expect(result).toBe(null);
    });

    it('sets route name', () => {
        const route = new Route('/id/:id');

        route.setName('test');

        expect(route.getName()).toBe('test');
    });

    it('returns handler when it is defined', () => {
        const handler = jest.fn();
        const route = new Route('/id/:id', handler);

        const result = route.getHandler();

        expect(result).toStrictEqual(handler);
    });

    it('returns null when handler is not defined', () => {
        const route = new Route('/id/:id');

        const result = route.getHandler();

        expect(result).toStrictEqual(null);
    });

    it('creates nested route', () => {
        DecoratorHelper.getParams = jest
            .fn()
            .mockReturnValue({ middlewares: [] });

        const route = Route.create('/id/:id');

        expect(Route.build()).toStrictEqual([route]);
    });

    it('wraps routes in a group', () => {
        // assign dummy route to suppress error: Variable 'route' is used before being assigned.
        const fn = () => {
            Route.create('/profile', undefined, 'route');
        };
        const mw = () => ({});
        Route.group(
            {
                as: 'test.',
                path: '/id/:id',
                middleware: mw,
            },
            fn,
        );

        expect(DecoratorHelper.wrap).toHaveBeenCalledWith(
            {
                as: 'test.',
                path: '/id/:id',
                middleware: mw,
            },
            fn,
        );
    });

    it('builds routes', () => {
        const routeTest = Route.create('/test');
        const route42 = Route.create('/42');

        const routes = Route.build();

        expect(routes).toStrictEqual([routeTest, route42]);
    });
});
