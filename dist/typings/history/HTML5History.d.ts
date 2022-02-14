import HistoryApi from '../interfaces/HistoryApi';
import BaseHistory from './BaseHistory';
export default class HTML5History extends BaseHistory implements HistoryApi {
    private onLocationChange;
    constructor();
    private pushState;
    back(): void;
    forward(): void;
    go(n: number): void;
    push(path: string): void;
    replace(path: string): void;
}
