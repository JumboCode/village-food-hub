import type { UserResource } from '@clerk/types';

export function userIsAdmin(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Admin";
}

export function userIsNotVolunteer(user: UserResource | null | undefined): boolean {
  return !!user &&
    user.username?.toLowerCase() !== "volunteer" &&
    user.publicMetadata?.role !== "Volunteer";
}