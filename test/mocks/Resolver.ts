import Resolver from '../../src/Resolver';

export const mockResolverResolve = jest.fn();

export const ResolverMock = jest.fn().mockImplementation(() => {
    const methods = {
        resolve: mockResolverResolve,
    };
    return methods;
}) as jest.MockedClass<typeof Resolver>;
