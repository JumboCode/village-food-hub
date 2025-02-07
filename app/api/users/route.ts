import { NextResponse, NextRequest } from 'next/server'
import { useSignIn } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server'
import { PrismaClient, Prisma } from '@prisma/client'
//const prisma = new PrismaClient()



// export async function GET() {
//     const client = await clerkClient();
//   try {
//     const result = await client.users.getUserList()
//     return NextResponse.json({data: result }, {status: 200})
//   } catch(error) {
//     return NextResponse.json({ message: 'Unexpected Error'}, {status: 500 })
//   }
// }

export async function POST(req : NextRequest) {
    const client = await clerkClient();
    const body = await req.json();
    // Find corresponsing user id

    if (!body.username) {
      return NextResponse.json({ message: 'Username not found'}, { status: 403 })
    } else if (!body.password) {
      return NextResponse.json({ message : 'Incorrect Password' }, { status : 401 })
    }

    try {
        const result = await client.users.getUserList()
        const user_id = ((username : String) => {
          for (const user of result.data){
            if (username == user.username){
                return user.id;
            }
          }
          return null;
        }) (body.username)

        // if username is not in databse
        if (user_id == null) {
          throw Error("Username not found")
        }
        
        const response = await client.users.verifyPassword({
          userId: String(user_id), 
          password: body.password
        })
        
        console.log(response.verified)
        return NextResponse.json({ 
          message: response.verified ? 'OK' : 'Incorrect Password' 
        }, {
          status: response.verified ? 200 : 401 
        })

    } catch(error) {
      console.log(error)
        return NextResponse.json({ message: 'Username not found'}, { status: 403 })
    } 

}
