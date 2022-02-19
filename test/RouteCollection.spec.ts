import Route from '../src/Route';
import RouteCollection from '../src/RouteCollection';
import { RouteMock, mockMatch, mockGetName } from './mocks/Route';

describe('Route collection', () => {
    it('returns a route match when collection has a matching route', () => {
        const routeTest = new RouteMock('/test');
        const route42 = new RouteMock('/id/42');

        let counter = 0;

        mockMatch.mockImplementation(() => {
            return counter++ > 0
                ? {
                      matchedPath: 'pattern',
                      route: 'route',
                      params: 'params',
                  }
                : false;
        });

        const collection = new RouteCollection([routeTest, route42]);

        const result = collection.match('test');

        expect(result).toStrictEqual({
            matchedPath: 'pattern',
            route: 'route',
            params: 'params',
        });
        expect(mockMatch).toHaveBeenCalledWith('test');
        expect(mockMatch).toBeCalledTimes(2);
    });

    it('returns an empty object when collection does not have a matching route', () => {
        const route = new RouteMock('test');
        const collection = new RouteCollection([route]);

        mockMatch.mockReturnValue(null);

        const result = collection.match('test');

        expect(result).toStrictEqual({});
        expect(mockMatch).toHaveBeenCalledWith('test');
        expect(mockMatch).toBeCalledTimes(1);
    });

    it('returns a route when collection contains a route with the requested name', () => {
        const routeTest = new RouteMock('/test', undefined, 'test');
        const route42 = new RouteMock('/id/42', undefined, '42');

        let counter = 0;

        mockGetName.mockImplementation(() => {
            return counter++ > 0 ? '42' : 'test';
        });

        const collection = new RouteCollection([routeTest, route42]);

        const result = collection.find('42');

        expect(result).toStrictEqual(route42);
        expect(result).toBeInstanceOf(Route);
        expect(mockGetName).toHaveBeenCalledTimes(2);
    });

    it('returns null when collection does not contain a route with the requested name', () => {
        const routeTest = new RouteMock('/test', undefined, 'test');
        const route42 = new RouteMock('/id/42', undefined, '42');

        mockGetName.mockReturnValue('test');

        const collection = new RouteCollection([routeTest, route42]);

        const result = collection.find('user');

        expect(result).toBe(null);
        expect(mockGetName).toHaveBeenCalledTimes(2);
    });
});
