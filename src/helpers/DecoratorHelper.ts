import PathHelper from './PathHelper';

export interface Params {
    [key: string]: any;
};

export default class DecoratorHelper {
    static wrappers: Params[] = [];

    static wrap(params: Params, fn: Function): void {
        const wrappers = DecoratorHelper.wrappers;

        wrappers.push(params);
        fn();
        wrappers.pop();
    }

    static getParams(): Params {
        const wrappers = DecoratorHelper.wrappers;
        const params: Params = { 'middlewares': [] };

        for (let i = 0; i < wrappers.length; i++) {
            for (let nextParam in wrappers[i]) {
                if (wrappers[i][nextParam]) {
                    switch (nextParam) {
                        case 'path':
                            params[nextParam] = PathHelper.join(params[nextParam], wrappers[i][nextParam]);
                            break;
                        case 'middleware':
                            params['middlewares'].push(wrappers[i][nextParam]);
                            break;
                        default:
                            params[nextParam] = (params[nextParam] ? params[nextParam] : '') + wrappers[i][nextParam];
                    }
                }
            }
        }

        return params;
    }

    static applyMiddleware(hander: Function = () => {}, middlewares: Function[]): Function {
        middlewares = middlewares.slice();
        middlewares.reverse();

        return middlewares.reduce((prev, current) => DecoratorHelper.compose(current, prev), hander);
    }

    static compose(f: Function, g: Function): Function {
        return function(a: any) {
            return f(a, g);
        }
    }
};
