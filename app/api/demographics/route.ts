import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
const prisma = new PrismaClient()

// CREATE
async function createDemographic(data: {
    phoneNumber: string;
    takeCount: number;
    donateCount: number;
    name: string;
    householdSize: number;
    address: string;
  }) {
    const lastVisitDate = new Date();
    return await prisma.demographics.create({
      data: {
        ...data,
        lastVisitDate,
        previousVisitDates: [lastVisitDate],
      },
    });
}

// READ
async function getDemographic() {
    const demographics = await prisma.demographics.findMany();
    return demographics;
}

// UPDATE
async function updateDemographic(data: {
    phoneNumber: string;
    takeCount: number;
    donateCount: number;
    name: string;
    householdSize: number;
    address: string;
  }) {
    const lastVisitDate = new Date();
  
    const existingRecord = await prisma.demographics.findUnique({
      where: { phoneNumber: data.phoneNumber },
      select: { previousVisitDates: true },
    });
  
    const updatedPreviousDates = Array.isArray(existingRecord?.previousVisitDates)
      ? [...existingRecord.previousVisitDates, lastVisitDate]
      : [lastVisitDate];
  
    return await prisma.demographics.update({
      where: { phoneNumber: data.phoneNumber },
      data: {
        ...data,
        lastVisitDate,
        previousVisitDates: updatedPreviousDates,
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
  
      const response = await createDemographic(record);
      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ response: "Failed to create record" }, { status: 500 });
    }
}

// GET
export async function GET() {
    try {
        const items = await getDemographic();
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.log(error);
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
  
      const updatedRecord = await updateDemographic(record);
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
    
        return fieldsMatch;
      } catch (error) {
        console.log(error);
        return false;
      }
}