import Cache from '../src/Cache';

describe('Cache', () => {
    let cache: Cache<number>;

    beforeEach(() => {
        cache = new Cache();
    });

    it('Gets the value that cache already contains', () => {
        cache.set('value', 42);

        const value = cache.get('value');

        expect(value).toBe(42);
    });

    it('Gets the value that cache does not contain', () => {
        const value = cache.get('value');

        expect(value).toBe(undefined);
    });

    it('Gets default value when cache does not contain a value yet', () => {
        const value = cache.get('value', () => 42);

        expect(value).toBe(42);
    });

    it('Saves default value on retrieving a non-existent value', () => {
        cache.get('value', () => 42);

        const value = cache.get('value');

        expect(value).toBe(42);
    });
});
