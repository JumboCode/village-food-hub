import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCategory(data: {
  itemName: string;
  name: string;
  units: string[];
}) {
  return await prisma.categories.create({
    data: {
      itemName: data.itemName,
      name: data.name,
      units: data.units,
    },
  });
}

async function readCategories() {
  const categories = await prisma.categories.findMany();
  return categories;
}

/*
  This update function uses the original itemName (oldItemName) along with the category name 
  (which is not being changed) to locate the record, and then updates it with the new itemName and units.
*/
async function updateCategory(data: {
  oldItemName: string;
  itemName: string; // new name
  name: string;     // category name (unchanged)
  units: string[];
}) {
  return await prisma.categories.update({
    where: {
      itemName_name: {
        itemName: data.oldItemName, // use old value to locate record
        name: data.name,
      },
    },
    data: {
      itemName: data.itemName,       // update to new value
      units: data.units,
    },
  });
}

async function deleteCategory(data: { itemName: string; name: string }) {
  // Basic delete for a specific category/item pair.
  console.log("deleteCategory called with:", data);
  const { itemName, name } = data;
  return await prisma.categories.delete({
    where: {
      itemName_name: {
        itemName: itemName,
        name: name,
      },
    },
  });
}

async function deleteCategoriesByName(name: string) {
  // Deletes all records for a given category.
  console.log("deleteCategoriesByName called with:", name);
  return await prisma.categories.deleteMany({
    where: {
      name: name,
    },
  });
}

// POST
export async function POST(req: NextRequest) {
  try {
    const record = await req.json();
    if (!validCategory(record)) {
      return NextResponse.json(
        { response: "Invalid data format" },
        { status: 400 }
      );
    }
    const response = await createCategory({ ...record });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { response: "Failed to create record" },
      { status: 500 }
    );
  }
}

// GET
export async function GET() {
  try {
    const items = await readCategories();
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { response: "Failed to get categories" },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("Received data in API:", data);

    // Validate required keys using our flexible validCategory function and ensure oldItemName is present.
    if (!validCategory(data) || !data.oldItemName) {
      console.log("Invalid category data:", data);
      return NextResponse.json({ response: "Invalid data format" }, { status: 400 });
    }

    const updatedCategory = await updateCategory({
      oldItemName: data.oldItemName,
      itemName: data.itemName,
      name: data.name,
      units: data.units,
    });

    // (Optional: update inventory records if needed)

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ response: "Failed to update entry" }, { status: 500 });
  }
}

// DELETE
// This version supports two scenarios:
// 1. If data.itemName exists and is non-empty, delete that specific record.
// 2. Otherwise, delete all records for the given category name.
export async function DELETE(req: NextRequest) {
  try {
    const parsed = await req.json();
    // Allow for either { data: { name, itemName } } or direct payload { name, itemName }
    const data = parsed.data ?? parsed;
    console.log("DELETE payload received:", data);

    if (!("name" in data)) {
      console.log("Missing category name in payload:", data);
      return NextResponse.json({ response: "Missing category name" }, { status: 400 });
    }

    if ("itemName" in data && data.itemName && data.itemName.trim() !== "") {
      // Delete the specific category/item pair.
      console.log("Deleting specific category/item pair:", data);
      const item = await deleteCategory({
        itemName: data.itemName,
        name: data.name,
      });
      return NextResponse.json(item, { status: 200 });
    } else {
      // Delete all records with the given category name.
      console.log("Deleting all records for category:", data.name);
      const result = await deleteCategoriesByName(data.name);
      return NextResponse.json(result, { status: 200 });
    }
  } catch (error) {
    console.log("Error in DELETE:", error);
    return NextResponse.json({ response: "Failed to delete record" }, { status: 500 });
  }
}

interface CategoryRecord {
  itemName: string;
  units: string[];
  name: string;
}

function validCategory(record: CategoryRecord): boolean {
  return (
    record &&
    typeof record.itemName === "string" &&
    Array.isArray(record.units) &&
    typeof record.name === "string"
  );
}