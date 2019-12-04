import EventEmitter from './EventEmitter';

export enum HistoryEvents { POPSTATE = 'popstate' };

export default interface HistoryApi extends EventEmitter {
    go(n: number): void;
    push(path: string): void;
    replace(path: string): void;
};
