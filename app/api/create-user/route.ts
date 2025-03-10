import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'

// Define a type for the structure of each user record from the API
interface ClerkUser {
    firstName: string,
    lastName: string,
    username: string,
    emailAddress: string,
    pronouns: string,
    role: string,
    phoneNumber: string,
    password: string
  }

export async function POST(req: NextRequest) {
    try {
      // check that user data is valid
      const newUser = await req.json()
      return await createClerksUser(newUser)

    } catch (error) {
        console.error("Full error object:", error);
        
        // Specifically log the errors array if it exists
        if (error.errors && Array.isArray(error.errors)) {
            console.error("Error details:");
            error.errors.forEach((err, index) => {
                console.error(`Error ${index + 1}:`, err);
            });
        }
        
        return NextResponse.json(
            { error: 'Error creating user', details: error.errors || error.message || 'Unknown error' }, 
            { status: 400 }
        );
    }
}

export async function createClerksUser(user: ClerkUser) {
    try {
        const validRoles = ['Admin', 'Staff', 'Volunteer', 'Customer'];
        const role = user.role.charAt(0).toUpperCase() + user.role.substring(1)
        console.log(role)
        
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Role must be one of: admin, staff, volunteer, customer' },
                { status: 400 }
            );
        }

        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: user.password,
            emailAddresses: [{
                email: user.emailAddress,
                verified: false
            }],
            publicMetadata: { 
                pronouns: user.pronouns, 
                role: role, 
                phoneNumber: user.phoneNumber 
            }
        };
        
        const client = await clerkClient();
        const newUser = await client.users.createUser(userData);
        
        return NextResponse.json({ message: 'User created', newUser });
    } catch (error) {  
        // clerk will reject a user with a weak password      
        if (error.errors && Array.isArray(error.errors)) {
            const pwnedError = error.errors.find(err => err.code === 'form_password_pwned');
            if (pwnedError) {
                return NextResponse.json(
                    { error: 'Please use a stronger password' }, 
                    { status: 400 }
                );
            }
        }
        
        return NextResponse.json(
            { error: 'Error creating new user', details: error.message || 'Unknown error' }, 
            { status: 400 }
        );
    }
}
