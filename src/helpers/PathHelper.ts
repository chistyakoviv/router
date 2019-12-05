export default class PathHelper {
    static removeTrailingSlash(path: string) {
        return path && path.replace(/\/?$/, '') || '';
    }

    static cleanPath(path: string): string {
        return path && path.replace(/\/\//, '/') || '';
    }

    static join(lstr: string, rstr: string): string {
        return PathHelper.cleanPath(`${PathHelper.removeTrailingSlash(lstr)}/${rstr}`);
    }
};
