// // testing file for Demographics CRUD functions
// // run npx prisma generate, npx prisma migrate dev & prisma db pull
// // run testing file using 'tsx testCategoriesCrud.ts'

// // importing the CRUD functions
// import CRUD from './route';

// async function main() {
//     const testData = {
//         itemName : 'banana',
//         name: 'fruit',
//         units: ['bunch']
//     };
    
//     try {
//         const testReadEmpty = await CRUD.readCategories();
//         console.log("read empty database", testReadEmpty);
        
//         //TEST CREATE
//         const testCreate = await CRUD.createCategory(testData);
//         console.log("created entry", testCreate);
        
//         //TEST READ
//         const testRead = await CRUD.readCategories();
//         const createdEntry = testRead[0];
//         if (createdEntry.itemName !== 'banana') {
//             throw new Error("error creating itemName");
//         }
//         if (createdEntry.name !== 'fruit') {
//             throw new Error("error creating name");
//         }
//         if (createdEntry.units[0] !== 'bunch') {
//             throw new Error("error creating units");
//         }
//         console.log("read entry", testRead);

//         const testUpdateData = {
//             itemName : 'banana',
//             name: 'fruit',
//             units: ['bag']
//         }
//         const testUpdate = await CRUD.updateCategory(testUpdateData);
//         if (testUpdate.units[0] !== 'bag') {
//             throw new Error("error updating units");
//         }
//         console.log("updated entry", testUpdate);
        
//         const deleteData = {
//             itemName: "banana",
//             name: "fruit"
//         }
//         const testDelete = await CRUD.deleteCategory(deleteData);
//         console.log("deleted entry");
//         const testReadAfterDelete = await CRUD.readCategories();
//         console.log("read after delete", testReadAfterDelete);

//     }
//     catch (error) {
//         console.log(error);
//     }
// }

// main();
