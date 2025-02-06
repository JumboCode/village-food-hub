import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req: NextRequest) {
    try {
        return await getManageUsers();
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch users", Error});
    }
}

export async function getManageUsers() {
    const client = await clerkClient();
    const userData = await client.users.getUserList();
    
    const filteredUsers = userData.data.map((user: any) => [
        user.firstName,
        user.lastName,
        user.pronouns,
        user.username,
        user.emailAddresses[0]?.emailAddress,
        user.role,
        user.phoneNumbers[0]?.phoneNumber
    ]);
  
    return NextResponse.json(filteredUsers);
}