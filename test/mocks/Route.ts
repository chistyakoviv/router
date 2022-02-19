import Route from '../../src/Route';

export const mockMatch = jest.fn();
export const mockGetName = jest.fn();
export const mockSetName = jest.fn();
export const mockGetPath = jest.fn();
export const mockGetHanlder = jest.fn();
export const mockCreate = jest.fn();
export const mockGroup = jest.fn();
export const mockBuild = jest.fn();

export const RouteMock = jest.fn().mockImplementation(() => {
    const route = Object.create(Route.prototype);
    const methods = {
        match: mockMatch,
        getName: mockGetName,
        setName: mockSetName,
        getPath: mockGetPath,
        getHandler: mockGetHanlder,
        create: mockCreate,
        group: mockGroup,
        build: mockBuild,
    };
    return Object.assign(route, methods);
}) as unknown as jest.MockedClass<typeof Route>;
