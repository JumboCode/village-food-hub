import { NextResponse, NextRequest } from 'next/server'
import { useSignIn } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server'
import { PrismaClient, Prisma } from '@prisma/client'
//const prisma = new PrismaClient()



export async function GET() {
    const client = await clerkClient();
  try {
    const result = await client.users.getUserList()
    return NextResponse.json({data: result }, {status: 200})
  } catch(error) {
    return NextResponse.json({ message: 'Unexpected Error'}, {status: 500 })
  }
}

export async function verify_user(req) {
    const client = await clerkClient();
    const { username, password } = req.body;
    try {
        const result = await client.users.getUserList()
        const user_id = (username) => {
            for (const user of result.data){
                if (username == username.username){
                    return user.id;
                }
             return null;
            }
        }
        client.users.verifyPassword({userId: user_id, password: password})
    } catch(error) {
        return NextResponse.json({ message: 'Unexpected Error'}, {status: 500 })
    }

}
