// route file for inventory
import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

// --- CRUD Functions ---

async function createInventoryItem(data: {
  itemName: string;
  categoryName: string;
  quantity: number; 
  units: string; 
  lastUpdated: Date;
  history?: Prisma.InputJsonValue;
}) {
  
  const newHistory = 
      {
        itemName: data.itemName,
        categoryName: data.categoryName,
        units: data.units,
        action: 'add',
        quantityChanged: data.quantity,
        date: data.lastUpdated,
      };

  return await prisma.inventory.create({ 
    data: { ...data,
      history: newHistory as Prisma.InputJsonValue
    }
  });
}

async function getInventoryItems() {
  return await prisma.inventory.findMany();
}

async function updateInventoryItem(data: {
  itemName: string;
  categoryName: string;
  quantity: number; 
  units: string; 
  lastUpdated: Date;
  history?: Prisma.InputJsonValue;
}) {
  const { itemName, units, ...newData } = data;
  
  const currentItem = await prisma.inventory.findUnique({
    where: {
      itemName_units: {
        itemName: itemName,
        units: units,
      }
    }
  });

  if (!currentItem) {
    throw new Error('Item not found');
  }

  // Determine if the update is an 'add' or 'remove'
  const action = newData.quantity > currentItem.quantity ? 'add' : 'remove';
  const quantityChanged = Math.abs(newData.quantity - currentItem.quantity);
  const updatedDate = new Date();

  // Ensure current history is an object (if null, default to an empty object)
  const currentHistory = (currentItem.history && typeof currentItem.history === 'object')
      ? (currentItem.history as Record<string, unknown>)
      : {};

  // Append the current state to the history
  const newHistory = {
    ...currentHistory,
    [`${itemName}_${units}`]: [
      ...(currentHistory[`${itemName}_${units}`] as Array<{ 
      itemName: string; 
      categoryName: string; 
      units: string; 
      action: string; 
      quantityChanged: number; 
      date: Date; 
    }> || []),
      {
        itemName: currentItem.itemName,
        categoryName: currentItem.categoryName,
        units: currentItem.units,
        action: action,
        quantityChanged: quantityChanged,
        date: updatedDate,
      }
    ]
  };

  return await prisma.inventory.update({
    where: {
      itemName_units: {
        itemName: itemName,
        units: units,
      }
    }, 
    data: { 
      ...newData,
      history: newHistory as Prisma.InputJsonValue
    }
  });
}

async function deleteInventoryItem(data: { itemName: string; units: string }) {
  return await prisma.inventory.deleteMany({
    where: {
      itemName: data.itemName,
      units: data.units,
    },
  });
}

async function updateInventoryCategoryNames(data: {
    oldCategoryName: string;
    newCategoryName: string;
}) {
    const { oldCategoryName, newCategoryName } = data;

    return await prisma.inventory.updateMany({
        where: {
            categoryName: oldCategoryName
        },
        data: {
            categoryName: newCategoryName,
            lastUpdated: new Date()
        }
    });
}

// --- Route Handlers ---

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { oldName, newName } = body;

        if (!oldName || !newName) {
            return NextResponse.json({ data: "Invalid request" }, { status: 400 });
        }

        const items = await updateInventoryCategoryNames({
            oldCategoryName: oldName,
            newCategoryName: newName
        });

        return NextResponse.json({ data: items }, { status: 200 });

    } catch (_error) {
      console.error("PATCH Error:", _error);
      return NextResponse.json({ data: "Failed to update inventory items" }, { status: 500 });
    }
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
      return NextResponse.json(
        { message: 'Successfully Created', data: result }, 
        { status: 201 }
      );
    } catch (_error) {
      console.error("POST Error:", _error);
      return NextResponse.json({ message: 'Unexpected Error' }, { status: 500 });
    }
}

export async function GET() {
  try {
    const result = await getInventoryItems();
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (_error) {
    console.error("GET Error:", _error);
    return NextResponse.json({ message: 'Unexpected Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.lastUpdated && typeof body.lastUpdated === 'string') {
      body.lastUpdated = new Date(body.lastUpdated);
    }

    const { itemName, units } = body;
    if (!itemName || !units) {
      console.log(itemName);
      console.log(units);
      return NextResponse.json({ message: 'Missing itemName or units' }, { status: 400 });
    }

    const result = await updateInventoryItem({
      itemName,
      units,
      ...body,
    });

    console.log(result);
    return NextResponse.json({ message: 'OK', data: result }, { status: 200 });
  } catch (_error) {
    console.error(_error);
    console.error("PUT Error:", _error);
    return NextResponse.json({ message: 'Unexpected Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
      const body = await req.json();
      const { itemName, units } = body;

      if (!itemName || !units) {
          return NextResponse.json({ message: "Missing itemName or units" }, { status: 400 });
      }

      // Check if the inventory item exists before deleting
      const existingItem = await prisma.inventory.findFirst({
          where: { itemName, units },
      });

      if (!existingItem) {
          return NextResponse.json({ message: "Inventory item not found" }, { status: 404 });
      }

      // Delete the inventory item
      const result = await prisma.inventory.deleteMany({
          where: { itemName, units },
      });

      console.log(`Deleted ${result.count} inventory records for "${itemName}" with unit "${units}"`);
      return NextResponse.json({ message: "Inventory item deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Inventory DELETE error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ message: "Unexpected Error", error: errorMessage }, { status: 500 });
  }
}