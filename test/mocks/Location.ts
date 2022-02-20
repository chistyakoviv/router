import Location from '../../src/Location';

export const mockLocationGetPath = jest.fn();
export const mockLocationGetNormalizedPath = jest.fn();
export const mockLocationGetRoute = jest.fn();
export const mockLocationGetParams = jest.fn();
export const mockLocationApply = jest.fn();
export const mockLocationGetName = jest.fn();
export const mockLocationGetQuery = jest.fn();
export const mockLocationGetHash = jest.fn();
export const mockLocationIsSame = jest.fn();
export const mockLocationGetPrev = jest.fn();
export const mockLocationIsPathChanged = jest.fn();
export const mockLocationIsQueryChanged = jest.fn();
export const mockLocationIsHashChanged = jest.fn();
export const mockLocationSetPrev = jest.fn();
export const mockCreateDefault = jest.fn();

export const LocatoionMock = jest.fn().mockImplementation(() => {
    const methods = {
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
    return methods;
}) as unknown as jest.MockedClass<typeof Location>;
