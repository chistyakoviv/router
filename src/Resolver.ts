import { compile } from 'path-to-regexp';
import ResolverInterface from './interfaces/ResolverInterface';
import Cache from './Cache';

export default class Resolver implements ResolverInterface {
    private cache: Cache<(...args: any) => string> = new Cache<
        (...args: any) => string
    >();

    public resolve(path: string, params?: object): string {
        try {
            const filler = this.cache.get(path, () => compile(path));

            return filler(params || {}, { pretty: true });
        } catch (e: any) {
            throw new Error(`Missing param for route ${path}: ${e.message}`);
        }
    }
}
