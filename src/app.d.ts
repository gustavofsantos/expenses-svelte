// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@auth/sveltekit" />
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string;
				name: string;
				email: string;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
