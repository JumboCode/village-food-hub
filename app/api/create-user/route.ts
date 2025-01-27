import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const client = await clerkClient()
    
    // check that user data is valid
    const newUser = await req.json()

    const user = await client.users.createUser(newUser)
    return NextResponse.json({ message: 'User created', user })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Error creating user' })
  }
}