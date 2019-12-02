import { compile } from 'path-to-regexp';
import MatcherInterface from './interfaces/MatcherInterface';
import CacheInterface from './interfaces/CacheInterface';
import Cache from './Cache';

export default class Matcher implements MatcherInterface {
    private cache: CacheInterface<Function> = new Cache<Function>();

    public match(path: string, params?: object): string {
        try {
            const filler = this.cache.get(path, () => compile(path));

            return filler(params || {}, {pretty: true});
        } catch (e) {
            throw new Error(`Missing param for route ${path}: ${e.message}`);
        }
    }
};
