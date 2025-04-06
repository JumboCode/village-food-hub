import { useUser } from '@clerk/clerk-react'

// For client components only
export function userIsAdmin() {
    const { user } = useUser()
    console.log("User is:", user, "\n\n")
    return (user && user.publicMetadata.role === "Admin")
}

// For client components only
export function userIsNotVolunteer() {
    const { user } = useUser()

    if (user) {
        return user.username 
        && user.username.toLowerCase() !== "volunteer" 
        && user.publicMetadata.role !== "Volunteer"
    } 

    return true;
}
