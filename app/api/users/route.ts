import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

interface ClerkError {
  errors: { longMessage: string }[];
}

function isClerkError(error: unknown): error is ClerkError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as { errors: unknown }).errors)
  );
}

/* 
 * GETs a list of users from the database. Users can be filtered by their 
 * emails and usernames.
 * Expects a username to be provided as a query parameter.
 */
export async function GET(req: NextRequest) {
  // Await the client instance from clerkClient
  const client = await clerkClient();
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get('username');
  const email = searchParams.get('emailAddress');
  const queryFilters: { [key: string]: string[] | number } = {};

  if (username) {
    queryFilters.username = [username];
  }
  if (email) {
    queryFilters.emailAddress = [email];
  }

  queryFilters.limit = 500;

  try {
    // Use the resolved client instance to get the user list
    const users = await client.users.getUserList(queryFilters);
    return NextResponse.json(users);
  } catch {
    return new NextResponse('Error: User not found', { status: 404 });
  }
}

/* 
 * Inserts a new user into the database.
 * Expects the request body to be JSON with the fields: username, password,
 * firstName, lastName, pronouns, role, emailAddress & phoneNumber.
 */
export async function POST(req: NextRequest) {
  try {
    const client = await clerkClient();
    if (!client || !client.users) {
      console.error("Clerk Client is not initialized properly.");
      return NextResponse.json(
        { error: "Clerk Client is unavailable. Ensure Clerk is properly configured." },
        { status: 500 }
      );
    }

    // Parse request body
    const data = await req.json();
    console.log('Received data:', data);

    // Ensure all required fields are provided
    const requiredFields = ['username', 'password', 'firstName', 'lastName', 'pronouns', 'emailAddress', 'phoneNumber', 'role'];
    for (const field of requiredFields) {
      if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate role
    const validRoles = ['Admin', 'Staff', 'Volunteer', 'Customer'];
    const role = data.role.charAt(0).toUpperCase() + data.role.substring(1);
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Create user data
    const userData = {
      username: data.username,
      password: data.password,
      emailAddress: [data.emailAddress],
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        pronouns: data.pronouns,
        role: role,
        phoneNumber: data.phoneNumber,
      },
    };

    console.log("Creating user in Clerk with:", userData);

    // Create the user with Clerk API
    const user = await client.users.createUser(userData);
    return NextResponse.json({ message: 'User created successfully', user });
  } catch (error: unknown) {
    console.error('Error creating user in Clerk:', JSON.stringify(error, null, 2));

    let errorMessage = 'An unknown error occurred';

    if (isClerkError(error)) {
      console.error("Clerk error details:", error.errors);
      const clerkMessage = error.errors[0]?.longMessage || "Unknown Clerk error.";
      return NextResponse.json({ error: clerkMessage }, { status: 400 });
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: 'Error creating user', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, firstName, lastName, pronouns, role, phoneNumber } = data;
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const client = await clerkClient();
    const updatedUser = await client.users.updateUser(userId, {
      firstName,
      lastName,
      publicMetadata: { pronouns, role, phoneNumber },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received data:', data);
    const id = data.id;
    
    const client = await clerkClient();
    const user = await client.users.deleteUser(id);
    return NextResponse.json({ message: 'User deleted successfully', user });
    
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}