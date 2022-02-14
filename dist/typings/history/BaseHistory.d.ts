import HistoryApi, { HistoryEvents } from "../interfaces/HistoryApi";
export default class BaseHistory implements HistoryApi {
    protected location?: Location;
    protected events: {
        [key: string]: Function[];
    };
    go(n: number): void;
    push(path: string): void;
    replace(path: string): void;
    back(): void;
    forward(): void;
    on(name: HistoryEvents, callback: Function): void;
    off(name: HistoryEvents, callback: Function): void;
}
