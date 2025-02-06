// import { clerkClient } from "@clerk/nextjs/server";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     // Fetch all users from Clerk
//     const users = await clerkClient.users.getUserList();

//     // Filter necessary fields to avoid exposing sensitive data
//     const safeUsers = users.map(user => ({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       pronouns: user.pronouns,
//       username: user.username,
//       email: user.emailAddresses[0]?.emailAddress,  // Primary email
//       role: user.role,
//       phoneNumber: user.phoneNumber
//     }));

//     res.status(200).json(safeUsers);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }
