import HistoryApi, { HistoryEvents } from '../interfaces/HistoryApi';
import UrlHelper from '../helpers/UrlHelper';
import BaseHistory from './BaseHistory';

export default class HTML5History extends BaseHistory implements HistoryApi {
    private onLocationChange: (e: Event) => void = (e: Event) => {
        this.events[HistoryEvents.POPSTATE].forEach((cb) =>
            cb({ path: UrlHelper.getPath() }),
        );
    };

    constructor() {
        super();

        window.addEventListener('popstate', this.onLocationChange);
    }

    private pushState(path: string, replace?: boolean): void {
        // Protection from Safari pushState limit bug
        try {
            if (replace) {
                window.history.replaceState({}, '', path);
            } else {
                window.history.pushState({}, '', path);
            }
        } catch (e) {
            window.location[replace ? 'replace' : 'assign'](path);
        }
    }

    back(): void {
        window.history.back();
    }

    forward(): void {
        window.history.forward();
    }

    go(n: number): void {
        window.history.go(n);
    }

    push(path: string): void {
        this.pushState(path);
    }

    replace(path: string): void {
        this.pushState(path, true);
    }
}
