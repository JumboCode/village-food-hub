// testing file for Demographics CRUD functions
// run npx prisma generate, npx prisma migrate dev & prisma db pull
// run testing file using 'tsx testCategoriesCrud.ts'

// importing the CRUD functions
import CRUD from './route';
// import CRUD from '@app/api/categories/route.ts'

// import { createCategory, readCategories, updateCategory, deleteCategory } from './route';

async function main() {
    const testData = {
        itemName : 'apple',
        name: 'fruit',
        units: ['pound']
    }
    console.log("test");
    
    try {
        const testReadEmpty = await CRUD.readCategories();
        console.log("read empty database", testReadEmpty);
        
        //TEST CREATE
        const testCreate = await CRUD.createCategory(testData);
        console.log("created entry", testCreate);
        
        //TEST READ
        const testRead = await CRUD.readCategories();
        const createdEntry = testRead[0];
        if (createdEntry.itemName !== 'apple') {
            throw new Error("error creating itemName");
        }
        if (createdEntry.name !== 'fruit') {
            throw new Error("error creating name");
        }
        if (createdEntry.units[0] !== 'pound') {
            throw new Error("error creating units");
        }
        console.log("read entry", testRead);
    }
    catch (error) {
        console.log(error);
    }
}