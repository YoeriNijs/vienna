/**
 * Strategy for when the route is missing from the configured routes
 */
export enum VRouteNotFoundStrategy {
	// Only log the missing route
	IGNORE,

	// Navigate to the root of the app
	ROOT
}
