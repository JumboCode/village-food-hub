// your route file for demographics
// const { PrismaClient } = require ('@prisma/client');
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

// Charlie added for ticket 21
// import { NextRequest, NextResponse } from 'next/server';

//CREATE
async function createDemographic(data: {
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
export default {
    createDemographic,
    getDemographic,
    updateDemographic,
    deleteDemographic
};


// charlie added for ticket 21
// POST
// export async function POST(req: NextRequest) {
//     try {
//         // get request body
//         // const body = await req.json();
        
//         // check all fields were filled came through... is date made here??
        
//         // return result
//     } catch (error) {
//         // catch and return error
//     }
// }

// GET
// export async function GET() {
//     try {
//         // call get and return
//     } catch (error) {
//         // catch error
//     }
// }

// PUT
// export async function PUT(
//     req: NextRequest,
//     context: { params: { phoneNumber: string } }
// ) {
//     try {
//         // make sure there is a phone number

//         // do we require everything or just one field??
//         // get update data from req body
//         // const body = await req.json()
        
//         // do we update date on every PUT??

//         // update
//         // respond 200 on success
//     } catch (error) {
//         // catch error and responsd
//     }
// }

// DELETE 
// export async function DELETE(
//     req: NextRequest,
//     context: { params: { phoneNumber: string } }
// ) {
//     try {
//         // make sure there was a phone number

//         // delete based on number
//         // respond 200 on success
//     } catch (error) {
//         // catch error and responsd
//     }
// }
