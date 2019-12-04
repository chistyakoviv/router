export default class UrlHelper {
    static getLocation(): string {
        const path = decodeURI(window.location.pathname);
        return (path || '/') + window.location.search + window.location.hash;
    }

    static parsePath (path: string): { path: string; query: string; hash: string; } {
        let hash = '';
        let query = '';

        const hashIndex = path.indexOf('#');

        if (~hashIndex) {
            hash = path.slice(hashIndex);
            path = path.slice(0, hashIndex);
        }

        const queryIndex = path.indexOf('?');

        if (~queryIndex) {
            query = path.slice(queryIndex + 1);
            path = path.slice(0, queryIndex);
        }

        return { path, query, hash };
    }
};
