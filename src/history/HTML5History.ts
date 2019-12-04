import HistoryApi, { HistoryEvents } from '../interfaces/HistoryApi';
import UrlHelper from '../helpers/UrlHelper';
import BaseHistory from './BaseHistory';

export default class HTML5History extends BaseHistory implements HistoryApi {

    private onLocationChange: (e: Event) => void = (e: Event) => {
        this.events[HistoryEvents.POPSTATE].forEach(cb => cb({ path: UrlHelper.getPath() }));
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
