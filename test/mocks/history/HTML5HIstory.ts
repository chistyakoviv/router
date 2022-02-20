import HTML5History from '../../../src/history/HTML5History';

export const mockHTML5HistoryBack = jest.fn();
export const mockHTML5HistoryForward = jest.fn();
export const mockHTML5HistoryGo = jest.fn();
export const mockHTML5HistoryPush = jest.fn();
export const mockHTML5HistoryReplace = jest.fn();

export const HTML5HistoryMock = jest.fn().mockImplementation(() => {
    const methods = {
        back: mockHTML5HistoryBack,
        forward: mockHTML5HistoryForward,
        go: mockHTML5HistoryGo,
        push: mockHTML5HistoryPush,
        replace: mockHTML5HistoryReplace,
    };
    return methods;
}) as jest.MockedClass<typeof HTML5History>;
