// your route file for demographics
// const { PrismaClient } = require ('@prisma/client')
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

// Charlie added for ticket 21
// import { NextRequest, NextResponse } from 'next/server'

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
        const record = await req.json()
        if (!validDemographic(record)) {
            return NextResponse.json(
                { response : "Invalid data format" }, 
                { status : 400 })
        }

        record["lastVisitDate"] = new Date()
        
        let response = await createDemographic(record)
        return NextResponse.json(response, {status : 201})

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { response : "Failed to create record" }, 
            { status : 500 })
    }
}

// GET
export async function GET() {
    try {
        let items = await getDemographic()
        return NextResponse.json(items, { status : 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { response : "Failed to get records" }, 
            { status : 500 }
        )
    }
}

// PUT
export async function PUT(
    req: NextRequest,
    context: { params: { phoneNumber: string } }
) {
    
    // We're checking for phone number but never using it because we expect the whole record ??
    // why does PUT require a phone number in addition to the entire data
    let phoneNumber
    try {
        phoneNumber = context.params.phoneNumber
    } catch (error) {
        return NextResponse.json( 
            { response: "Missing phone number" },
            { status: 400 }
        )
    }
    
    try {
        const record = await req.json()
        if (!validDemographic(record)) {
            return NextResponse.json(
                { response : "Invalid data format" }, 
                { status : 400 }
            )
        }

        record["lastVisitDate"] = new Date()

        const items = await updateDemographic(record)
        return NextResponse.json(items, { status : 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { response : "Failed to update entry" },
            { status : 500 }
        )
    }
}

// DELETE 
export async function DELETE(
    context: { params: { phoneNumber : string } }
) {
    let phoneNum 
    try {
        phoneNum = context.params.phoneNumber
    } catch (error) {
        return NextResponse.json( 
            { response: "Missing phone number" },
            { status: 400 }
        )
    }

    try { 
        const items = await deleteDemographic(phoneNum)
        return NextResponse.json(items, {status : 200}) // return data??
    } catch (error) {
        console.log(error)
        return NextResponse.json( 
            { response : "Failed to delete record" },
            { status : 500 }
        )
    }
}

async function validDemographic(record : any) {

    try {
        if ("lastVisitDate" in record) {
            delete record["lastVisitDate"]
        }

        const fields = new Set<string>(["phoneNumber", "takeCount", "donateCount", 
                                    "name", "householdSize", "address"])
        
        let keys = Object.keys(record)
        if (keys.length !== fields.size) return false


        keys.forEach( (field: string) => {
            if (!fields.has(field)) return false
            fields.delete(field)
        })
        
        return true
        
    } catch (error) {
        console.log(error)
        return false
    }
}