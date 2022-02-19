import HTML5History from '../../src/history/HTML5History';

describe('HTML5 history', () => {
    let historyApi: HTML5History;
    const origHistory = window.history;

    beforeEach(() => {
        historyApi = new HTML5History();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: The operand of a 'delete' operator must be optional
        delete window.history;

        window.history = {
            back: jest.fn(),
            length: 0,
            scrollRestoration: '' as ScrollRestoration,
            state: '',
            forward: jest.fn(),
            go: jest.fn(),
            pushState: jest.fn(),
            replaceState: jest.fn(),
        };
        jest.restoreAllMocks();
    });

    afterAll(() => {
        window.history = origHistory;
    });

    it('goes one step back', () => {
        historyApi.back();

        expect(window.history.back).toHaveBeenCalled();
    });

    it('goes one step forward', () => {
        historyApi.forward();

        expect(window.history.forward).toHaveBeenCalled();
    });

    it.each`
        n     | expected
        ${1}  | ${1}
        ${-1} | ${-1}
        ${2}  | ${2}
        ${-2} | ${-2}
        ${3}  | ${3}
        ${-3} | ${-3}
        ${4}  | ${4}
        ${-4} | ${-4}
        ${5}  | ${5}
        ${-5} | ${-5}
    `('calls history go with $expected', ({ n, expected }) => {
        historyApi.go(n);

        expect(window.history.go).toHaveBeenCalledWith(expected);
    });

    it('pushes path to history', () => {
        historyApi.push('/test');

        expect(window.history.pushState).toBeCalledWith({}, '', '/test');
    });

    it('replaces current path', () => {
        historyApi.replace('/test');

        expect(window.history.replaceState).toBeCalledWith({}, '', '/test');
    });
});
