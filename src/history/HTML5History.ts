import HistoryApi, { HistoryEvents } from '../interfaces/HistoryApi';
import UrlHelper from '../helpers/UrlHelper';
import BaseHistory from './BaseHistory';

export default class HTML5History extends BaseHistory implements HistoryApi {

    private onLocationChange: (e: Event) => void = (e: Event) => {
        const location = UrlHelper.getLocation();
        this.events[HistoryEvents.POPSTATE].forEach(callback => callback({ path: location }));
    }

    constructor() {
        super();

        window.addEventListener('popstate', this.onLocationChange);
    }

    go(n: number) {
        window.history.go(n);
    }

    push(path: string): void {
        window.history.pushState({}, '', path);
    }

    replace(path: string): void {

    }
};
