import Route from './Route';
import { Router } from './Router';
export default class Location {
    private path;
    private normalizedPath;
    private route?;
    private params?;
    private query?;
    private hash?;
    private parsedQuery?;
    private prev?;
    constructor(path: string, normalizedPath: string, route?: Route, params?: object, query?: string, hash?: string);
    getPath(): string;
    getNormalizedPath(): string;
    getRoute(): Route | null;
    apply(router: Router): void;
    getParams(): object | null;
    getName(): string | null;
    getQuery(): object;
    getHash(): string | null;
    isSame(location: Location): boolean;
    getPrev(): Location | null;
    isPathChanged(): boolean;
    isQueryChanged(): boolean;
    isHashChanged(): boolean;
    setPrev(location: Location): void;
    static createDefault(): Location;
}
