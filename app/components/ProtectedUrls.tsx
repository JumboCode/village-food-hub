import { useUser } from '@clerk/clerk-react'
import type { UserResource } from '@clerk/types';

// For client components only
export function userIsAdmin() {
    const { user } = useUser()
    return (user && user.publicMetadata.role === "Admin")
}

// For client components only
export function userIsNotVolunteer() {
    const { user } = useUser()
    return (user
        && user.username !== "Volunteer" 
        && user.publicMetadata.role === "Volunteer"
    )
}

// For server components - create these if you need server-side checks
export async function isAdminServer(user : UserResource | null | undefined) {
    return (user && user.publicMetadata.role === "Admin")
}

export async function isNotVolunteerServer(user : UserResource | null | undefined) {
    return (user
        && user.username !== "Volunteer" 
        && user.publicMetadata.role === "Volunteer"
    )
}