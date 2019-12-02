import RouterInterface from "./interfaces/RouterInterface";
import Matcher from "./Matcher";
import MatcherInterface from "./interfaces/MatcherInterface";

export default class Router implements RouterInterface {
    private matcher: MatcherInterface;
    private options: object;

    constructor(options?: object, matcher: MatcherInterface = new Matcher()) {
        this.matcher = matcher;
        this.options = options || {};
    }

    match(path: string): string {
        return this.matcher.match(path);
    }
};
