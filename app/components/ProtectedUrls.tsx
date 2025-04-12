import type { UserResource } from '@clerk/types';

export function userIsAdmin(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Admin";
}

export function userIsStaff(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Staff";
}

export function userIsCustomer(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Customer";
}