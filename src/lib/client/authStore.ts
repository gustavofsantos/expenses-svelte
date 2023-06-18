import { writable } from 'svelte/store';

type AuthUser = {
  uid: string;
  email: string;
}

export const authUser = writable<AuthUser | null>(null);
