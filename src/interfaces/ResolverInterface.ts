export default interface ResolverInterface {
    resolve(path: string, params?: Record<string, any>): string;
}
