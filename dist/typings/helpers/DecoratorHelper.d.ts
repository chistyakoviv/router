export interface Params {
    [key: string]: any;
}
export default class DecoratorHelper {
    static wrappers: Params[];
    static wrap(params: Params, fn: Function): void;
    static getParams(): Params;
    static applyMiddleware(handler: Function | undefined, middlewares: Function[]): Function;
    static compose(f: Function, g: Function): Function;
}
