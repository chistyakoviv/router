import { Router } from '../../src/Router';

export const mockInit = jest.fn();
export const mockPush = jest.fn();
export const mockMatch = jest.fn();
export const mockReplace = jest.fn();
export const mockGo = jest.fn();
export const mockBack = jest.fn();
export const mockForward = jest.fn();

export const RouterMock = jest.fn().mockImplementation(() => {
    return {
        init: mockInit,
        push: mockPush,
        match: mockMatch,
        replace: mockReplace,
        go: mockGo,
        back: mockBack,
        forward: mockForward,
    };
}) as jest.MockedClass<typeof Router>;
