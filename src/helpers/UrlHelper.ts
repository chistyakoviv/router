export default class UrlHelper {
    static getLocation(): string {
        const path = decodeURI(window.location.pathname);
        return (path || '/') + window.location.search + window.location.hash;
    }
};
