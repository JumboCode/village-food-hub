// your route file for demographics
// const { PrismaClient } = require ('@prisma/client');
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
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


// POST
export async function POST(req: NextRequest) {
    try {
        const record = await req.json();
        if (!validDemographic(record)) {
            return NextResponse.json({ 
                response : "Invalid data format", 
                status : 400 
            })
        }

        record["lastVisitDate"] = new Date()
        
        let response = createDemographic(record)
        return NextResponse.json(response, {status : 201})

    } catch (error) {
        console.log(error)
        return NextResponse.json({status : 500})
    }
}

// GET
export async function GET() {
    try {
        let items = await getDemographic()
        return NextResponse.json(items, {status : 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({status : 500})
    }
}

// PUT
export async function PUT(
    req: NextRequest,
    context: { params: { phoneNumber: string } }
) {
    try {

        if (!context.params.phoneNumber) {
            return NextResponse.json({ 
                response: "Missing phone number",
                status: 400 
            });
        }

        const record = await req.json();
        if (!validDemographic(record)) {
            return NextResponse.json({ 
                response : "Invalid data format", 
                status : 400 
            })
        }

        record["lastVisitDate"] = new Date()

        const items = updateDemographic(record)
        return NextResponse.json(items, {status : 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({status : 500})
    }
}

// DELETE 
export async function DELETE(
    context: { params: { phoneNumber: string } }
) {
    try {
        if (!context.params.phoneNumber) {
            return NextResponse.json({ 
                response: "Missing phone number",
                status: 400 
            });
        }
        
        let items = await deleteDemographic(context.params.phoneNumber)
        return NextResponse.json(items, {status : 200}) // return data??
    } catch (error) {
        console.log(error)
        return NextResponse.json({status : 500})
    }
}

async function validDemographic(record : any) {

    try {
        if ("lastVisitDate" in record) {
            delete record["lastVisitDate"]
        }

        const fields = new Set<string>(["phoneNumber", "takeCount", "donateCount", 
                                    "name", "householdSize", "address"])
        
        if (record.keys().array.length == fields.size) {
            return false;
        }

        record.keys().array.forEach( (field: string) => {
            if (fields.has(field)) {
                fields.delete(field)
            } else {
                return false
            }
        });
        
        return true;
        
    } catch (error) {
        console.log(error)
        return false
    }
}