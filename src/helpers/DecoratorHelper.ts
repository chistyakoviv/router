import PathHelper from './PathHelper';

export interface Params {
    [key: string]: any;
}

export default class DecoratorHelper {
    static wrappers: Params[] = [];

    static wrap(params: Params, fn: () => void): void {
        const wrappers = DecoratorHelper.wrappers;

        wrappers.push(params);
        fn();
        wrappers.pop();
    }

    static getParams(): Params {
        const wrappers = DecoratorHelper.wrappers;
        const params: Params = { middlewares: [] };

        for (let i = 0; i < wrappers.length; i++) {
            for (const nextParam in wrappers[i]) {
                if (wrappers[i][nextParam]) {
                    switch (nextParam) {
                        case 'path':
                            params[nextParam] = PathHelper.join(
                                params[nextParam],
                                wrappers[i][nextParam],
                            );
                            break;
                        case 'middleware':
                            params['middlewares'].push(wrappers[i][nextParam]);
                            break;
                        default:
                            params[nextParam] =
                                (params[nextParam] ? params[nextParam] : '') +
                                wrappers[i][nextParam];
                    }
                }
            }
        }

        return params;
    }

    static applyMiddleware(
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        handler: () => void = () => {},
        middlewares: (() => void)[],
    ): () => void {
        middlewares = middlewares.slice();
        middlewares.reverse();

        return middlewares.reduce(
            (prev, current) => DecoratorHelper.compose(current, prev),
            handler,
        );
    }

    static compose(
        f: (...args: any) => void,
        g: (...args: any) => void,
    ): (...args: any) => void {
        return function (data: any) {
            return f(data, g);
        };
    }
}
