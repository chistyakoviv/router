import RawLocation from './RawLocation';
import Location from '../Location';

export default interface RouterInterface {
    push(destination: RawLocation): void;
    replace(destination: RawLocation): void;
    go(n: number): void;
    back(): void;
    forward(): void;
    getLocation(): Location;
    match(destination: RawLocation): boolean;
};
