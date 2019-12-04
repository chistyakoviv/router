import HistoryApi, { HistoryEvents } from "../interfaces/HistoryApi";

export default class BaseHistory implements HistoryApi {
    protected location?: Location;
    protected events: {
        [key: string]: Function[]
    } = { [HistoryEvents.POPSTATE]: [] };

    go(n: number) {}
    push(path: string): void {}
    replace(path: string): void {}

    on(name: HistoryEvents, callback: Function): void {
        this.events[name].push(callback);
    }

    off(name: HistoryEvents, callback: Function): void {
        const index = this.events[name].indexOf(callback);

        if (~index) {
            this.events[name].splice(index, 1);
        }
    }
};
