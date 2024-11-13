// route file for inventory
// const { PrismaClient } = require ('@prisma/client');
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function createInventoryItem(data : {
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


export async function getInventoryItems() {
  return await prisma.inventory.findMany()
}


export async function updateInventoryItem(data : {
  itemName     : string,
  categoryName : string,
  quantity     : number, 
  units        : string, 
  lastUpdated  : Date
}) {
  const { itemName, ...newData } = data;
  return await prisma.inventory.update({
    where : {
      itemName : itemName
    }, data: { ...newData }
  })
}


export async function deleteInventoryItem(deleteItem : string) {
  return await prisma.inventory.delete({
    where : {
      itemName : deleteItem
    },
  })
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
    return NextResponse.json({ message: 'OK', status: 200, data: result })
  } catch(error) {
    return NextResponse.json({ message: 'Unexpected Error', status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.lastUpdated && typeof body.lastUpdated === 'string') {
      body.lastUpdated = new Date(body.lastUpdated);
    }
    const result = await updateInventoryItem({
        ...body,
      });
      console.log(result);
      return NextResponse.json({ message: 'OK', status: 200, data: result })
    } catch(error) {
        return NextResponse.json({ message: 'Unexpected Error', status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);
        const result = await deleteInventoryItem(body.deleteItem);
        return NextResponse.json({ message: 'OK', status: 200})
    } catch(error) {
        return NextResponse.json({ message: 'Unexpected Error', status: 500 })
    }
}


