// api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

/* 
 * GETs a list of users from the database. Users can be filtered by their 
 * emails and usernames
 * Expects a username to be provided as a query parameter 
 */
export async function GET(req: NextRequest) {
  const client = await clerkClient();
  const searchParams = req.nextUrl.searchParams;
  let username = searchParams.get('username');
  let email = searchParams.get('emailAddress');
  let queryFilters: { [key: string]: any } = {};

  // Set filters based on query params
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
  } catch (error) {
    return new NextResponse('Error: User not found', { status: 404 });
  }
}

/* 
 * Inserts a new user into the database
 * Expects the request body to be json with the fields username, password,
 * firstName, lastName, pronouns, role, emailAddress & phoneNumber
 */
export async function POST(req: NextRequest) {
  const client = await clerkClient();
  try {
    const data = await req.json();
    console.log('Received data:', data);

    // Check for all required fields
    if (!('username' in data &&
          'password' in data &&
          'firstName' in data &&
          'lastName' in data && 
          'pronouns' in data &&
          'emailAddress' in data &&
          'phoneNumber' in data &&
          'role' in data)) {
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
      }
    });

    // Return the created user as a response
    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    const errorMessage = error?.errors?.[0]?.longMessage || 'An unknown error occurred'; 
    return new NextResponse('Error: ' + errorMessage, { status: 500 });
  }
}