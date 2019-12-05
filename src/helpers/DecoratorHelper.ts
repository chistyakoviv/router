import PathHelper from './PathHelper';

export interface Params {
    [key: string]: string;
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
        const params: Params = {};

        for (let i = 0; i < wrappers.length; i++) {
            for (let nextParam in wrappers[i]) {
                if (wrappers[i][nextParam]) {
                    switch (nextParam) {
                        case 'path':
                            params[nextParam] = PathHelper.join(params[nextParam], wrappers[i][nextParam]);
                            break;
                        default:
                            params[nextParam] = params[nextParam] ? params[nextParam] : '' + wrappers[i][nextParam];
                    }
                }
            }
        }

        return params;
    }
};
