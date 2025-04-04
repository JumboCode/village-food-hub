import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient()

function convertTZ(date: Date) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: "EST"}));   
   
}

// CREATE
async function createDemographic(data: {
    phoneNumber: string,
    takeCount: number,
    donateCount: number,
    name: string,
    householdSize: number,
    address: string,
    lastVisitDate: Date,
    previousVisitDates: Date[]
}) {
    return await prisma.demographics.create({
        data: {
            phoneNumber: data.phoneNumber,
            takeCount: data.takeCount,
            donateCount: data.donateCount,
            name: data.name,
            householdSize: data.householdSize,
            address: data.address,
            lastVisitDate: data.lastVisitDate,
            previousVisitDates: data.previousVisitDates
        }
    });
}

// READ
async function getDemographic() {
    const demographics = await prisma.demographics.findMany();
    return demographics;
}

// UPDATE
async function updateDemographic(data: {
    phoneNumber: string,
    takeCount: number,
    donateCount: number,
    name: string,
    householdSize: number,
    address: string,
    lastVisitDate: Date,
    previousVisitDates: Date[]
}) {
    return await prisma.demographics.update({
        where: { phoneNumber: data.phoneNumber },
        data: {
            takeCount: data.takeCount,
            donateCount: data.donateCount,
            name: data.name,
            householdSize: data.householdSize,
            address: data.address,
            lastVisitDate: data.lastVisitDate,
            previousVisitDates: data.previousVisitDates
        },
    });
}

// DELETE
async function deleteDemographic(phoneNumber: string) {
    return await prisma.demographics.delete({
        where: { phoneNumber: phoneNumber },
    });
}

// POST
export async function POST(req: NextRequest) {
    try {
        const record = await req.json();
        if (!validDemographic(record)) {
            return NextResponse.json({ response: "Invalid data format" }, { status: 400 });
        }

        record.lastVisitDate = new Date()
        record.lastVisitDate = convertTZ(record.lastVisitDate)
        
        console.log("IN THE POST METHOD, date is: ", record.lastVisitDate);
        record.previousVisitDates = [record.lastVisitDate];

        const response = await createDemographic({ ...record });

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ response: "Failed to create record" }, { status: 500 });
    }
}

// GET
export async function GET(req: NextRequest) {
    const { userId, user } = auth();
    const phoneNumber = req.nextUrl.searchParams.get("phoneNumber");
  
    try {
      if (phoneNumber) {
        const record = await prisma.demographics.findUnique({
          where: { phoneNumber },
        });
  
        if (!record) {
          return new NextResponse(null, { status: 204 });
        }
  
        return NextResponse.json(record, { status: 200 });
      }
  
      // check admin role for full list
      if (!userId || user?.publicMetadata?.role !== "Admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
  
      const items = await prisma.demographics.findMany();
      return NextResponse.json(items, { status: 200 });
  
    } catch (error) {
      console.error("Failed to get demographic record:", error);
      return NextResponse.json({ response: "Failed to get records" }, { status: 500 });
    }
}

// PUT (Update an existing demographic record)
export async function PUT(req: NextRequest) {    
    try {
        const record = await req.json();
        if (!validDemographic(record)) {
            return NextResponse.json({ response: "Invalid data format" }, { status: 400 });
        }

        record.lastVisitDate = new Date();
        record.lastVisitDate = convertTZ(record.lastVisitDate);
        
        // Fetch existing record to update `previousVisitDates`
        const existingRecord = await prisma.demographics.findUnique({
            where: { phoneNumber: record.phoneNumber },
            select: { previousVisitDates: true }
        });

        if (!existingRecord) {
            return NextResponse.json({ response: "Record not found" }, { status: 404 });
        }

        record.previousVisitDates = Array.isArray(existingRecord.previousVisitDates) 
            ? [...existingRecord.previousVisitDates, record.lastVisitDate] 
            : [record.lastVisitDate];

        const updatedRecord = await updateDemographic({ ...record });

        return NextResponse.json(updatedRecord, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ response: "Failed to update entry" }, { status: 500 });
    }
}

// DELETE 
export async function DELETE(req: NextRequest) {
    try {
        const data = await req.json();
        if (!("phoneNumber" in data)) {
            return NextResponse.json({ response: "Missing phone number" }, { status: 400 });
        }

        const item = await deleteDemographic(data.phoneNumber);
        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ response: "Failed to delete record" }, { status: 500 });
    }
}

// Interface for validation
interface DemographicRecord {
    phoneNumber: string;
    takeCount: number;
    donateCount: number;
    name: string;
    householdSize: number;
    address: string;
    lastVisitDate: string;
    previousVisitDates: string[];
}

// Validate demographic input
function validDemographic(record: DemographicRecord): boolean {
    try {
        const { lastVisitDate, previousVisitDates, ...recordWithoutDates } = record;

        const fields = new Set<string>([
            "phoneNumber",
            "takeCount",
            "donateCount",
            "name",
            "householdSize",
            "address",
        ]);

        const keys = Object.keys(recordWithoutDates);
        if (keys.length !== fields.size) return false;

        let fieldsMatch = true;
        keys.forEach((field: string) => {
            if (!fields.has(field)) fieldsMatch = false;
            fields.delete(field);
        });

        return fieldsMatch && Array.isArray(previousVisitDates);
    } catch (error) {
        console.log(error);
        return false;
    }
}