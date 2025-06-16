export interface UseCase<Args extends unknown[], Response> {
	execute(...request: Args): Promise<Response> | Response;
}
