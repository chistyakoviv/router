import Route from "../Route";

export default interface RouteMatch {
    matchedPath?: string;
    route?: Route;
    params?: object;
};
