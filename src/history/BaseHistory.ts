import HistoryApi, { HistoryEvents } from "../interfaces/HistoryApi";
import Location from '../Location';

export default class BaseHistory implements HistoryApi {
    protected location?: Location;
    protected events: {
        [key: string]: Function[]
    } = { [HistoryEvents.POPSTATE]: [] };

    go(n: number) {}
    push(locaton: Location): void {}
    replace(location: Location): void {}

    on(name: HistoryEvents, callback: Function) {
        this.events[name].push(callback);
    }

    off(name: HistoryEvents, callback: Function) {
        const index = this.events[name].indexOf(callback);

        if (~index) {
            this.events[name].splice(index, 1);
        }
    }
};
