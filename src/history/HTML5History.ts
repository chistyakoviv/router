import HistoryApi, { HistoryEvents } from '../interfaces/HistoryApi';
import Location from '../Location';
import UrlHelper from '../helpers/UrlHelper';
import BaseHistory from './BaseHistory';

export default class HTML5History extends BaseHistory implements HistoryApi {

    private onLocationChange: (e: Event) => void = (e: Event) => {
        this.transitionTo(UrlHelper.getLocation());
        this.events[HistoryEvents.POPSTATE].forEach(callback => callback());
    }

    constructor() {
        super();

        window.addEventListener('popstate', this.onLocationChange);
    }

    go(n: number) {
        window.history.go(n);
    }

    push(locaton: Location): void {

    }

    replace(location: Location): void {

    }

    private transitionTo(path: string): void {
        this.location = new Location(path);
    }
};
