import HistoryApi, { HistoryEvents } from '../interfaces/HistoryApi';

export default abstract class BaseHistory implements HistoryApi {
    protected location?: Location;
    protected events: {
        [key: string]: ((...args: any) => void)[];
    } = { [HistoryEvents.POPSTATE]: [] };

    abstract go(n: number): void;
    abstract push(path: string): void;
    abstract replace(path: string): void;
    abstract back(): void;
    abstract forward(): void;

    on(name: HistoryEvents, callback: (...args: any) => void): void {
        this.events[name].push(callback);
    }

    off(name: HistoryEvents, callback: (...args: any) => void): void {
        const index = this.events[name].indexOf(callback);

        if (~index) {
            this.events[name].splice(index, 1);
        }
    }
}
