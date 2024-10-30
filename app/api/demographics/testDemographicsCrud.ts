//testing file for Demographics CRUD functions
//run npx prisma generate, npx prisma migrate dev & prisma db pull
//run testing file using 'npx ts-node testDemographicsCrud.ts'

//importing the CRUD functions
const CRUD = require("./route.ts");

async function main(){
    
    const testData = {
        phoneNumber : '123456789',
        takeCount: 2,
        donateCount: 5,
        name: "Viola Davis",
        householdSize: 4,
        address: "13 Winthrop Street",
        lastVisitDate: new Date("2023-01-01")
    };
    
    try {
        //TEST READ FOR EMPTY DATBASE 
        const testReadEmpty = await CRUD.getDemographic();
        console.log("read empty database", testReadEmpty);
    
        //TEST CREATE
        const testCreate = await CRUD.createDemographic(testData);
        console.log("created entry", testCreate);
        
        //TEST READ
        const testRead = await CRUD.getDemographic();
        const createdEntry = testRead[0]; 
        if (createdEntry.takeCount !== 2) {
            throw new Error("error creating takeCount");
        }
        if (createdEntry.donateCount !== 5) {
            throw new Error("error creating donateCount");
        }
        if (createdEntry.name !== "Viola Davis") {
            throw new Error("error creating name");
        }
        if (createdEntry.householdSize !== 4) {
            throw new Error("error creating householdSize");
        }
        if (createdEntry.address !== "13 Winthrop Street") {
            throw new Error("error creating address");
        }
        console.log("read entry", testRead);
       
        //TEST UPDATE
        const testUpdateData = {
            phoneNumber : '123456789',
            takeCount: 5,
            donateCount: 16,
            name: "Emily Yuan",
            householdSize: 2,
            address: "28 Winthrop Street",
            lastVisitDate: new Date("2024-01-01")
        }
        const testUpdate = await CRUD.updateDemographic(testUpdateData);
        if (testUpdate.takeCount !== 5) {
            throw new Error("takeCount not updated");
        }
        if (testUpdate.donateCount !== 16) {
            throw new Error("donateCount not updated");
        }
        if (testUpdate.name !== "Emily Yuan") {
            throw new Error("name not updated");
        }
        if (testUpdate.householdSize !== 2) {
            throw new Error("householdSize not updated");
        }
        if (testUpdate.address !== "28 Winthrop Street") {
            throw new Error("address not updated");
        }
        if (new Date(testUpdate.lastVisitDate).getTime() !== testUpdateData.lastVisitDate.getTime()) {
            throw new Error("lastVisitDate not updated");
        }
        console.log("updated entry", testUpdate); 

    } catch (error) {
        console.error("error", error)
    }
}

//we should have empty database after it deletes
main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        //Deletes demographic that we made
        await CRUD.deleteDemographic("123456789");
});


