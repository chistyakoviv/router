import Route from "../Route";

export default interface RouteMatch {
    path: string;
    route: Route;
    params?: object;
};
