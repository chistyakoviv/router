import DecoratorHelper from '../../src/helpers/DecoratorHelper';

describe('Decorator helper', () => {
    beforeEach(() => {
        DecoratorHelper.wrappers = [];
        jest.restoreAllMocks();
    });

    it('Wraps function call', () => {
        const pushSpy = jest.spyOn(DecoratorHelper.wrappers as any, 'push');
        const popSpy = jest.spyOn(DecoratorHelper.wrappers as any, 'pop');
        const fn = jest.fn();

        DecoratorHelper.wrap({ prop: 42 }, fn);

        expect(pushSpy).toHaveBeenCalledWith({ prop: 42 });
        expect(fn).toHaveBeenCalled();
        expect(popSpy).toHaveBeenCalled();
    });

    it('Gets params when there is no wrappers yet', () => {
        expect(DecoratorHelper.getParams()).toStrictEqual({ middlewares: [] });
    });

    it('Gets params when wrappers is set', () => {
        const middleware = jest.fn();

        DecoratorHelper.wrappers.push({
            path: '/some',
            middleware,
        });

        DecoratorHelper.wrappers.push({
            path: '/path',
        });

        const params = DecoratorHelper.getParams();

        expect(params).toStrictEqual({
            path: '/some/path',
            middlewares: [middleware],
        });
    });

    it('Applies middlewares', () => {
        const handler = jest.fn();
        const mw1 = jest.fn();
        const mw2 = jest.fn();
        const composed = jest.fn();
        const middlewares = [mw1, mw2];

        const spyCompose = jest
            .spyOn(DecoratorHelper, 'compose')
            .mockReturnValue(composed);

        DecoratorHelper.applyMiddleware(handler, middlewares);

        expect(spyCompose).toHaveBeenCalledWith(mw2, handler);
        expect(spyCompose).toHaveBeenCalledWith(mw1, composed);
        // the original array hasn't been changed
        expect(middlewares).toStrictEqual([mw1, mw2]);
    });

    it('Composes functions', () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const fn3 = jest.fn();

        const result = DecoratorHelper.compose(fn1, fn2);
        result(fn3);

        expect(fn1).toHaveBeenCalledWith(fn3, fn2);
    });
});
