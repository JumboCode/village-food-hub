import type { UserResource } from '@clerk/types';

export function userIsAdmin(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Admin";
}

export function userIsStaff(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Staff";
}

// export function userIsVolunteer(user: UserResource | null | undefined): boolean {
//   return !!user && user.publicMetadata?.role === "Volunteer";
// }

export function userIsCustomer(user: UserResource | null | undefined): boolean {
  return !!user && user.publicMetadata?.role === "Customer";
}

// export function userIsNotVolunteer(user: UserResource | null | undefined): boolean {
//   return !!user &&
//     user.username?.toLowerCase() !== "volunteer" &&
//     user.publicMetadata?.role !== "Volunteer";
// }

// export function userIsNotCustomer(user: UserResource | null | undefined): boolean {
//   return !!user &&
//     user.username?.toLowerCase() !== "customer" &&
//     user.publicMetadata?.role !== "Customer";
// }