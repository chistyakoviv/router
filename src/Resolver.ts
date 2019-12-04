import { compile } from 'path-to-regexp';
import ResolverInterface from './interfaces/ResolverInterface';
import CacheInterface from './interfaces/CacheInterface';
import Cache from './Cache';

export default class Resolver implements ResolverInterface {
    private cache: CacheInterface<Function> = new Cache<Function>();

    public resolve(path: string, params?: object): string {
        try {
            const filler = this.cache.get(path, () => compile(path));

            return filler(params || {}, { pretty: true });
        } catch (e) {
            throw new Error(`Missing param for route ${path}: ${e.message}`);
        }
    }
};
