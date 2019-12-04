import Location from '../Location';

export enum HistoryEvents { POPSTATE = 'popstate' };

export default interface HistoryApi {
    go(n: number): void;
    push(location: Location): void;
    replace(location: Location): void;
    on(name: HistoryEvents, callback: Function): void;
    off(name: HistoryEvents, callback: Function): void;
};
