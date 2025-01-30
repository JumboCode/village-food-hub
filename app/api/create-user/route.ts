import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
      // check that user data is valid
      const newUser = await req.json()
      return await createClerksUser(newUser)

    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Error creating user' })
    }
}

export async function createClerksUser(user : any) {
    const client = await clerkClient()
    const newUser = await client.users.createUser({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.email,
        username: user.username,
        password: user.password,
        phoneNumber: user.phoneNumber,
        publicMetadata: {
            role: user.role,         // createUserParams has no field "role"
            pronouns: user.pronouns  // createUserParams has no field "pronouns"
        }
    })
    return NextResponse.json({ message: 'User created', newUser })
}

