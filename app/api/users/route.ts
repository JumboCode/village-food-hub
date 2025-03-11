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

/* 
 * Inserts a new user into the database.
 * Expects the request body to be JSON with the fields: username, password,
 * firstName, lastName, pronouns, role, emailAddress & phoneNumber.
 */
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
          emailAddress: [user.emailAddress],
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
