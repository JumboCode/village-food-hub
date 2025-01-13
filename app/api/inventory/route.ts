// route file for inventory
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

async function createInventoryItem(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  return await prisma.inventory.create({ 
    data: { ...data }
  })
}


async function getInventoryItems() {
  return await prisma.inventory.findMany()
}


async function updateInventoryItem(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  const { itemName, units, ...newData } = data;
  return await prisma.inventory.update({
    where : {
      itemName_units : {
        itemName: itemName,
        units: units,
      }
    }, data: { ...newData }
  })
}


async function deleteInventoryItem(data: {
  itemName : string,
  units    : string
}) {
  const { itemName, units } = data;

  return await prisma.inventory.delete({
    where: {
      itemName_units: {
        itemName: itemName,
        units: units,
      }
    }
  });
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      if (body.lastUpdated && typeof body.lastUpdated === 'string') {
        body.lastUpdated = new Date(body.lastUpdated);
      }
      const result = await createInventoryItem({
        ...body,
      });
      console.log(result);
      return NextResponse.json({ message: 'Successfully Created', status: 201, data: result })
    } catch(error) {
      return NextResponse.json({ message: 'Unexpected Error', status: 500 })
    }
}

export async function GET() {
  try {
    const result = await getInventoryItems()
    return NextResponse.json({data: result }, {status: 200})
  } catch(error) {
    return NextResponse.json({ message: 'Unexpected Error'}, {status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure lastUpdated is a valid Date
    if (body.lastUpdated && typeof body.lastUpdated === 'string') {
      body.lastUpdated = new Date(body.lastUpdated);
    }

    // Ensure the body contains both itemName and units (they are primary keys)
    const { itemName, units } = body;

    if (!itemName || !units) {
      console.log(itemName);
      console.log(units);
      return NextResponse.json({ message: 'Missing itemName or units', status: 400 });
    }

    const result = await updateInventoryItem({
      itemName,
      units,
      ...body,
    });

    console.log(result);
    return NextResponse.json({ message: 'OK', status: 200, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unexpected Error', status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    // Extract deleteItem from the request body and map it to itemName
    const { deleteItem, units } = body;
    const itemName = deleteItem;

    if (!itemName || !units) {
      return NextResponse.json({ message: 'Missing itemName or units', status: 400 });
    }

    const result = await deleteInventoryItem({ itemName, units });

    return NextResponse.json({ message: 'OK', status: 200, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unexpected Error', status: 500 });
  }
}


