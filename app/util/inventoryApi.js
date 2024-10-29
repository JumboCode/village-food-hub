// This is where you will define functions specific to inventory operations

/*
  Name: inventoryApi.js
  Purpose: This file contain functions that facilitate making HTTP requests 
           to your API endpoints from the client side. They encapsulate the 
           logic for interacting with your API, making it easier to call 
           your backend from your frontend components.

           api/inventory/route.js is where your API endpoints are defined,
           i.e. GET, POST, PUT, DELETE requests for inventory items.
*/


// Write your your code below





/* // EXAMPLE CODE:
export async function getInventoryItems() {
  const response = await fetch('/api/inventory');
  if (!response.ok) {
    throw new Error('Failed to fetch inventory items');
  }
  return await response.json();
}
*/


/* Code snippet to call a specific API endpoint (by default, the GET request is used)
const response = await fetch('/api/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
*/