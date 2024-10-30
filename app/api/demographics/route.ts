// your route file for demographics
import { PrismaClient } require ('@prisma/client');
const prisma = new PrismaClient();

//CREATE
async function createDemographic(data : {
    phoneNumber : string,
    takeCount: number,
    donateCount: number,
    name: string,
    householdSize: number,
    address: string,
    lastVisitDate: Date
}) {
    return await prisma.demographics.create(
        {   data: 
            {
                phoneNumber : data.phoneNumber,
                takeCount: data.takeCount,
                donateCount: data.donateCount,
                name: data.name,
                householdSize: data.householdSize,
                address: data.address,
                lastVisitDate: data.lastVisitDate            
            }
        }
    )
}
//READ
async function getDemographic() {
    const demographics = await prisma.demographics.findMany();
    return demographics;
}

//UPDATE
async function updateDemographic(data : {
    phoneNumber: string,
    takeCount: number,
    donateCount: number,
    name: string,
    householdSize: number,
    address: string,
    lastVisitDate: Date
}) {
    return await prisma.demographics.update({
        where: {
            phoneNumber: data.phoneNumber,
        }, data:
            {
                takeCount: data.takeCount,
                donateCount: data.donateCount,
                name: data.name,
                householdSize: data.householdSize,
                address: data.address,
                lastVisitDate: data.lastVisitDate     
            },
    })
}

//DELETE
async function deleteDemographic(phoneNumber: string) {
return await prisma.demographics.delete({
    where: {
        phoneNumber: phoneNumber,
    },
  })
}

//export the functions
module.exports = {createDemographic, getDemographic, updateDemographic, deleteDemographic};

/* OLD CRUD FUNCTIONS:
//CREATE (POST) creates a demographic entry
async function createDemographic(req, res) { //data is the info we store
    //tries to create new demographic entry in database
    const data: DemographicData = req.body;
    try {
        //creates new row in demographics table
        const newEntry = await prisma.demographics.create({
            data,
        });
        return res.status(201).json(newEntry);
    //error handling
    } catch (error) {
        console.error('Error creating demographic entry: ', error);
        return res.status(400).json({ error: "Error creating demographic entry." });
    }
}

//READ(get) retrieves demographics 
async function getDemographic(req, res) {
    try {
        //gets all the records using findMany
        const demographics = await prisma.demographics.findMany();  
        //successful request and includes fetched records 
        res.status(200).json(demographics); 
    //error handling 
    } catch (error) {
        console.error('Error reading demographics ', error);
        res.status(500).json({ error: "Error fetching demographic records." });
    }
}

//UPDATE (PUT) changes informatoin about a demographic entry
async function updateDemographic(phoneNumber, data: DemographicData) {
    //takes phoneNumber to identify which entry, data: new values for entry
    try {
        const updatedEntry = await prisma.demographics.update({
            where: { phoneNumber: phoneNumber }, //identifies entry to update
            data, //new data to apply
        });
        return updatedEntry;
    } catch (error) {
        console.error('Error updating demographic entry: ', error);
        throw error;
    }
}

//DELETE (DELETE) removes a demographic entry
async function deleteDemographic(req, res) {
    const phoneNumber = req.params.phoneNumber; 

    try {
        // Delete the demographic entry with the given phoneNumber
        await prisma.demographics.delete({
             // Identify the entry to delete using phoneNumber
            where: { phoneNumber }, 
        });
        // Send a 204 No Content status to indicate successful deletion
        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting demographic entry: ', error);
        return res.status(400).json({ error: "Error deleting demographic entry." });
    }
}

module.exports = {createDemographic, getDemographic, updateDemographic, deleteDemographic};
*/