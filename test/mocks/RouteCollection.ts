import RouteCollection from '../../src/RouteCollection';

export const mockRouteCollectionMatch = jest.fn();
export const mockRouteCollectionFind = jest.fn();

export const RouteCollectionMock = jest.fn().mockImplementation(() => {
    const methods = {
        match: mockRouteCollectionMatch,
        find: mockRouteCollectionFind,
    };
    return methods;
}) as jest.MockedClass<typeof RouteCollection>;
