import Resolver from '../src/Resolver';

describe('Resolver', () => {
    it('resolves path without params', () => {
        const resolver = new Resolver();

        const result = resolver.resolve('/some/path');

        expect(result).toBe('/some/path');
    });

    it('resolves path with params', () => {
        const resolver = new Resolver();

        const result = resolver.resolve('/some/path/:id', { id: 42 });

        expect(result).toBe('/some/path/42');
    });
});
