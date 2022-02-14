export default class UrlHelper {
    static getPath(): string;
    static parsePath(path: string): {
        path: string;
        query: string;
        hash: string;
    };
}
