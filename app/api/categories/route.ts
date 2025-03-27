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

async function deleteInventoryItemsByCategoryName(name: string) {
  console.log("Deleting all records for category:", name);

  // First, delete related inventory items
  await prisma.inventory.deleteMany({
    where: {
      categoryName: name,
    },
  });

  // Then delete the category itself
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

    const {
      oldCategoryName,
      newCategoryName,
      oldItemName,
      itemName,
      name,
      units,
    } = data;

    const isRenamingCategory =
      oldCategoryName && newCategoryName && oldCategoryName !== newCategoryName;

    const isUpdatingItem =
      oldItemName && itemName && oldItemName !== itemName;

    // CATEGORY RENAME
    if (isRenamingCategory) {
      console.log(`Renaming category "${oldCategoryName}" → "${newCategoryName}"`);

      const updated = await prisma.categories.updateMany({
        where: {
          name: oldCategoryName,
        },
        data: {
          name: newCategoryName,
        },
      });

      // Also update inventory
      await prisma.inventory.updateMany({
        where: {
          categoryName: oldCategoryName,
        },
        data: {
          categoryName: newCategoryName,
        },
      });

      return NextResponse.json({
        response: "Category renamed successfully",
        updatedCount: updated.count,
      });
    }

    // ITEM NAME OR UNIT UPDATE
    if (isUpdatingItem || (units && Array.isArray(units))) {
      console.log("Updating item name or units...");

      const updatedCategory = await updateCategory({
        oldItemName,
        itemName,
        name,
        units,
      });

      // Sync inventory entries
      await prisma.inventory.updateMany({
        where: {
          itemName: oldItemName,
        },
        data: {
          itemName,
          units: units?.[0] ?? "", // only 1 unit stored per inventory item
        },
      });

      return NextResponse.json({
        response: "Item updated successfully",
        updatedCategory,
      });
    }

    return NextResponse.json(
      { response: "No valid update action provided." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { response: "Failed to update entry", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// DELETE
// This version supports two scenarios:
// 1. If data.itemName exists and is non-empty, delete that specific record.
// 2. Otherwise, delete all records for the given category name.
export async function DELETE(req: NextRequest) {
  try {
    const parsed = await req.json();
    const data = parsed.data ?? parsed;

    console.log("DELETE payload received:", data);

    if (!data.name || typeof data.name !== "string") {
      console.log("Error: Missing category name in DELETE request.");
      return NextResponse.json({ response: "Missing category name" }, { status: 400 });
    }

    if (data.itemName && typeof data.itemName === "string" && data.itemName.trim() !== "") {
      // Case 1: Delete a specific category/item pair
      console.log("Deleting specific category/item pair:", data);
      const item = await deleteCategory({
        itemName: data.itemName,
        name: data.name,
      });
      
      if (!item) {
        return NextResponse.json({ response: "Category not found" }, { status: 404 });
      }      

      // Delete inventory items associated with this category item
      await prisma.inventory.deleteMany({
        where: {
          itemName: data.itemName,
          categoryName: data.name,
        },
      });

      return NextResponse.json({ response: "Item deleted successfully", data: item }, { status: 200 });
    } else {
      // Case 2: Delete all records for the given category name + related inventory items
      console.log("Deleting all records for category:", data.name);
      
      // Step 1: Find all inventory items that belong to this category
      const inventoryItems = await prisma.inventory.findMany({
        where: { categoryName: data.name },
      });

      // Step 2: Delete inventory items associated with this category
      await prisma.inventory.deleteMany({
        where: { categoryName: data.name },
      });

      // Step 3: Delete categories
      const result = await deleteInventoryItemsByCategoryName(data.name);

      return NextResponse.json({
        response: "Category and related items deleted successfully",
        deletedInventoryItems: inventoryItems,
        data: result
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error in DELETE:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ response: "Failed to delete record", error: errorMessage }, { status: 500 });
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