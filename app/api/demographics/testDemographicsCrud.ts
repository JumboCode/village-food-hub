//testing file for Demographics CRUD functions
//run npx prisma generate, npx prisma migrate dev & prisma db pull
//run testing file using 'npx ts-node testDemographicsCrud.ts'

//importing the CRUD functions
const CRUD = require("./route.ts");

async function main(){
    
    const testData = {
        phoneNumber : '123456788',
        takeCount: 2,
        donateCount: 5,
        name: "Viola Davis",
        householdSize: 4,
        address: "13 Winthrop Street",
        lastVisitDate: new Date("2023")
    };
    
    try {
        //TEST CREATE
        const testCreate = await CRUD.createDemographic(testData);
        console.log("created entry", testCreate);
        
        //TEST READ
        const testRead = await CRUD.getDemographic();
        console.log("read entry", testRead);
       
        //TEST UPDATE
        const testUpdateData = {
            phoneNumber : '123456789',
            takeCount: 5,
            donateCount: 16,
            name: "Emily Yuan",
            householdSize: 2,
            address: "28 Winthrop Street",
            lastVisitDate: new Date("2024")
        }
        const testUpdate = await CRUD.updateDemographic(testUpdateData);
        console.log("updated entry", testUpdate); 

        //TEST DELETE
        const testDelete = await CRUD.deleteDemographic('123456788');
        console.log("deleted entry", testDelete);

    } catch (error) {
        console.error("error", error)
    }
}


main(); 


