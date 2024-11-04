// run test using 'tsx testDemographicsCrud.ts'

import CRUD from './route';

async function main() {
  //test 1: read empty database
  let response = await CRUD.getInventoryItems();
  console.log(response);
  if (response.length != 0) {
    throw new Error("length not 0");
  }

  //test 2: create "carrots" entry and make sure all fields are correct
  response = await CRUD.createInventoryItem({ 
                     itemName: "carrots", 
                     categoryName: "fruit", 
                     quantity: 3, 
                     units: "pounds", 
                     lastUpdated: new Date(2024, 10, 27)})
                     
  console.log(response);
  if (response.itemName !== "carrots") {
    throw new Error("itemName not carrots");
  }
  if (response.categoryName !== "fruit") {
    throw new Error("categoryName not fruit");
  }
  if (response.quantity !== 3) {
    throw new Error("quantity not 3");
  }
  if (response.units !== "pounds") {
    throw new Error("units not pounds");
  }
  if (response.lastUpdated.getDay() !== new Date(2024, 10, 27).getDay()) {
    throw new Error("Date not October 27th");
  }
  //check number of entries
  response = await CRUD.getInventoryItems();
  console.log(response);
  if (response.length != 1) {
    throw new Error("length not 1");
  }

  //test 3: update "carrots" entry and make sure all fields are correct
  response = await CRUD.updateInventoryItem({
                     itemName: "carrots", 
                     categoryName: "vegetable", 
                     quantity: 3, 
                     units: "pounds", 
                     lastUpdated: new Date(2024, 10, 27)})

  if (response.itemName !== "carrots") {
    throw new Error("itemName not carrots");
  }
  if (response.categoryName !== "vegetable") {
    throw new Error("categoryName not vegetable");
  }
  if (response.quantity !== 3) {
    throw new Error("quantity not 3");
  }
  if (response.units !== "pounds") {
    throw new Error("units not pounds");
  }
  if (response.lastUpdated.getDay() !== new Date(2024, 10, 27).getDay()) {
    throw new Error("Date not October 27th");
  }
  //make sure number of entries stays 1
  response = await CRUD.getInventoryItems();
  console.log(response);
  if (response.length != 1) {
    throw new Error("length not 1");
  }

  //test 4: create "apples" entry and make sure all fields are correct
  response = await CRUD.createInventoryItem({ 
                     itemName: "apples", 
                     categoryName: "fruit", 
                     quantity: 3, 
                     units: "pounds", 
                     lastUpdated: new Date(2024, 10, 29)})

  if (response.itemName !== "apples") {
    throw new Error("itemName not apples");
  }
  if (response.categoryName !== "fruit") {
    throw new Error("categoryName not fruit");
  }
  if (response.quantity !== 3) {
    throw new Error("quantity not 3");
  }
  if (response.units !== "pounds") {
    throw new Error("units not pounds");
  }
  if (response.lastUpdated.getDay() !== new Date(2024, 10, 29).getDay()) {
    throw new Error("Date not October 29th");
  }
  //check number of entries is 2
  response = await CRUD.getInventoryItems();
  console.log(response);
  if (response.length != 2) {
    throw new Error("length not 2");
  }

  //test 5: delete both entries and make sure database is empty
  await CRUD.deleteInventoryItem("carrots");
  await CRUD.deleteInventoryItem("apples");
  response = await CRUD.getInventoryItems();
  console.log(response);
  if (response.length != 0) {
    throw new Error("length not 0");
  } else {
    process.exit(0);
  }

}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await CRUD.deleteInventoryItem("carrots");
    await CRUD.deleteInventoryItem("apples");
  });

// run the script by doing: ts-node app/api/inventory/inventoryTests.ts from root directory