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
  const client = await clerkClient();
  try {
    const data = await req.json();
    console.log('Received data:', data);

    // Check for all required fields
    if (
      !('username' in data &&
        'password' in data &&
        'firstName' in data &&
        'lastName' in data &&
        'pronouns' in data &&
        'emailAddress' in data &&
        'phoneNumber' in data &&
        'role' in data)
    ) {
      return new NextResponse('Error: Missing required fields', { status: 400 });
    }

    // Create the user with Clerk API
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: [data.emailAddress],
      firstName: data.firstName,
      lastName: data.lastName,
      publicMetadata: {
        pronouns: data.pronouns,
        role: data.role,
        phoneNumber: data.phoneNumber,
      },
    });

    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error('Error creating user:', error);
    let errorMessage = 'An unknown error occurred';
    if (isClerkError(error)) {
      errorMessage = error.errors[0]?.longMessage || errorMessage;
    }
    return new NextResponse('Error: ' + errorMessage, { status: 500 });
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
