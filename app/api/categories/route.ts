import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCategory(data: {
    itemName : string,
    name: string,
    units: string[]
}) {
    return await prisma.categories.create(
        {   data: 
            {
                itemName: data.itemName,
                name: data.name,
                units: data.units
            }
        }
    )
}

async function readCategories() {
    const categories = await prisma.categories.findMany();
    return categories;
}

async function updateCategory(data : {
    itemName : string,
    name: string,
    units: string[]
}) {
    const { itemName, name, ...newData } = data;
    
    return await prisma.categories.update({
        where: {
            itemName_name: {
                itemName: itemName,
                name: name
            }
        }, data:
            {
                units: data.units
            },
    })
}

async function deleteCategory(data: {
    itemName: string,
    name: string
}) {
    const { itemName, name } = data;
    
    return await prisma.categories.delete({
        where: {
            itemName_name: {
                itemName: itemName,
                name: name,
            }
        }
        });
    }
    
// POST
export async function POST(req: NextRequest) {
    try {
        const record = await req.json()
        if (!validCategory(record)) {
            return NextResponse.json(
                { response : "Invalid data format" }, 
                { status : 400 }
            )
        }
        const response = await createCategory({ ...record })
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
        const items = await readCategories()
        return NextResponse.json(items, { status : 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { response : "Failed to get categories" }, 
            { status : 500 }
        )
    }
}

// PUT
export async function PUT(
    req: NextRequest,
) {    
    try {
        const data = await req.json()
        if (!validCategory(data)) {
            return NextResponse.json(
                { response : "Invalid data format" }, 
                { status : 400 }
            )
        }
        const item = await updateCategory({
            itemName: data.itemName, 
            name: data.name,
            units: data.units
        });
        
        return NextResponse.json(item, { status : 200 })
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
    req: NextRequest
) {
    try {
        const data = await req.json()
        if (!("itemName" in data)) {
            return NextResponse.json( 
                { response: "Missing item name" },
                { status: 400 }
            )
        }
        if (!("name" in data)) {
            return NextResponse.json( 
                { response: "Missing name" },
                { status: 400 }
            )
        }
        
        const item = await deleteCategory({
            itemName: data.itemName, 
            name: data.name 
        })
        return NextResponse.json(item, {status : 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json( 
            { response : "Failed to delete record" },
            { status : 500 }
        )
    }
}

interface CategoryRecord {
    itemName: String;
    units:    String[];
    name:     String;
  }

function validCategory(record : CategoryRecord): boolean {

    try {
        const fields = new Set<string>([
            "itemName",
            "units",
            "name",
          ]);
        
        const keys = Object.keys(record)
        if (keys.length !== fields.size) return false

        let fieldsMatch = true
        keys.forEach( (field: string) => {
            if (!fields.has(field)) fieldsMatch = false
            fields.delete(field)
        })
        
        return fieldsMatch
        
    } catch (error) {
        console.log(error)
        return false
    }
}