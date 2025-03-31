import { useUser } from '@clerk/clerk-react'

export function isAdmin(){
    const { user } = useUser()
    return (user && user.publicMetadata.role == "Admin")
}

export function isNotVolunteer(){
    const { user } = useUser()
    return (user && user.username != "volunteer")
}
