//testing file for Demographics CRUD functions

//importing the crud functions
//const crud = require("./route.ts");
import { createDemographic } from './route';

async function main(){
    const testData = {
        phoneNumber : '123456789',
        takeCount: 2,
        donateCount: 5,
        name: "Viola Davis",
        householdSize: 4,
        address: "13 Winthrop Street",
        lastVisitDate: Date
    };
    try {
        const testCreate = await createDemographic(testData);
        console.log("created entry," testCreate);
    } catch (error) {
        console.error("error", error)
    }

}

main(); 


