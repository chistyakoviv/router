import ResolverInterface from './interfaces/ResolverInterface';
export default class Resolver implements ResolverInterface {
    private cache;
    resolve(path: string, params?: object): string;
}
