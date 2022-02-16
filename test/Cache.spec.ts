import Cache from '../src/Cache';

describe('Cache', () => {
    let cache: Cache<number>;

    beforeEach(() => {
        cache = new Cache();
    });

    it('Gets value that cache contain', () => {
        cache.set('value', 42);

        const value = cache.get('value');

        expect(value).toBe(42);
    });

    it('Gets the value that cache does not contain', () => {
        const value = cache.get('value');

        expect(value).toBe(undefined);
    });

    it('Gets the default value when cache does not contain the value yet', () => {
        const value = cache.get('value', () => 42);

        expect(value).toBe(42);
    });

    it('Saves default value on retrieving non-existent value', () => {
        cache.get('value', () => 42);

        const value = cache.get('value');

        expect(value).toBe(42);
    });
});
